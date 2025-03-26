"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "../../context/UserContext";

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const Wrapped: React.FC<P> = (props) => {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push("/login");
      }
    }, [user, router]);

    if (!user) return null;

    return <Component {...props} />;
  };

  return Wrapped;
};
