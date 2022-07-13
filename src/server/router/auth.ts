import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";

import { z } from "zod";
import { prisma } from "../../server/db/client";
import bcrypt from "bcrypt";
import argon2d from "argon2";

export const authRouter = createRouter()
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .mutation("signUp", {
    input: z.object({
      email: z.string(),
      password: z.string(),
      signupkey: z.string(),
    }),

    async resolve({ input }) {
      console.log(input);
      if (input.signupkey === process.env.SIGNUP_KEY) {
        const password = await argon2d.hash(input.password);
        const newUser = await prisma.user.create({
          data: {
            email: input.email,
            password,
          },
        });
        return {
          signUp: true,
          account: newUser,
        };
      } else {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
    },
  })
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .query("getSecretMessage", {
    async resolve({ ctx }) {
      return "You are logged in and can see this secret message!";
    },
  });
