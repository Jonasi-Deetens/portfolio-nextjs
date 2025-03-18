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
        "relative text-white dark:text-gray-200 font-semibold px-3 py-1 transition-all",
        "hover:text-[#FFD700] dark:hover:text-[#FFA500]",
        "focus:text-[#FF6B6B] dark:focus:text-[#FF4081]",
        "group"
      )}
    >
      {children}
      <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-[#FF6B6B] via-[#845EC2] to-[#D65DB1] dark:from-[#FF4081] dark:via-[#845EC2] dark:to-[#2C003E] scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
    </Link>
  );
};

export default NavLink;
