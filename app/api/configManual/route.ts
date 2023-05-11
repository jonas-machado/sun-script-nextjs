import prisma from "../../lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { serial, olt, pon, idLivre, idOnu, cliente, id } = body;
  console.log(body);
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
      user: {
        connect: {
          id,
        },
      },
    },
    create: {
      serial,
      olt,
      pon,
      idLivre,
      idOnu,
      cliente,
      user: {
        connect: {
          id,
        },
      },
    },
  });
  return NextResponse.json({ msg: "Cadastrado com sucesso" });
}
