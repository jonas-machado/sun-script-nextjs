import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log(req.nextauth.token);
  },
  {
    pages: {
      signIn: "/",
    },
  }
);

export const config = {
  matcher: ["/"],
};
