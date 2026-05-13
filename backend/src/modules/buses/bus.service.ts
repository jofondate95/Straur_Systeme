import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

/**
 * Service de gestion de la flotte de bus
 * Gère l'affectation des conducteurs, statuts et localisation GPS
 */
@Injectable()
export class BusService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crée un nouveau bus
   */
  async createBus(data: any) {
    return this.prisma.bus.create({
      data: {
        immatriculation: data.immatriculation,
        ligneId: data.ligneId,
        conducteurId: data.conducteurId,
        capacitePassagers: data.capacitePassagers || 40,
        latitudeActuelle: 0,
        longitudeActuelle: 0,
        statut: 'EN_SERVICE',
      },
      include: {
        ligne: true,
        conducteur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            telephone: true,
          },
        },
      },
    });
  }

  /**
   * Récupère tous les bus
   */
  async getAllBuses() {
    return this.prisma.bus.findMany({
      include: {
        ligne: true,
        conducteur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            telephone: true,
          },
        },
      },
      orderBy: { immatriculation: 'asc' },
    });
  }

  /**
   * Récupère les bus par ligne
   */
  async getBusesByLigne(ligneId: string) {
    return this.prisma.bus.findMany({
      where: { ligneId },
      include: {
        ligne: true,
        conducteur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            telephone: true,
          },
        },
      },
      orderBy: { immatriculation: 'asc' },
    });
  }

  /**
   * Récupère un bus par son ID
   */
  async getBusById(id: string) {
    const bus = await this.prisma.bus.findUnique({
      where: { id },
      include: {
        ligne: true,
        conducteur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            telephone: true,
          },
        },
      },
    });

    if (!bus) {
      throw new Error('Bus not found');
    }

    return bus;
  }

  /**
   * Met à jour les informations d'un bus
   */
  async updateBus(id: string, data: any) {
    return this.prisma.bus.update({
      where: { id },
      data: {
        conducteurId: data.conducteurId,
        statut: data.statut,
        capacitePassagers: data.capacitePassagers,
        updatedAt: new Date(),
      },
      include: {
        ligne: true,
        conducteur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            telephone: true,
          },
        },
      },
    });
  }

  /**
   * Supprime un bus
   */
  async deleteBus(id: string) {
    return this.prisma.bus.delete({
      where: { id },
    });
  }

  /**
   * Met à jour la localisation GPS d'un bus (temps réel)
   */
  async updateBusLocation(id: string, latitude: number, longitude: number) {
    return this.prisma.bus.update({
      where: { id },
      data: {
        latitudeActuelle: latitude,
        longitudeActuelle: longitude,
        updatedAt: new Date(),
      },
      include: {
        ligne: true,
      },
    });
  }

  /**
   * Récupère la localisation actuelle d'un bus
   */
  async getBusLocation(id: string) {
    const bus = await this.prisma.bus.findUnique({
      where: { id },
      select: {
        id: true,
        immatriculation: true,
        latitudeActuelle: true,
        longitudeActuelle: true,
        statut: true,
        updatedAt: true,
      },
    });

    if (!bus) {
      throw new Error('Bus not found');
    }

    return bus;
  }

  /**
   * Met à jour le statut d'un bus
   */
  async updateBusStatus(id: string, statut: string) {
    return this.prisma.bus.update({
      where: { id },
      data: {
        statut,
        updatedAt: new Date(),
      },
      include: {
        ligne: true,
      },
    });
  }

  /**
   * Récupère les bus en service pour une ligne
   */
  async getActiveBusesByLigne(ligneId: string) {
    return this.prisma.bus.findMany({
      where: {
        ligneId,
        statut: 'EN_SERVICE',
      },
      select: {
        id: true,
        immatriculation: true,
        latitudeActuelle: true,
        longitudeActuelle: true,
        capacitePassagers: true,
        statut: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Affecte un conducteur à un bus
   */
  async assignConductorToBus(busId: string, conducteurId: string) {
    return this.prisma.bus.update({
      where: { id: busId },
      data: {
        conducteurId,
        statut: 'EN_SERVICE',
        updatedAt: new Date(),
      },
      include: {
        conducteur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            telephone: true,
          },
        },
      },
    });
  }

  /**
   * Retirer un conducteur d'un bus
   */
  async removeConductorFromBus(busId: string) {
    return this.prisma.bus.update({
      where: { id: busId },
      data: {
        conducteurId: null,
        statut: 'EN_PAUSE',
        updatedAt: new Date(),
      },
    });
  }
}
