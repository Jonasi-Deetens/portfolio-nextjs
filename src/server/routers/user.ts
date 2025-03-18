import { prisma } from "../../lib/prisma";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

export const userRouter = t.router({
  getUser: t.procedure.input(z.string()).query(async ({ input }) => {
    console.log(input);
    const user = await prisma.user.findFirst({
      where: { name: input },
    });
    console.log(user);
    return user;
  }),
});
