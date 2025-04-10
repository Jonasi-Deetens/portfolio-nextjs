// server/routers/characterRouter.ts
import { prisma } from "@/lib/prisma";
import { Prisma, Stat } from "@prisma/client";
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { omit } from "lodash";

const t = initTRPC.create();

export const characterRouter = t.router({
  createCharacter: t.procedure
    .input(
      z.object({
        userId: z.string(),
        storyTemplateId: z.number(),
        name: z.string().min(2).max(50),
        strength: z.number().min(1).max(20),
        agility: z.number().min(1).max(20),
        intelligence: z.number().min(1).max(20),
        charisma: z.number().min(1).max(20),
        luck: z.number().min(1).max(20),
        classId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        userId,
        storyTemplateId,
        name,
        strength,
        agility,
        intelligence,
        charisma,
        luck,
        classId,
      } = input;
      console.log("input", input);

      try {
        const storyTemplate = await prisma.storyTemplate.findUnique({
          where: { id: storyTemplateId },
          include: { maps: { include: { templateTiles: true } } },
        });

        if (!storyTemplate?.maps) {
          throw new Error("Story template or maps not found");
        }

        // Step 1: Create Stat
        const stat = await prisma.stat.create({
          data: {
            hp: 10 + strength,
            maxHp: 10 + strength,
            strength,
            agility,
            intelligence: intelligence,
            charisma,
            luck,
          },
        });
        console.log("userId", userId);

        // Step 2: Create StoryPlaythrough with maps
        const playthrough = await prisma.storyPlaythrough.create({
          data: {
            name: `${name}'s Adventure`,
            storyTemplate: { connect: { id: storyTemplateId } },
            user: { connect: { id: userId } },
            maps: {
              create: storyTemplate.maps.map((templateMap) => ({
                ...omit(templateMap, "id", "templateId", "templateTiles"),
                tiles: {
                  create: templateMap.templateTiles.map((tile) => ({
                    x: tile.x,
                    y: tile.y,
                    layer: tile.layer,
                    type: tile.type,
                  })),
                },
              })),
            },
          },
          include: {
            maps: {
              include: {
                tiles: true,
              },
            },
          },
        });

        // Step 3: Create Character
        console.log(playthrough.maps);
        // Find a valid starting tile (not a wall/water/mountain)
        const startTile = playthrough.maps[0].tiles.find(
          (tile) =>
            tile.layer === 0 &&
            !["WALL", "WATER", "MOUNTAIN"].includes(tile.type)
        );

        if (!startTile) {
          throw new Error("No valid starting position found");
        }

        const character = await prisma.character.create({
          data: {
            name,
            isPlayer: true,
            stat: { connect: { id: stat.id } },
            playthrough: { connect: { id: playthrough.id } },
            class: { connect: { id: classId } },
            tile: { connect: { id: startTile.id } },
          },
        });

        await prisma.player.create({
          data: {
            character: { connect: { id: character.id } },
            user: { connect: { id: input.userId } },
          },
        });

        // Optional: clone maps, tiles, template NPCs here (can move to a separate service)
        const templateMaps = await prisma.templateMap.findMany({
          where: { templateId: storyTemplateId },
          include: {
            templateTiles: {
              include: {
                templateObjects: { include: { object: true } },
                characters: { include: { stat: true, tile: true } },
              },
            },
          },
        });

        for (const templateMap of templateMaps) {
          // Clone map
          const map = await prisma.map.create({
            data: {
              name: templateMap.name,
              width: templateMap.width,
              height: templateMap.height,
              playthrough: { connect: { id: playthrough.id } },
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

          const templateCharacters = templateMap.templateTiles.flatMap(
            (tile) => tile.characters
          );
          // Clone NPCs
          for (const char of templateCharacters) {
            const stats = char.stat as Stat;
            const charStat = await prisma.stat.create({
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

            const tileId =
              tileMap.get(
                `${char.tile?.x}:${char.tile?.y}:${char.tile?.layer}`
              ) ?? null;
            if (!tileId) continue;

            await prisma.character.create({
              data: {
                name: char.name,
                isPlayer: false,
                stat: { connect: { id: charStat.id } },
                playthrough: { connect: { id: playthrough.id } },
                tile: { connect: { id: tileId } },
                npcData: {
                  create: {
                    behavior: char.behavior ?? {},
                  },
                },
                class: { connect: { id: classId } },
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
                  object: { connect: { id: obj.objectId } },
                  tile: { connect: { id: tileId } },
                  properties: obj.properties as Prisma.InputJsonValue,
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
      } catch (error) {
        console.error("❌ Error in createCharacter:", error);
        throw error;
      }
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
          class: true,
          playthrough: {
            include: {
              maps: {
                include: {
                  tiles: {
                    include: {
                      objects: {
                        include: {
                          object: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          npcData: true,
          playerData: true,
          tile: {
            include: {
              objects: {
                include: {
                  object: true,
                },
              },
            },
          },
        },
      });
    }),

  updatePosition: t.procedure
    .input(
      z.object({
        characterId: z.number(),
        tileId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { characterId, tileId } = input;

      return await prisma.character.update({
        where: { id: characterId },
        data: {
          tileId: tileId,
        },
        include: {
          stat: true,
          class: true,
          playthrough: {
            include: {
              maps: {
                include: {
                  tiles: {
                    include: {
                      objects: {
                        include: {
                          object: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          npcData: true,
          playerData: true,
          tile: {
            include: {
              objects: {
                include: {
                  object: true,
                },
              },
            },
          },
        },
      });
    }),
});
