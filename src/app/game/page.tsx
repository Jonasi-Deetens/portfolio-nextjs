"use client";

import { withAuth } from "../components/Auth/withAuth";
import { Button } from "../components/Elements/Buttons/Button";
import CharacterHUD from "../components/Hud/CharacterHud";
import { useCharacter } from "../providers/CharacterProvider";
import { useMap } from "../providers/MapProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
type GameState = "loading" | "playing" | "paused" | "gameover";

const GamePage = () => {
  const router = useRouter();
  const { visibleTiles, VIEWPORT_SIZE } = useMap();
  const { selectedCharacter, moveCharacter } = useCharacter();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
        case "w":
          event.preventDefault();
          moveCharacter("up");
          break;
        case "ArrowDown":
        case "s":
          event.preventDefault();
          moveCharacter("down");
          break;
        case "ArrowLeft":
        case "a":
          event.preventDefault();
          moveCharacter("left");
          break;
        case "ArrowRight":
        case "d":
          event.preventDefault();
          moveCharacter("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [moveCharacter]);

  if (!selectedCharacter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl mb-4">No character selected</div>
        <Button onClick={() => router.push("/character-select")}>
          Go to Character Select
        </Button>
      </div>
    );
  }
  return (
    <main
      className="relative w-full min-h-screen
    bg-gradient-to-br from-[#131316] via-[#1a1a1f] to-[#0f0f12]
    dark:from-[#000000] dark:via-[#0e0e0e] dark:to-[#050505]
    text-white overflow-hidden transition-colors duration-500 overflow-y-auto"
    >
      <div
        className="absolute left-1/2 top-1/2 w-[60vw] h-[60vw] 
-translate-x-1/2 -translate-y-1/2
rounded-full bg-white/10 blur-3xl mix-blend-screen 
pointer-events-none z-0 floating-mist"
      />
      <CharacterHUD />

      <div className="flex justify-center items-center min-h-screen">
        <div className="w-[600px] h-[600px] m-auto bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
          <div
            className="grid gap-1 p-4"
            style={{ gridTemplateColumns: `repeat(${VIEWPORT_SIZE}, 1fr)` }}
          >
            {visibleTiles.flat().map((tile, index) =>
              tile ? (
                <div
                  key={index}
                  className={`w-full aspect-square rounded ${
                    tile.x === selectedCharacter.tile?.x &&
                    tile.y === selectedCharacter.tile?.y
                      ? "bg-blue-500"
                      : "bg-gray-700"
                  } flex items-center justify-center`}
                >
                  {tile.x === selectedCharacter.tile?.x &&
                  tile.y === selectedCharacter.tile?.y
                    ? "P"
                    : "·"}
                </div>
              ) : (
                <div
                  key={index}
                  className="w-full aspect-square rounded bg-gray-900 flex items-center justify-center"
                />
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default withAuth(GamePage);
