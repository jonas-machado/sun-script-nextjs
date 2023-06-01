import prisma from "../../lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { customVlan, onuType, serial, olt, pon, idLivre, idOnu, cliente, id } = body;
  console.log(body);
  const onu = await prisma.configured.upsert({
    where: {
      serial,
    },
    update: {
      onuType,
      olt,
      pon,
      idLivre,
      idOnu,
      customVlan,
      cliente,
      user: {
        connect: {
          id,
        },
      },
    },
    create: {
      serial,
      onuType,
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
