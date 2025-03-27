import { prisma } from "../../lib/prisma";
import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const storyRouter = t.router({
  getStoryTemplates: t.procedure.query(async ({ input }) => {
    console.log(input);
    const stories = await prisma.storyTemplate.findMany();
    console.log(stories);
    return stories;
  }),
});
