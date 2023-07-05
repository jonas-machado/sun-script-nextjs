import prisma from "../../../lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { title, text } = body;
  const solution = await prisma.solutions.create({
    data: {
      title,
      text,
    },
  });
  return NextResponse.json({ msg: "Cadastrado com sucesso" });
}
