import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import LinkedIn from "next-auth/providers/linkedin";

import { fetchToken } from "@/lib/auth/serverActions";

export const { handlers, auth } = NextAuth({
  providers: [Google, Facebook, LinkedIn],
  callbacks: {
    jwt: async ({ token, account }) => {
      if (!account) return token;

      const accessToken = await fetchToken({
        token: account.access_token,
        provider: account.provider,
      });

      if (!accessToken) throw Error("Internal server error. Please try again later.");

      token.accessToken = accessToken;

      return token;
    },
    session: ({ session, token }) => {
      if (!session?.user) return session;
      //@ts-ignore
      session.user.accessToken = token.accessToken as string;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    error: "/login/error",
    signIn: "/login",
  },
  debug: process.env.NEXTAUTH_DEBUG === "true",
});
