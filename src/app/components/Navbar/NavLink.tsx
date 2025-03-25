import Link from "next/link";
import { cn } from "../../../lib/utils";

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "relative font-semibold px-3 py-1 transition-all duration-200",
        // Always readable on dark background
        "text-white",
        // Hover + focus tints for mood
        "hover:text-yellow-300 focus:text-pink-400",
        "group"
      )}
    >
      {children}
      <span
        className="absolute left-0 bottom-0 w-full h-0.5 
        group-hover:scale-x-100 
        transition-transform duration-300 ease-in-out"
      />
    </Link>
  );
};

export default NavLink;
