// server/routers/authRouter.ts
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const authRouter = t.router({
  getMe: t.procedure
  .query(({ ctx }) => {
    const user = ctx.session?.user;
    if (!user) throw new Error('Unauthorized');
    return user;
  }),
  createUser: t.procedure
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
});
