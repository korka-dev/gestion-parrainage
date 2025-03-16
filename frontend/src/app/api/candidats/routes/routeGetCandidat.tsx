import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const numeroElecteur = searchParams.get("numeroElecteur");

    if (!numeroElecteur) {
      return NextResponse.json({ error: "Numéro d'électeur requis" }, { status: 400 });
    }

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
        couleurs: true
      },
    });

    if (!candidat) {
      return NextResponse.json({ error: "Candidat non trouvé" }, { status: 404 });
    }

    return NextResponse.json(candidat, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
