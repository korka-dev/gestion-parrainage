"use server";

import prisma from "../../lib/prisma";
import type { CandidatInfo } from "../../types/candidat"; 

export async function getCandidatInfo(numeroElecteur: string): Promise<{ success: boolean; data?: CandidatInfo; error?: string }> {
  try {
    const candidat = await prisma.candidat.findUnique({
      where: { numeroElecteur },
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

    if (!candidat) {
      return { success: false, error: "Numéro d'électeur incorrect ou candidat non trouvé" };
    }

    return { success: true, data: candidat };

  } catch (error: any) {
    console.error("Erreur lors de la récupération des informations du candidat :", error);
    return { success: false, error: "Erreur interne du serveur" };
  }
}
