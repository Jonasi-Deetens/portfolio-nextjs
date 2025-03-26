"use client";

import { FC, useState } from "react";
import { trpc } from "../../../../utils/trpc";
import { useUser } from "../../../context/UserContext";

interface PlayerCharacterSelectorProps {
  onSelect: (characterId: number) => void;
}

export const PlayerCharacterSelector: FC<PlayerCharacterSelectorProps> = ({
  onSelect,
}) => {
  const { user } = useUser();
  const { data, isLoading, isError } =
    trpc.character.getPlayerCharacters.useQuery({
      id: user?.id || "",
    });

  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (isLoading) return <p className="text-white">Loading characters...</p>;
  if (isError || !data)
    return <p className="text-red-400">Failed to load characters.</p>;

  return (
    <div className="space-y-6 max-w-xl mx-auto mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((char) => (
          <button
            key={char.id}
            onClick={() => {
              setSelectedId(char.id);
              onSelect(char.id);
            }}
            className={`w-full p-4 rounded-xl border transition-all duration-200
                ${
                  selectedId === char.id
                    ? "border-white bg-white/10"
                    : "border-white/20 bg-white/5 hover:bg-white/10"
                }`}
          >
            <h3 className="text-xl font-semibold text-white">{char.name}</h3>
            <p className="text-sm text-white/70">HP: {char.stat?.hp ?? "-"}</p>
            <p className="text-sm text-white/70">
              STR: {char.stat?.strength ?? "-"}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
