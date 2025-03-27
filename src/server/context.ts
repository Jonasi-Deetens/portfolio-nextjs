// server/context.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { type NextRequest } from 'next/server';

export const createContext = async (opts: { req: Request }) => {
  const session = await getServerSession(authOptions);
  return { session };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
