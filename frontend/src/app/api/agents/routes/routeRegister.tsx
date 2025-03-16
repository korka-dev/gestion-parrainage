import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const newAgent = await prisma.agent.create({ data });

    return NextResponse.json(newAgent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

