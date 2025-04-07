import { ObjectType, PrismaClient, TileType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedStoryTemplate() {
  console.log("🌱 Seeding story template...");

  const password = "test1234";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      id: "5ae8a3cd-1e79-4f6d-b685-45fe96a9e6e8",
      name: "jonasi",
      email: "jonasi@inksane.be",
      passwordHash,
    },
  });

  // Create base classes
  await prisma.class.createMany({
    data: [
      {
        name: "Warrior",
        description: "A mighty melee fighter skilled in combat",
        hpMultiplier: 1.2,
        manaMultiplier: 0.8,
        strengthMultiplier: 1.3,
        agilityMultiplier: 0.9,
        intelligenceMultiplier: 0.7,
        abilities: ["slash", "shield_bash", "war_cry"],
        passiveBonuses: {
          criticalChance: 0.02,
          armor: 2,
        },
        startingEquipment: ["iron_sword", "wooden_shield", "leather_armor"],
        levelUpBonuses: {
          hp: 10,
          mana: 3,
          strength: 3,
          agility: 1,
          intelligence: 1,
        },
      },
      {
        name: "Rogue",
        description: "A swift and cunning fighter specializing in stealth",
        hpMultiplier: 0.9,
        manaMultiplier: 0.9,
        strengthMultiplier: 0.9,
        agilityMultiplier: 1.4,
        intelligenceMultiplier: 0.9,
        abilities: ["backstab", "stealth", "poison_blade"],
        passiveBonuses: {
          dodgeChance: 0.05,
          criticalChance: 0.05,
        },
        startingEquipment: ["dagger", "leather_armor", "throwing_knives"],
        levelUpBonuses: {
          hp: 6,
          mana: 4,
          strength: 1,
          agility: 3,
          intelligence: 1,
        },
      },
      {
        name: "Mage",
        description: "A wielder of arcane magic and forbidden knowledge",
        hpMultiplier: 0.8,
        manaMultiplier: 1.4,
        strengthMultiplier: 0.7,
        agilityMultiplier: 0.8,
        intelligenceMultiplier: 1.4,
        abilities: ["fireball", "ice_bolt", "arcane_shield"],
        passiveBonuses: {
          magicResist: 3,
          manaRegen: 0.02,
        },
        startingEquipment: ["wooden_staff", "cloth_robes", "spell_book"],
        levelUpBonuses: {
          hp: 4,
          mana: 8,
          strength: 1,
          agility: 1,
          intelligence: 3,
        },
      },
    ],
  });

  const template = await prisma.storyTemplate.create({
    data: {
      name: "The Forest Curse",
      description: "A mysterious fog creeps through the haunted woods.",
      maps: {
        create: [
          {
            name: "Haunted Forest",
            width: 20,
            height: 20,
            templateTiles: {
              create: generateTemplateTiles(20, 20),
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
                    level: 3,
                    experience: 450,
                  },
                  behavior: {
                    type: "dialogue",
                    dialogue: [
                      "The forest has eyes...",
                      "Beware the fog.",
                      "Take this potion, you'll need it...",
                    ],
                    questGiver: true,
                    quest: {
                      id: "forest_curse",
                      name: "Lift the Forest Curse",
                      rewards: ["magic_scroll", "50_gold"],
                    },
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
                    level: 2,
                    experience: 100,
                  },
                  behavior: {
                    type: "aggressive",
                    range: 3,
                    drops: ["wolf_pelt", "wolf_fang"],
                    patrolPath: [
                      { x: 2, y: 3 },
                      { x: 2, y: 6 },
                      { x: 5, y: 6 },
                      { x: 5, y: 3 },
                    ],
                  },
                  x: 2,
                  y: 3,
                  layer: 0,
                },
                {
                  name: "Forest Witch",
                  isPlayer: false,
                  stats: {
                    hp: 30,
                    strength: 2,
                    agility: 3,
                    charisma: 5,
                    intelligence: 8,
                    luck: 6,
                    maxHp: 30,
                    level: 5,
                    experience: 1200,
                  },
                  behavior: {
                    type: "merchant",
                    inventory: [
                      { item: "health_potion", cost: 10 },
                      { item: "mana_potion", cost: 15 },
                      { item: "magic_scroll", cost: 50 },
                    ],
                    dialogue: [
                      "Need some potions, dearie?",
                      "I can teach you magic... for a price.",
                    ],
                  },
                  x: 15,
                  y: 15,
                  layer: 0,
                },
              ],
            },
          },
          {
            name: "Dark Cave",
            width: 15,
            height: 15,
            templateTiles: {
              create: generateCaveTiles(15, 15),
            },
            templateCharacters: {
              create: [
                {
                  name: "Cave Troll",
                  isPlayer: false,
                  stats: {
                    hp: 50,
                    strength: 8,
                    agility: 2,
                    charisma: 1,
                    intelligence: 2,
                    luck: 2,
                    maxHp: 50,
                    level: 6,
                    experience: 2000,
                  },
                  behavior: {
                    type: "boss",
                    range: 5,
                    drops: ["troll_club", "rare_gem"],
                    abilities: ["ground_slam", "rock_throw"],
                  },
                  x: 7,
                  y: 7,
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
          properties: {
            loot: ["gold", "magic_sword", "health_potion"],
            locked: true,
            requiredKey: "forest_key",
            trapType: "poison_dart",
            trapDamage: 10,
          },
          tileId: sampleTile.id,
        },
        {
          type: ObjectType.TREE,
          name: "Ancient Tree",
          properties: {
            health: 100,
            harvestable: true,
            resources: ["ancient_wood", "magic_sap"],
            respawnTime: 3600,
          },
          tileId: sampleTile.id,
        },
        {
          type: ObjectType.SHRINE,
          name: "Forest Shrine",
          properties: {
            blessing: "nature_protection",
            duration: 300,
            cooldown: 1800,
            requirements: ["forest_offering"],
          },
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
      const isEdge = x === 0 || x === width - 1 || y === 0 || y === height - 1;
      const tileType = isEdge
        ? TileType.FOREST
        : (x + y) % 7 === 0
          ? TileType.FOREST
          : (x + y) % 5 === 0
            ? TileType.WATER
            : TileType.GRASS;

      tiles.push({
        x,
        y,
        layer: 0,
        type: tileType,
      });
    }
  }
  return tiles;
}

function generateCaveTiles(width: number, height: number) {
  const tiles = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const isEdge = x === 0 || x === width - 1 || y === 0 || y === height - 1;
      const tileType = isEdge
        ? TileType.WALL
        : (x + y) % 8 === 0
          ? TileType.WALL
          : (x + y) % 6 === 0
            ? TileType.WATER
            : TileType.CAVE_FLOOR;

      tiles.push({
        x,
        y,
        layer: 0,
        type: tileType,
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
