"use server";

import prisma from "../../lib/prisma";

export async function setPeriodeParrainage(data: { dateDebut: string, dateFin: string, description: string, agentId: string, active: boolean }) {
  try {
    const { dateDebut, dateFin, description, agentId, active } = data;

    // Vérifier si l'agent existe
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return { success: false, error: "Agent non trouvé" };
    }

    // Créer ou mettre à jour la période de parrainage
    const periode = await prisma.periodeParrainage.upsert({
      where: { id: agentId }, // Assurez-vous que cela correspond à votre logique d'identification unique
      update: {
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        description,
        active,
      },
      create: {
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        description,
        active,
        agentId: agent.id,
      },
    });

    return { success: true, periode, message: "Période de parrainage mise à jour avec succès" };

  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de la période de parrainage :", error);
    return { success: false, error: "Erreur interne du serveur" };
  }
}

