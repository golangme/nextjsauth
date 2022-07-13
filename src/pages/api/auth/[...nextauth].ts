import NextAuth, { type NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { compare } from "bcrypt";
import argon2d from "argon2";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  // adapter: PrismaAdapter(prisma),
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // ...add more providers here

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
          try {
            const isValid = await argon2d.verify(
              user.password,
              credentials?.password as string
            );
            console.log("isvalid: ", isValid);
            if (isValid) {
              return user;
            }
          } catch (error) {
            throw new Error("Invalid credentials1");
          }
        } else {
          throw new Error("Invalid credentials2");
        }
      },
    }),
  ],
  // secret: process.env.NEXTAUTH_SECRET,
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
