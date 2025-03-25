"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavLink from "./NavLink";
import { useTheme } from "next-themes";

const NavigationHeader = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl 
      p-4 flex items-center justify-between rounded-3xl 
      backdrop-blur-xl shadow-xl z-50
      bg-black/60 dark:bg-black/80
      border border-white/10 
      text-white transition-all duration-300">
      
      <Link
        href="/"
        className="text-xl font-bold tracking-wide drop-shadow-lg"
      >
        <span className="text-white">Shadow</span>
        <span className="text-yellow-400 dark:text-yellow-300">Path</span>
      </Link>

      <nav className="hidden md:flex space-x-6">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/settings">Settings</NavLink>
        <NavLink href="/credits">Credits</NavLink>
      </nav>

      <div className="flex items-center gap-2">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover:bg-white/10 transition-all rounded-full backdrop-blur-xl border border-white/20 shadow-lg"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5 text-white" />
            )}
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-white/10 transition-all rounded-full backdrop-blur-xl border border-white/20 shadow-lg"
        >
          <Menu className="w-6 h-6 text-white" />
        </Button>
      </div>
    </header>
  );
};

export default NavigationHeader;
