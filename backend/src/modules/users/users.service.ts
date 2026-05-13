import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

/**
 * Service de gestion des utilisateurs
 * Gère les profils, portefeuille et points de fidélité
 */
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Récupère un utilisateur par son ID
   */
  async getUserById(id: string): Promise<Omit<User, 'motDePasse'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const { motDePasse, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Récupère un utilisateur par son téléphone
   */
  async getUserByPhone(telephone: string): Promise<Omit<User, 'motDePasse'>> {
    const user = await this.prisma.user.findUnique({
      where: { telephone },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const { motDePasse, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Liste tous les utilisateurs avec pagination
   */
  async getAllUsers(skip = 0, take = 10) {
    const users = await this.prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        nom: true,
        prenom: true,
        telephone: true,
        email: true,
        role: true,
        walletSolde: true,
        pointsFidelite: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.user.count();

    return {
      data: users,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  /**
   * Met à jour le profil utilisateur
   */
  async updateUser(id: string, data: any) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        telephone: true,
        email: true,
        role: true,
        walletSolde: true,
        pointsFidelite: true,
        isActive: true,
      },
    });

    return user;
  }

  /**
   * Récupère le solde du portefeuille
   */
  async getWalletBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        walletSolde: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return { solde: user.walletSolde };
  }

  /**
   * Recharge le portefeuille
   */
  async topUpWallet(userId: string, montant: number) {
    if (montant <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        walletSolde: {
          increment: montant,
        },
        updatedAt: new Date(),
      },
      select: {
        id: true,
        walletSolde: true,
      },
    });

    // Créer une transaction
    await this.prisma.transaction.create({
      data: {
        userId,
        montant,
        type: 'PAIEMENT',
        statut: 'RÉUSSIE',
        description: 'Rechargement portefeuille',
      },
    });

    return { solde: user.walletSolde };
  }

  /**
   * Déduit du portefeuille (pour paiement)
   */
  async deductFromWallet(userId: string, montant: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.walletSolde < montant) {
      throw new Error('Insufficient wallet balance');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        walletSolde: {
          decrement: montant,
        },
        updatedAt: new Date(),
      },
      select: {
        id: true,
        walletSolde: true,
      },
    });

    return { solde: updatedUser.walletSolde };
  }

  /**
   * Récupère les points de fidélité
   */
  async getFidelityPoints(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        pointsFidelite: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return { points: user.pointsFidelite };
  }

  /**
   * Ajoute des points de fidélité
   */
  async addFidelityPoints(userId: string, points: number) {
    if (points <= 0) {
      throw new Error('Points must be greater than 0');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        pointsFidelite: {
          increment: points,
        },
        updatedAt: new Date(),
      },
      select: {
        id: true,
        pointsFidelite: true,
      },
    });

    return { points: user.pointsFidelite };
  }

  /**
   * Désactive un compte utilisateur
   */
  async deactivateUser(userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    return user;
  }

  /**
   * Récupère l'historique des transactions
   */
  async getTransactionHistory(userId: string, skip = 0, take = 20) {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        reservation: {
          select: {
            id: true,
            dateTrajet: true,
          },
        },
      },
    });

    const total = await this.prisma.transaction.count({
      where: { userId },
    });

    return {
      data: transactions,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }
}
