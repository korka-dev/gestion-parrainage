"use server"

import prisma from '../../lib/prisma';
import { CandidatData } from '../../types/candidat';

export async function registerCandidat(data: CandidatData) {
  try {
    const existingCandidat = await prisma.candidat.findFirst({
      where: {
        OR: [
          { numeroElecteur: data.numeroElecteur },
          { numeroCNI: data.numeroCNI },
          { telephone: data.telephone },
          { email: data.email }
        ]
      }
    });

    if (existingCandidat) {
      throw new Error("Le candidat existe déjà avec ces informations");
    }

    if (data.checkOnly) {
      return { success: true };
    }

    // Création d'un objet candidat avec tous les champs requis
    const candidatData = {
      numeroElecteur: data.numeroElecteur,
      numeroCNI: data.numeroCNI,
      telephone: data.telephone,
      email: data.email,
      nom: data.nom,
      prenom: data.prenom,
      parti: data.parti,
      programme: data.programme || [],
      code: data.code || '',
      couleurs: data.couleurs || [],

      ...(data.photoId ? { photoId: data.photoId } : {})
    };

    const newCandidat = await prisma.candidat.create({
      data: candidatData as any 
    });

    return { success: true, data: newCandidat };
  } catch (error: any) {
    console.error('Erreur lors de la création du candidat:', error);
    return { success: false, error: error.message || "Erreur lors de l'enregistrement du candidat" };
  }
}
