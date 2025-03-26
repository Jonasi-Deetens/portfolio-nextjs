import { initTRPC } from "@trpc/server";
import { userRouter } from "./routers/user";
import { characterRouter } from "./routers/character";
import { storyRouter } from "./routers/story";

const t = initTRPC.create();

export const appRouter = t.router({
  user: userRouter,
  character: characterRouter,
  story: storyRouter,
});

export type AppRouter = typeof appRouter;
