import { memo } from "react";

interface MenuButtonProps {
  label: string;
  onClick: () => void;
}

const $MenuButton: React.FC<MenuButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full px-6 py-3 bg-white/70 hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20 
            border border-gray-300 dark:border-white/20 
            rounded-xl transition-all duration-150 
            text-lg font-medium text-gray-900 dark:text-white shadow-inner hover:shadow-lg"
    >
      {label}
    </button>
  );
};

export const MenuButton = memo($MenuButton) as typeof $MenuButton;
