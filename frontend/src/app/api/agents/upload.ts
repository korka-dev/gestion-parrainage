"use server";

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import prisma from '../../lib/prisma';

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const checksum = formData.get('checksum') as string;
    const agentId = formData.get('agentId') as string;
    
    if (!file) {
      return { success: false, error: "Le fichier est manquant" };
    }
    
    if (!checksum) {
      return { success: false, error: "L'empreinte SHA256 est manquante" };
    }
    
    if (!agentId) {
      return { success: false, error: "ID de l'agent non fourni" };
    }
    
    // Vérifier que l'agent existe
    try {
      const agent = await prisma.agent.findUnique({
        where: { id: agentId }
      });
      
      if (!agent) {
        return { success: false, error: "Agent non trouvé" };
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'agent:", error);
      return { success: false, error: "Erreur lors de la vérification de l'agent" };
    }
    
    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Créer le répertoire d'upload s'il n'existe pas
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Générer un nom de fichier unique pour éviter les conflits
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${Date.now()}_${file.name}`;
    
    // Écrire le fichier sur le serveur
    const filePath = join(uploadDir, uniqueFileName);
    await writeFile(filePath, buffer);
    
    // Enregistrer les informations du fichier dans la base de données
    const newFile = await prisma.fichier.create({
      data: {
        nom: file.name,
        chemin: `/uploads/${uniqueFileName}`,
        type: file.type,
        taille: buffer.length,
        checksum: checksum,
        agentId: agentId
      }
    });

    console.log("Fichier créé avec succès:", newFile);
    
    // Ici vous pourriez ajouter une logique pour traiter le fichier CSV
    // Par exemple, lire le contenu et ajouter les électeurs à la base de données
    
    return { 
      success: true, 
      file: {
        id: newFile.id,
        nom: newFile.nom,
        chemin: newFile.chemin,
        uploadedAt: newFile.uploadedAt
      } 
    };
  } catch (error: any) {
    console.error("Erreur lors de l'upload du fichier:", error);
    return { 
      success: false, 
      error: typeof error === 'object' && error !== null && 'message' in error 
        ? error.message 
        : "Une erreur inattendue est survenue lors de l'upload." 
    };
  }
}