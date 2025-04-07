import { initTRPC } from "@trpc/server";
import { userRouter } from "./routers/user";
import { characterRouter } from "./routers/character";
import { storyRouter } from "./routers/story";
import { authRouter } from "./routers/auth";
import { classRouter } from "./routers/class";
const t = initTRPC.create();

export const appRouter = t.router({
  auth: authRouter,
  user: userRouter,
  character: characterRouter,
  story: storyRouter,
  class: classRouter,
});

export type AppRouter = typeof appRouter;
