"use server";

import prisma from "../../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import type { AgentLoginData } from "../../types/agent";

export async function loginAgent(data: AgentLoginData) {
  try {
    const { email, password } = data;

    const agent = await prisma.agent.findUnique({
      where: { email },
    });

    if (!agent) {
      return { success: false, error: "Email ou mot de passe incorrect" };
    }

    // Vérifier si le mot de passe correspond
    const isPasswordValid = await bcrypt.compare(password, agent.password);
    if (!isPasswordValid) {
      return { success: false, error: "Email ou mot de passe incorrect" };
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: agent.id, email: agent.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );

    return { success: true, token, message: "Connexion réussie" };

  } catch (error: any) {
    console.error("Erreur lors de la connexion :", error);
    return { success: false, error: "Erreur interne du serveur" };
  }
}

