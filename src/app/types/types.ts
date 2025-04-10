import {
  Character,
  CharacterClass,
  Stat,
  Tile,
  Map,
  StoryPlaythrough,
  NPC,
  Player,
} from "@prisma/client";

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
  class: CharacterClass;
  playthrough:
    | (StoryPlaythrough & { maps: (Map & { tiles: Tile[] })[] })
    | null;
  map: Map | null;
  tile: Tile | null;
  npcData: NPC | null;
  playerData: Player | null;
};

export type CharacterCreateValues = {
  name: string;
  class: CharacterClass;
  storyTemplateId: number;
  strength: number;
  agility: number;
  intelligence: number;
  charisma: number;
  luck: number;
};

//RESOURCE
export type ResourceType =
  | "hp"
  | "maxHp"
  | "mana"
  | "maxMana"
  | "rage"
  | "maxRage"
  | "energy"
  | "maxEnergy"
  | "stamina"
  | "maxStamina"
  | "focus"
  | "maxFocus"
  | "xp"
  | "spirit"
  | "maxSpirit";
