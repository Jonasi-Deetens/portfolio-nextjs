'use client';

import { Tile } from '@prisma/client';
import { withAuth } from '../components/Auth/withAuth';
import CharacterHUD from '../components/Hud/CharacterHud';
import { useCharacter } from '../providers/CharacterProvider';
import { useState, useEffect } from 'react';

type GameState = 'loading' | 'playing' | 'paused' | 'gameover';

const VIEWPORT_SIZE = 5; // View radius around player

const GamePage = () => {
  const { selectedCharacter, isLoading, isError } = useCharacter();
  const [visibleTiles, setVisibleTiles] = useState<Tile[][]>([]);

  useEffect(() => {
    if (selectedCharacter?.playthrough?.maps && selectedCharacter.tile) {
      const map = selectedCharacter.playthrough.maps[0];
      const playerX = selectedCharacter.tile.x;
      const playerY = selectedCharacter.tile.y;

      const generateVisibleTiles = () => {
        const tiles: Tile[][] = [];
        const startX = Math.max(0, playerX - Math.floor(VIEWPORT_SIZE / 2));
        const startY = Math.max(0, playerY - Math.floor(VIEWPORT_SIZE / 2));
        const endX = Math.min(map.width - 1, playerX + Math.floor(VIEWPORT_SIZE / 2));
        const endY = Math.min(map.height - 1, playerY + Math.floor(VIEWPORT_SIZE / 2));

        for (let y = startY; y <= endY; y++) {
          const row: Tile[] = [];
          for (let x = startX; x <= endX; x++) {
            const currentTile = map.tiles.find((t) => t.x === x && t.y === y);
            if (currentTile) {
              row.push(currentTile);
            }
          }
          tiles.push(row);
        }

        setVisibleTiles(tiles);
        console.log(tiles);
      };

      generateVisibleTiles();
    }
  }, [selectedCharacter]);

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (isError || !selectedCharacter)
    return <div className="text-red-500">Error loading character data</div>;

  return (
    <main
      className="relative w-full min-h-screen
    bg-gradient-to-br from-[#131316] via-[#1a1a1f] to-[#0f0f12]
    dark:from-[#000000] dark:via-[#0e0e0e] dark:to-[#050505]
    text-white overflow-hidden transition-colors duration-500"
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
            {visibleTiles.flat().map((tile, index) => (
              <div
                key={index}
                className={`w-full aspect-square rounded ${
                  tile.x === selectedCharacter.tile?.x && tile.y === selectedCharacter.tile?.y
                    ? 'bg-blue-500'
                    : 'bg-gray-700'
                } flex items-center justify-center`}
              >
                {tile.x === selectedCharacter.tile?.x && tile.y === selectedCharacter.tile?.y
                  ? 'P'
                  : '·'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default withAuth(GamePage);
