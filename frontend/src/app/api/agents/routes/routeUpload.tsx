import prisma from "@/src/app/lib/prisma";


export async function upload(file: File, agentId: string) {
  try {
    // Convertir le fichier en un tableau d'octets pour obtenir sa taille
    const fileBuffer = await file.arrayBuffer();
    const fileSize = fileBuffer.byteLength;

    // Enregistrer les informations du fichier dans la base de données
    const newFile = await prisma.fichier.create({
      data: {
        nom: file.name,
        chemin: `uploads/${file.name}`,
        type: file.type,
        taille: fileSize,
        agentId: agentId
      }
    });

    return newFile;
  } catch (error: any) {
    throw new Error(`Erreur lors de l'upload du fichier: ${error.message}`);
  }
}

