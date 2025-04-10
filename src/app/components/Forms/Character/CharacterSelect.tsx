'use client';

import { FC, useEffect } from 'react';
import { SCharacterWithStat } from '@/app/types/types';
import { Button } from '../../Elements/Buttons/Button';
import { useCharacter } from '../../../providers/CharacterProvider';
import { useRouter } from 'next/navigation';

export const PlayerCharacterSelector: FC = () => {
  const router = useRouter();
  const {
    characters,
    selectedCharacter,
    refreshCharacters,
    setSelectedCharacter,
    isLoading,
    isError,
  } = useCharacter();

  useEffect(() => {
    refreshCharacters();
  }, [refreshCharacters]);

  useEffect(() => {
    const storedId = localStorage.getItem('selectedCharacterId');
    if (storedId && characters) {
      const found = characters.find((c) => c.id === Number(storedId));
      if (found) {
        setSelectedCharacter(found);
      }
    }
  }, [characters, setSelectedCharacter, refreshCharacters]);

  const handleSelect = (char: SCharacterWithStat) => {
    setSelectedCharacter(char);
    localStorage.setItem('selectedCharacterId', String(char.id));
    router.push('/game');
  };

  if (isLoading) return <p className="text-white">Loading characters...</p>;
  if (isError || !characters) return <p className="text-red-400">Failed to load characters.</p>;

  return (
    <div className="mx-auto mt-12">
      <div className="flex flex-wrap justify-center items-center max-w-xl">
        {characters.map((char) => (
          <Button
            key={char.id}
            onClick={() => handleSelect(char)}
            className={`${
              selectedCharacter?.id === char.id && '!bg-gray-700'
            } flex flex-col w-30 h-30 m-3`}
          >
            <h3 className="text-xl font-semibold text-white">{char.name}</h3>
            <p className="text-sm text-white/70">Level: {char.stat?.level ?? '-'}</p>
          </Button>
        ))}
      </div>
    </div>
  );
};
