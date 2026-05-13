-- ============================================
-- STraur Database Initialization Script
-- ============================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Set the time zone
SET timezone = 'UTC';

-- ============================================
-- Initial Data Seed
-- ============================================

-- Create roles enum type
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('PASSAGER', 'CONDUCTEUR', 'ADMIN', 'CONTROLEUR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create bus status enum type
DO $$ BEGIN
    CREATE TYPE bus_status AS ENUM ('EN_SERVICE', 'HORS_SERVICE', 'EN_PAUSE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create reservation status enum type
DO $$ BEGIN
    CREATE TYPE reservation_status AS ENUM ('EN_ATTENTE', 'CONFIRMÉE', 'VALIDÉE', 'ANNULÉE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create transaction status enum type
DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('EN_ATTENTE', 'RÉUSSIE', 'ÉCHOUÉE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create transaction type enum
DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('PAIEMENT', 'REMBOURSEMENT', 'BONUS_FIDELITE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create operator type enum
DO $$ BEGIN
    CREATE TYPE operator_type AS ENUM ('MTN', 'ORANGE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create line status enum
DO $$ BEGIN
    CREATE TYPE line_status AS ENUM ('ACTIVE', 'INACTIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE partage_status AS ENUM ('EN_ATTENTE', 'ACCEPTÉ', 'REFUSÉ', 'EXPIRÉ');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('INFO', 'ALERTE', 'SUCCÈS', 'ERREUR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

echo "Database initialization completed!"
