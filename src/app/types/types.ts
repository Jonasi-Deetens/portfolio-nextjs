import { Character, Stat } from '@prisma/client';

export type TrpcError = {
  message: string;
};

//CHARACTER

export type SCharacter = {
  [K in keyof Character]: Character[K] extends Date ? string : Character[K];
};

export type SCharacterWithStat = {
  [K in keyof Character]: Character[K] extends Date ? string : Character[K];
} & { stat: Stat | null };
