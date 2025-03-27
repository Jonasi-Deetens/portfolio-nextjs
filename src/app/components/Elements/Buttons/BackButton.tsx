'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { Button } from './Button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  className?: string;
}

export const BackButton: FC<BackButtonProps> = ({ label = '', className, ...props }) => {
  const router = useRouter();

  const buttonClassName =
    (className ?? '') +
    ' !rounded-full border-none w-10 h-10 justify-center flex items-center !p-0';

  return (
    <Button onClick={() => router.back()} className={buttonClassName} {...props}>
      <ArrowLeft className={`w-5 h-5 ${label ? 'mr-2' : ''}`} />
      {label && <span>{label}</span>}
    </Button>
  );
};
