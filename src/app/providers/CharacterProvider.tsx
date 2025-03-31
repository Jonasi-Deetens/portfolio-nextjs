// context/CharacterContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { SCharacterWithStat } from "../types/types";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

type CharacterContextType = {
  characters: SCharacterWithStat[];
  selectedCharacter: SCharacterWithStat | null;
  isLoading: boolean;
  isError: boolean;
  setSelectedCharacter: (character: SCharacterWithStat) => void;
  refreshCharacters: () => Promise<void>;
};

const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined
);

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [characters, setCharacters] = useState<SCharacterWithStat[]>([]);
  const [selectedCharacter, setSelectedCharacter] =
    useState<SCharacterWithStat | null>(null);
  const utils = trpc.useUtils();

  const fetchCharacters = useCallback(async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    setIsError(false);

    try {
      const data = await utils.character.getPlayerCharacters.fetch({
        id: session.user.id,
      });
      setCharacters(data);
    } catch (err) {
      console.error("Failed to fetch characters:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, utils]);

  const refreshCharacters = useCallback(async () => {
    await fetchCharacters();
  }, [fetchCharacters]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCharacters();
    }
  }, [fetchCharacters, status]);

  return (
    <CharacterContext.Provider
      value={{
        characters,
        selectedCharacter,
        setSelectedCharacter,
        refreshCharacters,
        isLoading,
        isError,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error("useCharacter must be used within a CharacterProvider");
  }
  return context;
};
