import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Vérifier si l'agent existe
    const agent = await prisma.agent.findUnique({
      where: { email },
    });

    if (!agent) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 404 });
    }

    // Vérifier si le mot de passe correspond
    const isPasswordValid = await bcrypt.compare(password, agent.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: agent.id, email: agent.email },
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


