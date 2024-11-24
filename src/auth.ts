import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { writeClient } from "./sanity/lib/write-client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERYResult } from "./sanity/types";

// Export a configured NextAuth.js instance
export const {
  handlers, // Auth routes (used in src/app/api/auth/[...nextauth]/route.ts)
  auth, // Auth middleware (not used)
  signIn,
  signOut,
} = NextAuth({
  providers: [GitHub],
  // Callbacks are used to perform actions in auth life-cycle
  callbacks: {
    // ---------------------------------------------------------------------------------------------
    // When a user signs in
    async signIn({ user, profile }) {
      // Destructure user object
      const { name, email, image } = user;
      // Destructure profile object
      const { id, login, bio } = profile!;

      // Get Author by GitHub id from Sanity
      const data = await client
        .withConfig({ useCdn: false }) // Don't use cached data
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id,
        });
      const existingUser: AUTHOR_BY_GITHUB_ID_QUERYResult = data;

      // If user doesn't exist, create a new one
      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id,
          name,
          username: login,
          email,
          image,
          bio: bio || "",
        });
      }

      // Return true to allow sign in
      return true;
    },
    // ---------------------------------------------------------------------------------------------
    // When JWT is being generated, modify it to include Sanity author id
    async jwt({ token, account, profile }) {
      // If user is logged in
      if (account && profile) {
        const data = await client
          .withConfig({ useCdn: false }) // Don't use cache
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile?.id,
          });
        const author: AUTHOR_BY_GITHUB_ID_QUERYResult = data;

        token.id = author?._id;
      }
      // Return token
      return token;
    },
    // ---------------------------------------------------------------------------------------------
    // When session is being provided, modify it to include Sanity author id from token (added above)
    async session({ session, token }) {
      // Add author id from token, to session
      Object.assign(session, { id: token.id });
      // Return the modified session
      return session;
    },
    // ---------------------------------------------------------------------------------------------
  },
});
