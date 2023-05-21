import prisma from "../lib/prismadb";

export async function getSchedule() {
  return await prisma.schedule.findMany();
}
