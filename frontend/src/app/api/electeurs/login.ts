"use server";

import prisma from "../../lib/prisma";
import jwt from "jsonwebtoken";
import type { ElecteurLoginData } from "../../types/electeur";

export async function loginElecteur(data: ElecteurLoginData) {
  try {
    const { electoralCard, code } = data;

    const electeur = await prisma.electeur.findUnique({
      where: { numeroElecteur: electoralCard },
    });

    if (!electeur) {
      return { success: false, error: "Numéro d'électeur ou code OTP incorrect"};
    }

    // Vérifier si le code OTP correspond
    if (electeur.code !== code) {
      return { success: false, error: "Numéro d'électeur ou code OTP incorrect"};
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: electeur.id, numeroElecteur: electeur.numeroElecteur },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );

    return { success: true, token, message: "Connexion réussie" };

  } catch (error: any) {
    console.error("Erreur lors de la connexion :", error);
    return { success: false, error: "Erreur interne du serveur" };
  }
}


