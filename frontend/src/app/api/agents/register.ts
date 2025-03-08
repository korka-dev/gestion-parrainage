"use server";

import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import type { AgentData } from '../../types/agent';

export async function registerAgent(data: AgentData) {
  try {
    const existingAgent = await prisma.agent.findFirst({
      where: {
        OR: [
          { email: data.email },
          { empreinteSHA: data.empreinteSHA }
        ]
      }
    });

    if (existingAgent) {
      throw new Error("L'agent existe déjà avec ces informations");
    }

    // If it's just a verification, stop here
    if (data.checkOnly) {
      return { success: true };
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create a new agent
    const newAgent = await prisma.agent.create({
      data: {
        nom: data.lastName,
        prenom: data.firstName,
        email: data.email,
        password: hashedPassword,
        empreinteSHA: data.empreinteSHA,
        fichiers: {
          create: data.fichiers || []
        },
        periodes: {
          create: data.periodes || []
        }
      },
    });

    return { success: true, data: newAgent };
  } catch (error: any) {
    console.error('Erreur lors de la création de l\'agent:', error);
    return { success: false, error: error.message || "Erreur lors de l'enregistrement de l'agent" };
  }
}
