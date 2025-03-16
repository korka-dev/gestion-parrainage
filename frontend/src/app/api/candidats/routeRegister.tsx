import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const newCandidat = await prisma.candidat.create({ data });
    
    return NextResponse.json(newCandidat, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
