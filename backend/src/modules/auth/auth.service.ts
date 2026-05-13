import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { AuthPayload, AuthResponse } from '../interfaces/auth.interface';

/**
 * Service d'authentification gérant l'inscription, connexion et tokens JWT
 */
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Inscrit un nouvel utilisateur
   */
  async register(data: any) {
    const { nom, prenom, telephone, email, motDePasse } = data;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { telephone },
          { email },
        ],
      },
    });

    if (existingUser) {
      throw new Error('User already exists with this phone or email');
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const user = await this.prisma.user.create({
      data: {
        nom,
        prenom,
        telephone,
        email,
        motDePasse: hashedPassword,
        role: 'PASSAGER',
      },
    });

    // Générer tokens
    const tokens = this.generateTokens(user);

    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Connexion utilisateur avec téléphone et mot de passe
   */
  async login(telephone: string, motDePasse: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { telephone },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const passwordValid = await bcrypt.compare(motDePasse, user.motDePasse);

    if (!passwordValid) {
      throw new Error('Invalid password');
    }

    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    // Mettre à jour lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = this.generateTokens(user);

    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Renouvelle le token d'accès avec le refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      const tokens = this.generateTokens(user);

      return {
        ...tokens,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Génère les tokens JWT (access et refresh)
   */
  private generateTokens(user: User) {
    const payload: AuthPayload = {
      id: user.id,
      telephone: user.telephone,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });

    return { accessToken, refreshToken };
  }

  /**
   * Nettoie les données sensibles de l'utilisateur
   */
  private sanitizeUser(user: User) {
    const { motDePasse, ...safeUser } = user;
    return safeUser;
  }
}
