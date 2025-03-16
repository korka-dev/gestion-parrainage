"use server";

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import prisma from '@/src/app/lib/prisma';
import { createHash } from 'crypto';
import { parse } from 'csv-parse/sync';
import { ObjectId } from 'mongodb';

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const providedChecksum = formData.get('checksum') as string;
    const agentId = formData.get('agentId') as string;
    
    // 1. Validation des entrées
    if (!file) {
      return { success: false, error: "Le fichier est manquant" };
    }
    
    if (!providedChecksum) {
      return { success: false, error: "L'empreinte SHA256 est manquante" };
    }
    
    if (!agentId) {
      return { success: false, error: "ID de l'agent non fourni" };
    }

    // Validation du format de l'ID MongoDB
    if (!ObjectId.isValid(agentId)) {
      return { success: false, error: "Format d'ID d'agent invalide" };
    }
    
    // 2. Vérification de l'agent
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
    
    // 3. Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // 4. Vérification du type de fichier
    if (!file.name.endsWith('.csv')) {
      return { success: false, error: "Le fichier doit être au format CSV" };
    }
    
    // 5. Calcul et vérification du checksum
    const calculatedChecksum = createHash('sha256').update(buffer).digest('hex');
    
    if (calculatedChecksum !== providedChecksum) {
      return { 
        success: false, 
        error: "L'empreinte SHA256 fournie ne correspond pas au contenu du fichier" 
      };
    }
    
    // 6. Créer le répertoire d'upload s'il n'existe pas
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error: any) {
      // Ignorer l'erreur si le dossier existe déjà
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
    
    // 7. Générer un nom de fichier unique
    const uniqueFileName = `${Date.now()}_${file.name}`;
    const filePath = join(uploadDir, uniqueFileName);
    
    // 8. Écrire le fichier sur le serveur
    await writeFile(filePath, buffer);
    
    // 9. Valider le contenu CSV
    try {
      const fileContent = buffer.toString('utf-8');
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
      });
      
      /* Vérifier que le CSV contient les colonnes nécessaires
      const requiredColumns = ['numeroElecteur', 'numeroCNI', 'nom', 'bureauVote', 'telephone', 'email'];
      const firstRecord = records[0] || {};
      const missingColumns = requiredColumns.filter(col => !(col in firstRecord));
      
      if (missingColumns.length > 0) {
        return { 
          success: false, 
          error: `Colonnes manquantes dans le fichier CSV: ${missingColumns.join(', ')}` 
        };
      }
      */
      
      // 10. Enregistrer les informations du fichier dans la base de données
      const newFile = await prisma.fichier.create({
        data: {
          nom: file.name,
          chemin: `/uploads/${uniqueFileName}`,
          type: file.type,
          taille: buffer.length,
          checksum: calculatedChecksum,
          agentId: agentId
        }
      });
      
      return { 
        success: true, 
        file: {
          id: newFile.id,
          nom: newFile.nom,
          chemin: newFile.chemin,
          uploadedAt: newFile.uploadedAt,
          totalRecords: records.length
        } 
      };
    } catch (csvError: any) {
      // Supprimer le fichier si le traitement CSV échoue
      const fs = require('fs');
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      return { 
        success: false, 
        error: `Erreur lors du traitement du fichier CSV: ${csvError.message}` 
      };
    }
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