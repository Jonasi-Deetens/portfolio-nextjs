import {
  Character,
  CharacterClass,
  Stat,
  Tile,
  Map,
  StoryPlaythrough,
  NPC,
  Player,
  StatusEffect,
  Prisma,
  GameObject,
  Object,
} from '@prisma/client';

type Json = Prisma.JsonValue;

export type TrpcError = {
  message: string;
};

type SerializeDateValue<T> = T extends Date ? string : T;

type SerializeDates<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends (infer U)[]
      ? SerializeDateValue<U>[]
      : T[K] extends { createdAt: Date }
        ? { [P in keyof T[K]]: SerializeDateValue<T[K][P]> }
        : T[K];
};

type SerializeDateFields<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K] extends Date | null ? string | null : T[K];
};

export type SMap = SerializeDateFields<Map> & {
  tiles: SerializeDateFields<Tile>[];
};

export type SPlaythrough = SerializeDateFields<StoryPlaythrough> & {
  maps: SMap[];
};

export type SGameObject = SerializeDateFields<GameObject>;

export type SObject = SerializeDateFields<Object>;

export type STile = SerializeDateFields<Tile> & {
  objects: (SGameObject & {
    object: SObject;
  })[];
};

export type SCharacterClass = SerializeDateFields<CharacterClass>;

//CHARACTER

export type SCharacter = SerializeDates<Character>;

export type SCharacterWithStat = SerializeDateFields<{
  name: string;
  id: number;
  isPlayer: boolean;
  classId: number;
  level: number;
  skillPoints: number;
  behavior: Json | null;
  equipment: Json | null;
  inventory: Json | null;
  gold: number;
  statusEffects: StatusEffect[];
  criticalChance: number;
  dodgeChance: number;
  armor: number;
  magicResist: number;
  stat: Stat | null;
  class: SCharacterClass;
  playthrough: SPlaythrough | null;
  tile: STile | null;
  npcData: NPC | null;
  playerData: Player | null;
  createdAt: Date;
  lastCombatTime: Date | null;
  lastLevelUpTime: Date | null;
}>;

export type CharacterWithStat = {
  name: string;
  id: number;
  isPlayer: boolean;
  classId: number;
  level: number;
  skillPoints: number;
  behavior: Json | null;
  equipment: Json | null;
  inventory: Json | null;
  gold: number;
  statusEffects: StatusEffect[];
  criticalChance: number;
  dodgeChance: number;
  armor: number;
  magicResist: number;
  stat: Stat | null;
  class: SCharacterClass;
  playthrough: SerializeDates<
    StoryPlaythrough & {
      maps: SerializeDates<
        Map & {
          tiles: STile[];
        }
      >[];
    }
  > | null;
  tile: STile | null;
  npcData: NPC | null;
  playerData: Player | null;
  createdAt: Date;
  lastCombatTime: Date | null;
  lastLevelUpTime: Date | null;
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
  | 'hp'
  | 'maxHp'
  | 'mana'
  | 'maxMana'
  | 'rage'
  | 'maxRage'
  | 'energy'
  | 'maxEnergy'
  | 'stamina'
  | 'maxStamina'
  | 'focus'
  | 'maxFocus'
  | 'xp'
  | 'spirit'
  | 'maxSpirit';
