import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma"; 

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const newElecteur = await prisma.electeur.create({ data });

    return NextResponse.json(newElecteur, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


