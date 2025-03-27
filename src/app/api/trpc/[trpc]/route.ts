export const runtime = "nodejs";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api";
import { createContext } from '@/server/context';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext({ req }),
  });

export { handler as GET, handler as POST };
