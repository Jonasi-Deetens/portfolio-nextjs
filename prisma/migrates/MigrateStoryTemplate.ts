import { ObjectType, PrismaClient, TileType } from "@prisma/client";
const prisma = new PrismaClient();

async function seedStoryTemplate() {
  console.log("🌱 Seeding story template...");

  await prisma.user.create({
    data: {
      id: "5ae8a3cd-1e79-4f6d-b685-45fe96a9e6e8",
      name: "jonasi",
      email: "jonasi@inksane.be",
    },
  });

  const template = await prisma.storyTemplate.create({
    data: {
      name: "The Forest Curse",
      description: "A mysterious fog creeps through the haunted woods.",
      maps: {
        create: [
          {
            name: "Haunted Forest",
            width: 10,
            height: 10,
            templateTiles: {
              create: generateTemplateTiles(10, 10),
            },
            templateCharacters: {
              create: [
                {
                  name: "Old Hermit",
                  isPlayer: false,
                  stats: {
                    hp: 20,
                    strength: 3,
                    agility: 2,
                    charisma: 6,
                    intelligence: 7,
                    luck: 4,
                    maxHp: 20,
                  },
                  behavior: {
                    type: "dialogue",
                    dialogue: ["The forest has eyes...", "Beware the fog."],
                  },
                  x: 5,
                  y: 5,
                  layer: 0,
                },
                {
                  name: "Forest Wolf",
                  isPlayer: false,
                  stats: {
                    hp: 15,
                    strength: 5,
                    agility: 6,
                    charisma: 1,
                    intelligence: 2,
                    luck: 3,
                    maxHp: 15,
                  },
                  behavior: {
                    type: "aggressive",
                    range: 3,
                  },
                  x: 2,
                  y: 3,
                  layer: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const forestMap = await prisma.templateMap.findFirst({
    where: { templateId: template.id },
    include: { templateTiles: true },
  });

  if (!forestMap) {
    console.error("No map found for template.");
    return;
  }

  const sampleTile = forestMap.templateTiles.find(
    (tile) => tile.x === 5 && tile.y === 5
  );

  if (sampleTile) {
    await prisma.templateObject.createMany({
      data: [
        {
          type: ObjectType.CHEST,
          name: "Hidden Chest",
          properties: { loot: ["gold", "sword"], locked: true },
          tileId: sampleTile.id,
        },
        {
          type: ObjectType.TREE,
          name: "Ancient Tree",
          properties: { health: 100 },
          tileId: sampleTile.id,
        },
      ],
    });
  }

  console.log("✅ Story template seeded successfully.");
}

function generateTemplateTiles(width: number, height: number) {
  const tiles = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      tiles.push({
        x,
        y,
        layer: 0,
        type: (x + y) % 5 === 0 ? TileType.FOREST : TileType.GRASS,
      });
    }
  }
  return tiles;
}

seedStoryTemplate()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
