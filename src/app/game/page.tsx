'use client';

import { withAuth } from '../components/Auth/withAuth';
import { Button } from '../components/Elements/Buttons/Button';
import CharacterHUD from '../components/Hud/CharacterHud';
import { useCharacter } from '../providers/CharacterProvider';
import { useMap } from '../providers/MapProvider';
import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';

import Tile from '../components/Game/Tile';

const GamePage = () => {
  const router = useRouter();
  const { visibleTiles, VIEWPORT_SIZE } = useMap();
  const { selectedCharacter, moveCharacter } = useCharacter();
  const moveInProgress = useRef(false);

  const handleMove = useCallback(
    async (direction: 'up' | 'down' | 'left' | 'right') => {
      if (moveInProgress.current) return;
      moveInProgress.current = true;

      try {
        moveInProgress.current = false;
        await moveCharacter(direction);
        moveInProgress.current = false;
      } finally {
        // setTimeout(() => {
        moveInProgress.current = false;
        // }, 50);
      }
    },
    [moveCharacter]
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
          event.preventDefault();
          handleMove('up');
          break;
        case 'ArrowDown':
        case 's':
          event.preventDefault();
          handleMove('down');
          break;
        case 'ArrowLeft':
        case 'a':
          event.preventDefault();
          handleMove('left');
          break;
        case 'ArrowRight':
        case 'd':
          event.preventDefault();
          handleMove('right');
          break;
      }
    },
    [handleMove]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const renderGrid = useMemo(() => {
    return visibleTiles.flat().map((tile, index) => {
      const isPlayer =
        tile?.x === selectedCharacter?.tile?.x && tile?.y === selectedCharacter?.tile?.y;

      const tileClassName = `w-16 h-16 flex items-center justify-center`;

      return (
        <Tile
          key={`${tile?.x}-${tile?.y}-${index}`}
          tile={tile}
          isPlayer={isPlayer}
          className={tileClassName}
        />
      );
    });
  }, [visibleTiles, selectedCharacter?.tile?.x, selectedCharacter?.tile?.y]);

  if (!selectedCharacter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl mb-4">No character selected</div>
        <Button onClick={() => router.push('/character-select')}>Go to Character Select</Button>
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
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
          <div
            className="grid gap-0 transition-all duration-200 ease-in-out"
            style={{ gridTemplateColumns: `repeat(${VIEWPORT_SIZE}, 64px)` }}
          >
            {renderGrid}
          </div>
        </div>
      </div>
    </main>
  );
};

export default withAuth(GamePage);
