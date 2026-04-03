-- CreateEnum
CREATE TYPE "TypeEspace" AS ENUM ('SALLE_DE_CONFERENCE', 'JARDIN', 'ROOFTOP', 'SALLE_DE_FETE');

-- CreateEnum
CREATE TYPE "TypePrestataire" AS ENUM ('TRAITEUR', 'DJ', 'PHOTOGRAPHE', 'DECORATEUR');

-- CreateEnum
CREATE TYPE "TypeClient" AS ENUM ('PARTICULIER', 'ENTREPRISE');

-- CreateEnum
CREATE TYPE "StatutReservation" AS ENUM ('CONFIRMEE', 'ANNULEE', 'TERMINEE');

-- CreateTable
CREATE TABLE "espaces" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "capaciteMax" INTEGER NOT NULL,
    "type" "TypeEspace" NOT NULL,
    "prixParJour" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "espaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prestataires" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "TypePrestataire" NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prestataires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "type" "TypeClient" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "espaceId" INTEGER NOT NULL,
    "prestataireId" INTEGER,
    "dateEvenement" DATE NOT NULL,
    "nombreInvites" INTEGER NOT NULL,
    "montantTotal" DECIMAL(10,2) NOT NULL,
    "statut" "StatutReservation" NOT NULL DEFAULT 'CONFIRMEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "espaces_code_key" ON "espaces"("code");

-- CreateIndex
CREATE UNIQUE INDEX "prestataires_email_key" ON "prestataires"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_espaceId_fkey" FOREIGN KEY ("espaceId") REFERENCES "espaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_prestataireId_fkey" FOREIGN KEY ("prestataireId") REFERENCES "prestataires"("id") ON DELETE SET NULL ON UPDATE CASCADE;
