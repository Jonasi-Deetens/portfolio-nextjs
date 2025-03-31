import { Character, Stat } from "@prisma/client";

export type TrpcError = {
  message: string;
};

type SerializeDates<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

//CHARACTER

export type SCharacter = SerializeDates<Character>;

export type SCharacterWithStat = SerializeDates<
  Omit<Character, "statId" | "createdAt">
> & {
  stat: Stat | null;
};

export type CharacterCreateValues = {
  name: string;
  class: "Warrior" | "Rogue" | "Mage";
  storyTemplateId: number;
  strength: number;
  agility: number;
  intelligence: number;
  charisma: number;
  luck: number;
};
