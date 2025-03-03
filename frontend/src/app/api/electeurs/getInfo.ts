"use server";

import prisma from "../../lib/prisma";
import type { ElecteurInfo } from "../../types/electeur";

export async function getElecteurInfo(numeroElecteur: string): Promise<{ success: boolean; data?: ElecteurInfo; error?: string }> {
  try {
    const electeur = await prisma.electeur.findUnique({
      where: { numeroElecteur },
      select: {
        nom: true,
        bureauVote: true,
        telephone: true,
        email: true,
      },
    });

    if (!electeur) {
      return { success: false, error: "Numéro d'électeur ou code OTP incorrect" };
    }

    return { success: true, data: electeur };

  } catch (error: any) {
    console.error("Erreur lors de la récupération des informations :", error);
    return { success: false, error: "Erreur interne du serveur" };
  }
}
    
