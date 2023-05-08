import prisma from "../lib/prismadb";

export async function getOlt() {
  const oltZteChimaData = await prisma.oltZteChima.findMany();
  const oltIntelbrasData = await prisma.oltIntelbras.findMany();
  const oltDatacomData = await prisma.oltDatacom.findMany();

  return {
    oltZteChimaData,
    oltIntelbrasData,
    oltDatacomData,
  };
}
