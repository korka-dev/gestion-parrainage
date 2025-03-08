import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { numeroElecteur, otp } = await request.json();

    // Vérifier si l'électeur existe
    const electeur = await prisma.electeur.findUnique({
      where: { numeroElecteur },
    });

    if (!electeur) {
      return NextResponse.json({ error: "Numéro d'électeur ou code OTP incorrect" }, { status: 404 });
    }

    // Vérifier si l'OTP correspond
    if (electeur.code !== otp) {
      return NextResponse.json({ error: "Numéro d'électeur ou code OTP incorrect" }, { status: 401 });
    }

    // Générer un token JWT (facultatif)
    const token = jwt.sign(
      { id: electeur.id, 
        numeroElecteur: electeur.numeroElecteur,
        numeroCNI: electeur.numeroCNI
       },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );

    return NextResponse.json(
      { message: "Connexion réussie", token },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
