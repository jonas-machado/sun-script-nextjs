import prisma from "../lib/prismadb";

export async function getSolutions() {
  return await prisma.solutions.findMany();
}
