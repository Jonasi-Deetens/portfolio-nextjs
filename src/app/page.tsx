"use client";
import NavigationHeader from "./components/Navbar/NavigationHeader";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-[#FAF3FF] dark:bg-[#090112] transition-colors duration-300">
      <NavigationHeader />

      <div className="h-screen w-full max-w-[1200px] m-auto flex flex-col justify-center items-center">
        {/* Row of 3 divs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0 mt-12 w-full">
          {/* Card 1 */}
          <div
            className="group relative bg-gradient-to-br from-[#FF7EB3] via-[#845EC2] to-[#2C003E] 
      dark:from-[#6A0572] dark:via-[#2D033B] dark:to-[#0D001A] 
      p-6 rounded-2xl shadow-lg border transition-all
      hover:scale-[1.03] hover:shadow-[#ff7eb3]/40"
          >
            <h3 className="text-xl font-bold text-white">Card 1</h3>
            <p className="text-gray-300 mt-2 text-sm">
              A beautifully styled card with a futuristic gradient and smooth
              effect.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="group relative bg-gradient-to-br from-[#6B72FF] via-[#845EC2] to-[#2C003E] 
      dark:from-[#542C85] dark:via-[#350068] dark:to-[#10002D] 
      p-6 rounded-2xl shadow-lg border transition-all
      hover:scale-[1.03] hover:shadow-[#6B72FF]/40"
          >
            <h3 className="text-xl font-bold text-white">Card 2</h3>
            <p className="text-gray-300 mt-2 text-sm">
              Smooth animations and polished colors make this design feel
              modern.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="group relative bg-gradient-to-br from-[#FFD700] via-[#845EC2] to-[#2C003E] 
      dark:from-[#FF6B00] dark:via-[#8F2D56] dark:to-[#240046] 
      p-6 rounded-2xl shadow-lg border transition-all
      hover:scale-[1.03] hover:shadow-[#FFD700]/40"
          >
            <h3 className="text-xl font-bold text-white">Card 3</h3>
            <p className="text-gray-300 mt-2 text-sm">
              This design follows modern UI/UX trends with depth, glow, and
              responsiveness.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
