'use client';

import { withAuth } from '../components/Auth/withAuth';
import { BackButton } from '../components/Elements/Buttons/BackButton';
import { PlayerCharacterSelector } from '../components/Forms/Character/CharacterSelect';

const CharacterCreationPage = () => {
  const handleStartGame = () => {};

  return (
    <main
      className="relative flex flex-col items-center justify-center w-full min-h-screen
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
      <h1 className="text-3xl font-bold mb-4 text-center">Choose your hero!</h1>
      <PlayerCharacterSelector onSelect={handleStartGame} />
      <BackButton />
    </main>
  );
};

export default withAuth(CharacterCreationPage);
