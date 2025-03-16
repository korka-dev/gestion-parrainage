import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";

export async function GET(request: Request) {
  try {
    
    const candidats = await prisma.candidat.findMany({
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


    return NextResponse.json(candidats, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


