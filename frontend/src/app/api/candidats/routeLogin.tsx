import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    // Vérifier si l'électeur existe
    const candidat = await prisma.candidat.findUnique({
      where: { email },
    });

    if (!candidat) {
      return NextResponse.json({ error: "Email ou code OTP incorrect" }, { status: 404 });
    }

    // Vérifier si l'OTP correspond
    if (candidat.code !== otp) {
      return NextResponse.json({ error: "Email ou code OTP incorrect" }, { status: 401 });
    }

    // Générer un token JWT (facultatif)
    const token = jwt.sign(
      { id: candidat.id, numeroElecteur: candidat.numeroElecteur },
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
