"use server"

import prisma from '../../lib/prisma'; 
import type { ElecteurData } from '../../types/electeur';

export async function registerElecteur(data: ElecteurData) {
  try {
    // Vérifier si l'électeur existe déjà
    const existingElecteur = await prisma.electeur.findFirst({
      where: {
        OR: [
          { numeroElecteur: data.electoralCard },
          { numeroCNI: data.nationalId },
          { telephone: data.phone },
          { email: data.email }
        ]
      }
    });

    if (existingElecteur) {
      throw new Error("L'électeur existe déjà avec ces informations");
    }

    // Si c'est juste une vérification, on s'arrête ici
    if (data.checkOnly) {
      return { success: true };
    }

    // Créer un nouvel électeur
    const newElecteur = await prisma.electeur.create({
      data: {
        numeroElecteur: data.electoralCard,
        numeroCNI: data.nationalId,
        nom: data.lastName,
        bureauVote: data.pollingStation,
        telephone: data.phone,
        email: data.email,
        photo: data.photo || '',
        code: data.code || '',
      },
    });

    return { success: true, data: newElecteur };
  } catch (error: any) {
    console.error('Erreur lors de la création de l\'électeur:', error);
    return { success: false, error: error.message || "Erreur lors de l'enregistrement de l'électeur" };
  }
}
