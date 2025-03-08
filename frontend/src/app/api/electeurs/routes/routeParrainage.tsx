import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const { numeroElecteur, numeroCNI } = await request.json();

    // Vérifier si les données requises sont présentes
    if (!numeroElecteur || !numeroCNI) {
      return NextResponse.json(
        { error: "Le numéro d'électeur et le numéro CNI du candidat sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'électeur existe
    const electeur = await prisma.electeur.findUnique({
      where: { numeroElecteur },
    });

    if (!electeur) {
      return NextResponse.json(
        { error: "Numéro d'électeur incorrect ou introuvable" },
        { status: 404 }
      );
    }

    // Vérifier si l'électeur a déjà parrainé un candidat
    if (electeur.aParraine) {
      return NextResponse.json(
        { error: "Vous avez déjà parrainé un candidat" },
        { status: 400 }
      );
    }

    // Vérifier si le candidat existe
    const candidat = await prisma.candidat.findUnique({
      where: { numeroCNI },
    });

    if (!candidat) {
      return NextResponse.json(
        { error: "Numéro CNI de candidat incorrect ou candidat introuvable" },
        { status: 404 }
      );
    }

    // Mettre à jour l'électeur pour indiquer qu'il a parrainé un candidat
    await prisma.electeur.update({
      where: { numeroElecteur },
      data: { aParraine: true },
    });

    return NextResponse.json(
      { success: true, message: "Parrainage réussi" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur lors du parrainage:", error);
    
    // Messages d'erreur spécifiques selon le type d'erreur
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Conflit de données: parrainage déjà existant" },
        { status: 409 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Données introuvables" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}