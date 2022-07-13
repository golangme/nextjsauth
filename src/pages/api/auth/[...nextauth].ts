import NextAuth, { type NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "../../../server/db/client";

import argon2d from "argon2";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        const email = credentials?.email;

        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        });

        if (user) {
          const isValid = await argon2d.verify(
            user.password,
            credentials?.password as string
          );
          console.log("isvalid: ", isValid);

          if (!isValid) {
            return null;
          }
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user, token }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
};

export default NextAuth(authOptions);
