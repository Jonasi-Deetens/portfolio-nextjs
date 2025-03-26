"use client";

import { withAuth } from "../components/Auth/withAuth";
import { PlayerCharacterSelector } from "../components/Forms/Character/CharacterSelect";

const CharacterCreationPage = () => {
  const handleStartGame = () => {};

  return (
    <main className="flex flex-col justify-center items-center p-8 h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Choose your hero!</h1>
      <PlayerCharacterSelector onSelect={handleStartGame} />
    </main>
  );
};

export default withAuth(CharacterCreationPage);
