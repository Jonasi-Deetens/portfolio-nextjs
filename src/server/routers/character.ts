// server/routers/characterRouter.ts
import { prisma } from "@/lib/prisma";
import { Prisma, Stat } from "@prisma/client";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

export const characterRouter = t.router({
  createCharacter: t.procedure
    .input(
      z.object({
        userId: z.string().uuid(),
        storyTemplateId: z.number(),
        name: z.string().min(2).max(50),
        strength: z.number().min(1).max(20),
        agility: z.number().min(1).max(20),
        intellect: z.number().min(1).max(20),
        charisma: z.number().min(1).max(20),
        luck: z.number().min(1).max(20),
      })
    )
    .mutation(async ({ input }) => {
      const {
        userId,
        storyTemplateId,
        name,
        strength,
        agility,
        intellect,
        charisma,
        luck,
      } = input;

      // Step 1: Create Stat
      const stat = await prisma.stat.create({
        data: {
          hp: 10 + strength,
          maxHp: 10 + strength,
          strength,
          agility,
          intelligence: intellect,
          charisma,
          luck,
        },
      });

      // Step 2: Create StoryPlaythrough
      const playthrough = await prisma.storyPlaythrough.create({
        data: {
          name: `${name}'s Adventure`,
          storyTemplateId: storyTemplateId,
          userId,
        },
      });

      // Step 3: Create Character
      const character = await prisma.character.create({
        data: {
          name,
          isPlayer: true,
          stat: { connect: { id: stat.id } },
          playthrough: { connect: { id: playthrough.id } },
        },
      });

      await prisma.player.create({
        data: {
          character: { connect: { id: character.id } },
          user: { connect: { id: "5ae8a3cd-1e79-4f6d-b685-45fe96a9e6e8" } },
        },
      });

      // Optional: clone maps, tiles, template NPCs here (can move to a separate service)
      const templateMaps = await prisma.templateMap.findMany({
        where: { templateId: storyTemplateId },
        include: {
          templateTiles: { include: { templateObjects: true } },
          templateCharacters: true,
        },
      });

      for (const templateMap of templateMaps) {
        // Clone map
        const map = await prisma.map.create({
          data: {
            name: templateMap.name,
            width: templateMap.width,
            height: templateMap.height,
            playthroughId: playthrough.id,
          },
        });

        // Clone tiles
        await prisma.tile.createMany({
          data: templateMap.templateTiles.map((tile) => ({
            x: tile.x,
            y: tile.y,
            layer: tile.layer,
            type: tile.type,
            mapId: map.id,
          })),
        });

        // Create character lookup for tile reference
        const tileMap = new Map<string, number>();
        const tiles = await prisma.tile.findMany({
          where: { mapId: map.id },
        });
        for (const tile of tiles) {
          tileMap.set(`${tile.x}:${tile.y}:${tile.layer}`, tile.id);
        }

        // Clone NPCs
        for (const npc of templateMap.templateCharacters) {
          const stats = npc.stats as Stat;
          const npcStat = await prisma.stat.create({
            data: {
              hp: stats.hp,
              maxHp: stats.maxHp,
              strength: stats.strength,
              agility: stats.agility,
              charisma: stats.charisma,
              intelligence: stats.intelligence,
              luck: stats.luck,
            },
          });

          const tileId = tileMap.get(`${npc.x}:${npc.y}:${npc.layer}`) ?? null;
          if (!tileId) continue;

          await prisma.character.create({
            data: {
              name: npc.name,
              isPlayer: false,
              stat: { connect: { id: npcStat.id } },
              playthrough: { connect: { id: playthrough.id } },
              map: { connect: { id: map.id } },
              tile: { connect: { id: tileId } },
              npcData: {
                create: {
                  behavior: npc.behavior ?? {},
                },
              },
            },
          });
        }

        // Clone objects
        for (const tile of templateMap.templateTiles) {
          const tileId = tileMap.get(`${tile.x}:${tile.y}:${tile.layer}`);
          if (!tileId) continue;

          for (const obj of tile.templateObjects) {
            await prisma.gameObject.create({
              data: {
                name: obj.name,
                type: obj.type,
                properties: obj.properties as Prisma.InputJsonValue,
                tileId,
              },
            });
          }
        }
      }

      return {
        success: true,
        characterId: character.id,
        playthroughId: playthrough.id,
      };
    }),
  getPlayerCharacters: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.character.findMany({
        where: {
          isPlayer: true,
          playerData: {
            userId: input.id,
          },
        },
        include: {
          stat: true,
        },
      });
    }),
});
