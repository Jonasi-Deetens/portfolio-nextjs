import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-xl text-sm font-medium
        bg-white/70 hover:bg-white/80 text-gray-900
        dark:bg-white/10 dark:hover:bg-white/20 dark:text-white
        border border-gray-300 dark:border-white/20
        shadow-inner hover:shadow-md transition-all duration-150"
    >
      {children}
    </Link>
  );
};

export default NavLink;
