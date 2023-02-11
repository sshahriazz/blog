import { withAuth } from "next-auth/middleware";

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    authorized(data) {
      const { req, token } = data;

      // `/admin` requires admin role
      if (req.nextUrl.pathname === "/admin") {
        return token?.userRole === "admin";
      }
      // `/me` only requires the user to be logged in

      return !!token;
    },
  },
});

export const config = {
  matcher: ["/me", "/admin", "/api/blog/create", "/blog/create", "/my-blog"],
};
