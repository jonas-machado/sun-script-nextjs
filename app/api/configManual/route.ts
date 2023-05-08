import prisma from "../../lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { serial, olt, pon, idLivre, idOnu, cliente } = body;

  const onu = await prisma.configured.upsert({
    where: {
      serial,
    },
    update: {
      olt,
      pon,
      idLivre,
      idOnu,
      cliente,
    },
    create: {
      serial,
      olt,
      pon,
      idLivre,
      idOnu,
      cliente,
    },
  });
  return NextResponse.json({ msg: "Cadastrado com sucesso" });
}
