'use client';

import { FC, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick: () => void;
}

export const Button: FC<ButtonProps> = ({ children, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        absolute top-6 left-6 flex items-center px-4 py-2
        bg-white/10 hover:bg-white/30 active:bg-white/40
        text-white text-sm font-medium
        border border-white/20 rounded-xl
        backdrop-blur
        shadow-inner hover:shadow-xl active:shadow-md
        transition-all duration-200 ease-in-out
        active:scale-[0.98] ${className}
      `}
    >
      {children}
    </button>
  );
};
