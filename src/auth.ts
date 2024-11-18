import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

// Export a configured NextAuth.js instance
export const {
  handlers, // Auth routes (used in src/app/api/auth/[...nextauth]/route.ts)
  auth, // Auth middleware (not used)
} = NextAuth({ providers: [GitHub] });
