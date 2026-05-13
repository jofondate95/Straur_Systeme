import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

/**
 * Service de gestion des lignes de transport, arrêts et horaires
 */
@Injectable()
export class LignesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crée une nouvelle ligne
   */
  async createLigne(data: any) {
    return this.prisma.ligne.create({
      data: {
        nom: data.nom,
        description: data.description,
        couleur: data.couleur,
        statut: 'ACTIVE',
      },
      include: {
        arrets: true,
      },
    });
  }

  /**
   * Récupère toutes les lignes
   */
  async getAllLignes() {
    return this.prisma.ligne.findMany({
      include: {
        arrets: true,
        horaires: true,
        buses: true,
      },
      orderBy: { nom: 'asc' },
    });
  }

  /**
   * Récupère une ligne par son ID
   */
  async getLigneById(id: string) {
    const ligne = await this.prisma.ligne.findUnique({
      where: { id },
      include: {
        arrets: {
          orderBy: { createdAt: 'asc' },
        },
        horaires: true,
        buses: true,
      },
    });

    if (!ligne) {
      throw new Error('Ligne not found');
    }

    return ligne;
  }

  /**
   * Met à jour une ligne
   */
  async updateLigne(id: string, data: any) {
    return this.prisma.ligne.update({
      where: { id },
      data: {
        nom: data.nom,
        description: data.description,
        couleur: data.couleur,
        statut: data.statut,
        updatedAt: new Date(),
      },
      include: {
        arrets: true,
      },
    });
  }

  /**
   * Supprime une ligne
   */
  async deleteLigne(id: string) {
    return this.prisma.ligne.delete({
      where: { id },
    });
  }

  /**
   * Crée un arrêt pour une ligne
   */
  async createArret(data: any) {
    return this.prisma.arret.create({
      data: {
        nom: data.nom,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        ligneId: data.ligneId,
      },
    });
  }

  /**
   * Récupère tous les arrêts d'une ligne
   */
  async getArretsByLigne(ligneId: string) {
    return this.prisma.arret.findMany({
      where: { ligneId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Supprime un arrêt
   */
  async deleteArret(arretId: string) {
    return this.prisma.arret.delete({
      where: { id: arretId },
    });
  }

  /**
   * Crée un horaire pour une ligne
   */
  async createHoraire(data: any) {
    return this.prisma.horaire.create({
      data: {
        ligneId: data.ligneId,
        heureDepart: data.heureDepart,
        heureArrivee: data.heureArrivee,
        joursActifs: JSON.stringify(data.joursActifs),
      },
    });
  }

  /**
   * Récupère les horaires d'une ligne
   */
  async getHorairesByLigne(ligneId: string) {
    const horaires = await this.prisma.horaire.findMany({
      where: { ligneId },
      orderBy: { heureDepart: 'asc' },
    });

    return horaires.map((h) => ({
      ...h,
      joursActifs: JSON.parse(h.joursActifs),
    }));
  }

  /**
   * Supprime un horaire
   */
  async deleteHoraire(horaireId: string) {
    return this.prisma.horaire.delete({
      where: { id: horaireId },
    });
  }

  /**
   * Récupère les lignes actives pour l'accueil mobile
   */
  async getActiveLignes() {
    return this.prisma.ligne.findMany({
      where: { statut: 'ACTIVE' },
      include: {
        arrets: true,
        buses: {
          where: { statut: 'EN_SERVICE' },
        },
      },
      orderBy: { nom: 'asc' },
    });
  }
}
