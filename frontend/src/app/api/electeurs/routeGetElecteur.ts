import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";



export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const numeroElecteur = searchParams.get("numeroElecteur");

    if (!numeroElecteur) {
      return NextResponse.json({ error: "Numéro d'électeur requis" }, { status: 400 });
    }

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
      return NextResponse.json({ error: "Électeur non trouvé" }, { status: 404 });
    }

    return NextResponse.json(electeur, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

