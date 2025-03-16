import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const { dateDebut, dateFin, description, agentId } = await request.json();

    // Vérifier si l'agent existe
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent non trouvé" }, { status: 404 });
    }

    // Créer une nouvelle période de parrainage
    const periode = await prisma.periodeParrainage.create({
      data: {
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        description,
        agentId: agent.id,
      },
    });

    return NextResponse.json(
      { message: "Période de parrainage définie avec succès", periode },
      { status: 201 }
    );

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


