"use server"
import prisma from "../../lib/prisma";
import type { CandidatInfo } from "../../types/candidat";

export async function getAllCandidats(): Promise<{ success: boolean; data?: CandidatInfo[]; error?: string }> {
  try {
    const candidats = await prisma.candidat.findMany({
      select: {
        id: true,
        numeroElecteur: true,
        numeroCNI: true,
        telephone: true,
        email: true,
        nom: true,
        prenom: true,
        parti: true,
        programme: true,
        photoId: true,
        couleurs: true,
        code: true
      },
    });

    return { success: true, data: candidats };

  } catch (error: any) {
    console.error("Erreur lors de la récupération des candidats :", error);
    return { success: false, error: "Erreur interne du serveur" };
  }
}

