import bcrypt from "bcrypt";
import prisma from "../../../lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;
  console.log(body);
  const userIn = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (userIn) {
    return NextResponse.json({ error: "Email já cadastrado" });
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      emailVerified: new Date(),
    },
  });
  return NextResponse.json(user);
}
