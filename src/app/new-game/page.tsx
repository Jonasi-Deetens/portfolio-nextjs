"use client";

import { CharacterCreationForm } from "../components/Forms/Character/CharacterCreationForm";

const CharacterCreationPage = () => {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Character Creation</h1>
      <p>Let's build your hero!</p>
      <CharacterCreationForm />
    </main>
  );
};

export default CharacterCreationPage;
