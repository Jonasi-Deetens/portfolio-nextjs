import { prisma } from "../../lib/prisma";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

export const userRouter = t.router({
  getUser: t.procedure.input(z.string()).mutation(async ({ input }) => {
    const user =
      (await prisma.user.findUnique({ where: { email: input } })) ||
      (await prisma.user.create({ data: { email: input } }));
    return user;
  }),
});
