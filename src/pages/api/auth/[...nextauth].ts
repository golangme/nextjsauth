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
        // console.log("");
        // const { email, password } = JSON.stringify(credentials);
        const email = credentials?.email;
        const password = credentials?.password || "test";
        try {
          const user = await prisma.user.findFirst({
            where: {
              email,
            },
          });

          console.log("auth found", user);
          console.log("password: " + password);
          console.log("user.password: " + user?.password);
          // const user = await prisma.user.findOne({))
          if (user) {
            const isValid = await argon2d.verify(user.password, password);
            console.log("isvalid: ", isValid);
            if (isValid) {
              return {
                user,
              };
            } else {
              throw new Error("Invalid credentials1");
            }
          } else {
            throw new Error("Invalid credentials2");
          }
        } catch (error) {
          throw new Error("Invalid credentials3");
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
