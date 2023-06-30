import prisma from "../lib/prismadb";

export async function getOlt() {
  const olt = await prisma.olt.findMany();

  return {
    olt,
  };
}
