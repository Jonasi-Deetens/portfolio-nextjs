"use client";

import NavigationHeader from "./components/Navbar/NavigationHeader";
import { MenuButton } from "./components/Elements/MenuButton";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen
      bg-gradient-to-br from-[#131316] via-[#1a1a1f] to-[#0f0f12]
      dark:from-[#000000] dark:via-[#0e0e0e] dark:to-[#050505]
      text-white overflow-hidden transition-colors duration-500">

      {/* Misty background texture */}
      <div className="absolute inset-0 bg-mist bg-cover bg-center opacity-20 mix-blend-screen animate-mist pointer-events-none z-0" />
      <div className="absolute inset-0 backdrop-blur-sm pointer-events-none z-0" />

      {/* Navigation Header */}
      <NavigationHeader />

      {/* Game Menu Panel */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full bg-black/60 dark:bg-black/80 backdrop-blur-lg rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] p-8 border border-white/10 mt-32">
          <h1 className="text-4xl font-bold tracking-wide mb-8 text-center drop-shadow-lg text-white">
            ⚔️ Shadowpath
          </h1>
          <div className="space-y-4">
            <MenuButton label="Start New Game" onClick={() => alert("Start")} />
            <MenuButton label="Continue" onClick={() => alert("Continue")} />
            <MenuButton label="Settings" onClick={() => alert("Settings")} />
            <MenuButton label="Credits" onClick={() => alert("Credits")} />
          </div>
        </div>
      </main>
    </div>
  );
}
