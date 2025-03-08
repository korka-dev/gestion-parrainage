
"use server";

import prisma from "../../lib/prisma";
import jwt from "jsonwebtoken";
import { CandidatLoginData } from "../../types/candidat";


export async function loginCandidat(data: CandidatLoginData) {
  try {
    const { email, code } = data;

    const candidat = await prisma.candidat.findUnique({
      where: { email: email },
    });

    if (!candidat) {
      return { success: false, error: "Email ou code OTP incorrect"};
    }

    // Vérifier si le code OTP correspond
    if (candidat.code !== code) {
      return { success: false, error: "Email ou code OTP incorrect"};
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: candidat.id, numeroElecteur: candidat.numeroElecteur },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );

    return { success: true, token, message: "Connexion réussie" };

  } catch (error: any) {
    console.error("Erreur lors de la connexion :", error);
    return { success: false, error: "Erreur interne du serveur" };
  }
}


