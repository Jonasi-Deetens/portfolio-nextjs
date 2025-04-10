import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

const t = initTRPC.create();

export const classRouter = t.router({
  getAll: t.procedure.query(async () => {
    return await prisma.characterClass.findMany();
  }),

  getClassById: t.procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await prisma.characterClass.findUnique({
        where: { id: input.id },
      });
    }),

  create: t.procedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        hpMultiplier: z.number().default(1.0),
        manaMultiplier: z.number().default(1.0),
        strengthMultiplier: z.number().default(1.0),
        agilityMultiplier: z.number().default(1.0),
        intelligenceMultiplier: z.number().default(1.0),
        abilities: z.array(z.string()),
        passiveBonuses: z.record(z.number()),
        startingEquipment: z.array(z.string()),
        levelUpBonuses: z.record(z.number()),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.characterClass.create({
        data: {
          ...input,
          abilities: input.abilities,
          passiveBonuses: input.passiveBonuses,
          startingEquipment: input.startingEquipment,
          levelUpBonuses: input.levelUpBonuses,
        },
      });
    }),

  update: t.procedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        hpMultiplier: z.number().optional(),
        manaMultiplier: z.number().optional(),
        strengthMultiplier: z.number().optional(),
        agilityMultiplier: z.number().optional(),
        intelligenceMultiplier: z.number().optional(),
        abilities: z.array(z.string()).optional(),
        passiveBonuses: z.record(z.number()).optional(),
        startingEquipment: z.array(z.string()).optional(),
        levelUpBonuses: z.record(z.number()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await prisma.characterClass.update({
        where: { id },
        data,
      });
    }),

  delete: t.procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.characterClass.delete({
        where: { id: input.id },
      });
    }),
});
