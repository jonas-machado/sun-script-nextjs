import prisma from "@/lib/prismadb";
import { getCurrentUser } from "@/app/api/auth/[...nextauth]/route";

const getCurrentUserDataBase = async () => {
  try {
    const session = await getCurrentUser();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUserDataBase;
