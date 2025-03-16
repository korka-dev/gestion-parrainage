"use server";

import prisma from "../../lib/prisma";

export async function sponsorCandidate(numeroElecteur: string, numeroCNI: string, candidatCNI: string) {
  
  if (!numeroElecteur || !numeroCNI) {
    return {
      success: false,
      error: "Le numéro d'électeur et le numéro CNI du candidat sont requis",
      status: 400
    };
  }

  try {
    // Vérifier si l'électeur existe
    const electeur = await prisma.electeur.findUnique({
      where: { numeroElecteur },
    });

    if (!electeur) {
      return {
        success: false,
        error: "Numéro d'électeur incorrect ou introuvable",
        status: 404
      };
    }

    // Vérifier si l'électeur a déjà parrainé un candidat
    if (electeur.aParraine) {
      return {
        success: false,
        error: "Vous avez déjà parrainé un candidat",
        status: 400
      };
    }

    // Vérifier si le candidat existe
    const candidat = await prisma.candidat.findUnique({
      where: { numeroCNI: candidatCNI },
    });

    if (!candidat) {
      return {
        success: false,
        error: "Numéro CNI de candidat incorrect ou candidat introuvable",
        status: 404
      };
    }

    // Mettre à jour l'électeur pour indiquer qu'il a parrainé un candidat
    await prisma.electeur.update({
      where: { numeroElecteur },
      data: { aParraine: true },
    });

    return {
      success: true,
      message: "Parrainage réussi",
      status: 200
    };
  } catch (error: any) {
    console.error("Erreur dans sponsorCandidate:", error);
    
    // Messages d'erreur spécifiques selon le type d'erreur
    if (error.code === 'P2002') {
      return {
        success: false,
        error: "Conflit de données: parrainage déjà existant",
        status: 409
      };
    }

    if (error.code === 'P2025') {
      return {
        success: false,
        error: "Données introuvables",
        status: 404
      };
    }

    throw error; // Propager l'erreur pour être gérée par la fonction appelante
  }
}