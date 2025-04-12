'use client';

import { FC, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button' | undefined;
  onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  type = 'submit',
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`
        flex gap-1 items-center justify-center
        px-5 py-4 rounded-xl
        transition-all duration-200 ease-in-out
        active:scale-[0.98]
        backdrop-blur

        /* Light mode */
        bg-white/70 hover:bg-white/80 active:bg-white/90
        text-gray-900
        border border-gray-300
        shadow-inner hover:shadow-lg active:shadow-md

        /* Dark mode */
        dark:bg-white/10 dark:hover:bg-white/20 dark:active:bg-white/30
        dark:text-white
        dark:border-white/20
        dark:shadow-inner dark:hover:shadow-xl dark:active:shadow-md

        ${className}
      `}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
