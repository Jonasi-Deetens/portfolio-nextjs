"use client";

import { withAuth } from "../components/Auth/withAuth";
import { CharacterCreationForm } from "../components/Forms/Character/CharacterCreationForm";

const CharacterCreationPage = () => {
  return (
    <main className="flex flex-col justify-center items-center p-8 h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Let's build your hero!
      </h1>
      <CharacterCreationForm />
    </main>
  );
};

export default withAuth(CharacterCreationPage);
