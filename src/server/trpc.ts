import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { createContext } from './context';

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    console.error('❌ TRPC Error:', error);
    return {
      ...shape,
      message: error.message,
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new Error('Not authenticated');
  }
  return next({ ctx: { user: ctx.session.user } });
});
