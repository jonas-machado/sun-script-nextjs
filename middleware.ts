import { withAuth } from "next-auth/middleware";

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
  matcher: ["/ss"],
};
