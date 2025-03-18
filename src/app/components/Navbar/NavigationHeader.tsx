"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavLink from "./NavLink";
import { useTheme } from "next-themes";

const NavigationHeader = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl bg-gradient-to-r from-[#FF6B6B] via-[#845EC2] to-[#D65DB1] dark:from-[#4A0072] dark:via-[#35013F] dark:to-[#2C003E] rounded-4xl drop-shadow-lg p-4 flex items-center justify-between backdrop-blur-lg border border-white/10 transition-all">
      <Link
        href="/"
        className="text-xl font-bold text-white drop-shadow-lg tracking-wide"
      >
        Brand<span className="text-yellow-300">Logo</span>
      </Link>

      <nav className="hidden md:flex space-x-6">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/services">Services</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </nav>

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
    </header>
  );
};

export default NavigationHeader;
