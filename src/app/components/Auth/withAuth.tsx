'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const Wrapped: React.FC<P> = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'unauthenticated') {
        router.push('/login');
      }
    }, [status, router]);

    if (status === 'loading') return null;
    if (!session?.user) return null;

    return <Component {...props} />;
  };

  return Wrapped;
};
