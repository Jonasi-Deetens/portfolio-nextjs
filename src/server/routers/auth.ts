// server/routers/authRouter.ts
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const authRouter = t.router({
  register: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(2).max(32),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (existing) throw new Error("User already exists");

      const passwordHash = await bcrypt.hash(input.password, 10);

      const user = await prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          passwordHash,
        },
      });

      return { id: user.id, email: user.email };
    }),

  login: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user) throw new Error("Invalid email or password");

      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) throw new Error("Invalid email or password");

      return { id: user.id, email: user.email, name: user.name };
    }),
});
