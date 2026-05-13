// This is a seed file for Prisma
// Run: npm run prisma:seed

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.partageTrajet.deleteMany();
  await prisma.qrCodeLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.trajetFavori.deleteMany();
  await prisma.horaire.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.arret.deleteMany();
  await prisma.ligne.deleteMany();
  await prisma.user.deleteMany();

  console.log('✓ Cleared existing data');

  // Create users
  const admin = await prisma.user.create({
    data: {
      nom: 'Admin',
      prenom: 'STraur',
      telephone: '+2250101010101',
      email: 'admin@straur.com',
      motDePasse: await bcrypt.hash('AdminPassword123!', 10),
      role: 'ADMIN',
      walletSolde: 5000,
      pointsFidelite: 0,
    },
  });

  const conducteur = await prisma.user.create({
    data: {
      nom: 'Kouakou',
      prenom: 'Jean',
      telephone: '+2250505050505',
      email: 'conducteur@straur.com',
      motDePasse: await bcrypt.hash('ConducteurPass123!', 10),
      role: 'CONDUCTEUR',
      walletSolde: 0,
      pointsFidelite: 0,
    },
  });

  const controleur = await prisma.user.create({
    data: {
      nom: 'Yao',
      prenom: 'Pierre',
      telephone: '+2250606060606',
      email: 'controleur@straur.com',
      motDePasse: await bcrypt.hash('ControleurPass123!', 10),
      role: 'CONTROLEUR',
      walletSolde: 0,
      pointsFidelite: 0,
    },
  });

  const passager1 = await prisma.user.create({
    data: {
      nom: 'Dupont',
      prenom: 'Marie',
      telephone: '+2250707070707',
      email: 'marie.dupont@email.com',
      motDePasse: await bcrypt.hash('PassagerPass123!', 10),
      role: 'PASSAGER',
      walletSolde: 10000,
      pointsFidelite: 15,
    },
  });

  const passager2 = await prisma.user.create({
    data: {
      nom: 'Martin',
      prenom: 'Paul',
      telephone: '+2250808080808',
      email: 'paul.martin@email.com',
      motDePasse: await bcrypt.hash('PassagerPass123!', 10),
      role: 'PASSAGER',
      walletSolde: 5000,
      pointsFidelite: 8,
    },
  });

  console.log('✓ Created 5 users');

  // Create lines
  const ligne1 = await prisma.ligne.create({
    data: {
      nom: 'Ligne 1 - Abobo ↔ Plateau',
      description: 'Liaison Abobo vers Plateau via Cocody',
      couleur: '#FF0000',
      statut: 'ACTIVE',
    },
  });

  const ligne2 = await prisma.ligne.create({
    data: {
      nom: 'Ligne 2 - Treichville ↔ Yopougon',
      description: 'Liaison Treichville vers Yopougon',
      couleur: '#00FF00',
      statut: 'ACTIVE',
    },
  });

  const ligne3 = await prisma.ligne.create({
    data: {
      nom: 'Ligne 3 - Cocody ↔ Marcory',
      description: 'Liaison Cocody vers Marcory',
      couleur: '#0000FF',
      statut: 'ACTIVE',
    },
  });

  console.log('✓ Created 3 lines');

  // Create stops for Ligne 1
  const arret1_1 = await prisma.arret.create({
    data: {
      nom: 'Gare Abobo',
      latitude: 5.5569,
      longitude: -4.0062,
      ligneId: ligne1.id,
    },
  });

  const arret1_2 = await prisma.arret.create({
    data: {
      nom: 'Cocody 2 Plateaux',
      latitude: 5.5456,
      longitude: -4.015,
      ligneId: ligne1.id,
    },
  });

  const arret1_3 = await prisma.arret.create({
    data: {
      nom: 'Plateau INPHB',
      latitude: 5.3309,
      longitude: -4.0326,
      ligneId: ligne1.id,
    },
  });

  const arret1_4 = await prisma.arret.create({
    data: {
      nom: 'Gare Plateau',
      latitude: 5.3297,
      longitude: -4.0286,
      ligneId: ligne1.id,
    },
  });

  // Create stops for Ligne 2
  const arret2_1 = await prisma.arret.create({
    data: {
      nom: 'Gare Treichville',
      latitude: 5.3458,
      longitude: -4.0642,
      ligneId: ligne2.id,
    },
  });

  const arret2_2 = await prisma.arret.create({
    data: {
      nom: 'Gare Yopougon',
      latitude: 5.3719,
      longitude: -4.1314,
      ligneId: ligne2.id,
    },
  });

  // Create stops for Ligne 3
  const arret3_1 = await prisma.arret.create({
    data: {
      nom: 'Cocody Angré',
      latitude: 5.5456,
      longitude: -4.015,
      ligneId: ligne3.id,
    },
  });

  const arret3_2 = await prisma.arret.create({
    data: {
      nom: 'Marcory Bonoumin',
      latitude: 5.2867,
      longitude: -3.9897,
      ligneId: ligne3.id,
    },
  });

  console.log('✓ Created 10 stops');

  // Create schedules
  const horaire1 = await prisma.horaire.create({
    data: {
      ligneId: ligne1.id,
      heureDepart: '06:00',
      heureArrivee: '07:00',
      joursActifs: '["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]',
    },
  });

  const horaire2 = await prisma.horaire.create({
    data: {
      ligneId: ligne1.id,
      heureDepart: '08:00',
      heureArrivee: '09:00',
      joursActifs: '["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]',
    },
  });

  const horaire3 = await prisma.horaire.create({
    data: {
      ligneId: ligne2.id,
      heureDepart: '07:00',
      heureArrivee: '08:30',
      joursActifs: '["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]',
    },
  });

  console.log('✓ Created 3 schedules');

  // Create buses
  const bus1 = await prisma.bus.create({
    data: {
      immatriculation: 'CI-001-AB',
      ligneId: ligne1.id,
      conducteurId: conducteur.id,
      statut: 'EN_SERVICE',
      latitudeActuelle: 5.5569,
      longitudeActuelle: -4.0062,
      capacitePassagers: 50,
    },
  });

  const bus2 = await prisma.bus.create({
    data: {
      immatriculation: 'CI-002-CD',
      ligneId: ligne2.id,
      conducteurId: null,
      statut: 'EN_PAUSE',
      latitudeActuelle: 5.3458,
      longitudeActuelle: -4.0642,
      capacitePassagers: 45,
    },
  });

  const bus3 = await prisma.bus.create({
    data: {
      immatriculation: 'CI-003-EF',
      ligneId: ligne3.id,
      conducteurId: null,
      statut: 'EN_SERVICE',
      latitudeActuelle: 5.5456,
      longitudeActuelle: -4.015,
      capacitePassagers: 40,
    },
  });

  console.log('✓ Created 3 buses');

  // Create reservations
  const reservation1 = await prisma.reservation.create({
    data: {
      userId: passager1.id,
      ligneId: ligne1.id,
      arretMonteeId: arret1_1.id,
      arretDescenteId: arret1_3.id,
      horaireId: horaire1.id,
      dateTrajet: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      statut: 'EN_ATTENTE',
      montant: 1500,
      nombrePassagers: 1,
    },
  });

  const reservation2 = await prisma.reservation.create({
    data: {
      userId: passager2.id,
      ligneId: ligne2.id,
      arretMonteeId: arret2_1.id,
      arretDescenteId: arret2_2.id,
      horaireId: horaire3.id,
      dateTrajet: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
      statut: 'CONFIRMÉE',
      montant: 2000,
      nombrePassagers: 2,
    },
  });

  console.log('✓ Created 2 reservations');

  // Create transactions
  await prisma.transaction.create({
    data: {
      userId: passager1.id,
      reservationId: reservation1.id,
      montant: 1500,
      type: 'PAIEMENT',
      statut: 'EN_ATTENTE',
      operateur: 'MTN',
      description: 'Paiement trajet Ligne 1',
    },
  });

  await prisma.transaction.create({
    data: {
      userId: passager2.id,
      reservationId: reservation2.id,
      montant: 2000,
      type: 'PAIEMENT',
      statut: 'RÉUSSIE',
      operateur: 'ORANGE',
      reference: 'OM-2026-05-13-001',
      description: 'Paiement trajet Ligne 2',
    },
  });

  console.log('✓ Created 2 transactions');

  // Create favorites
  await prisma.trajetFavori.create({
    data: {
      userId: passager1.id,
      ligneId: ligne1.id,
      arretMonteeId: arret1_1.id,
      arretDescenteId: arret1_3.id,
      libelle: 'Maison → Travail',
    },
  });

  console.log('✓ Created 1 favorite route');

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: passager1.id,
      titre: 'Bus en approche',
      message: 'Votre bus arrive dans 5 minutes à Gare Plateau',
      type: 'ALERT',
      lu: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: passager2.id,
      titre: 'Bonus fidelite',
      message: 'Vous avez gagné 10 points de fidelité!',
      type: 'PROMOTION',
      lu: false,
    },
  });

  console.log('✓ Created 2 notifications');

  console.log('\n✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
