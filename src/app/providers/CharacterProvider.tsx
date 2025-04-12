// context/CharacterContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SCharacterWithStat, STile } from '../types/types';
import { useSession } from 'next-auth/react';
import { trpc } from '../../utils/trpc';

type Direction = 'up' | 'down' | 'left' | 'right';

type CharacterContextType = {
  characters: SCharacterWithStat[];
  selectedCharacter: SCharacterWithStat | null;
  isLoading: boolean;
  isError: boolean;
  setSelectedCharacter: (character: SCharacterWithStat) => void;
  refreshCharacters: () => Promise<void>;
  moveCharacter: (direction: Direction) => Promise<void>;
  isValidMove: (x: number, y: number) => boolean;
};

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [characters, setCharacters] = useState<SCharacterWithStat[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<SCharacterWithStat | null>(null);
  const utils = trpc.useUtils();

  const fetchCharacters = useCallback(async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    setIsError(false);

    try {
      const data = await utils.character.getPlayerCharacters.fetch({
        id: session.user.id,
      });
      setCharacters(data as SCharacterWithStat[]);

      if (selectedCharacter) {
        const updatedSelectedChar = (data as SCharacterWithStat[]).find(
          (char) => char.id === selectedCharacter.id
        );
        if (updatedSelectedChar) {
          setSelectedCharacter(updatedSelectedChar);
        }
      } else if (data.length > 0) {
        const firstPlayerChar = (data as SCharacterWithStat[]).find((char) => char.isPlayer);
        if (firstPlayerChar) {
          setSelectedCharacter(firstPlayerChar);
        }
      }
    } catch (err) {
      console.error('Failed to fetch characters:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, utils]);

  const refreshCharacters = useCallback(async () => {
    await fetchCharacters();
  }, [fetchCharacters]);

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated') {
        await fetchCharacters();
      }
    };
    fetchData();
  }, [fetchCharacters, status]);

  const updatePosition = trpc.character.updatePosition.useMutation();

  const isValidMove = (x: number, y: number): boolean => {
    if (!selectedCharacter?.playthrough?.maps?.[0]) return false;
    const currentMap = selectedCharacter.playthrough.maps[0];

    if (x < 0 || x >= currentMap.width || y < 0 || y >= currentMap.height) {
      return false;
    }
    const targetTile = currentMap.tiles.find((t) => t.x === x && t.y === y && t.layer === 0);
    const unwalkableTiles = ['WALL', 'WATER', 'MOUNTAIN'];
    return targetTile ? !unwalkableTiles.includes(targetTile.type) : false;
  };

  const moveCharacter = async (direction: Direction) => {
    if (!selectedCharacter?.tile || !selectedCharacter.playthrough?.maps?.[0]) return;

    const currentX = selectedCharacter.tile.x;
    const currentY = selectedCharacter.tile.y;
    const currentMap = selectedCharacter.playthrough.maps[0];

    let newX = currentX;
    let newY = currentY;

    switch (direction) {
      case 'up':
        newY -= 1;
        break;
      case 'down':
        newY += 1;
        break;
      case 'left':
        newX -= 1;
        break;
      case 'right':
        newX += 1;
        break;
    }

    if (isValidMove(newX, newY)) {
      const targetTile = currentMap.tiles.find(
        (t) => t.x === newX && t.y === newY && t.layer === 0
      );
      if (targetTile) {
        // Instantly update the character's position in local state
        setSelectedCharacter((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            tile: targetTile as STile,
          };
        });

        // Update the position in the database in the background
        updatePosition.mutate({
          characterId: selectedCharacter.id,
          tileId: targetTile.id,
        });
      }
    }
  };

  return (
    <CharacterContext.Provider
      value={{
        characters,
        selectedCharacter,
        setSelectedCharacter,
        refreshCharacters,
        isLoading,
        isError,
        moveCharacter,
        isValidMove,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};
