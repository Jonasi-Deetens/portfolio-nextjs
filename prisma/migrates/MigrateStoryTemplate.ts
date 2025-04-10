import { ObjectType, PrismaClient, TileType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedStoryTemplate() {
  console.log('🌱 Seeding story template...');

  const password = 'test1234';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      id: '5ae8a3cd-1e79-4f6d-b685-45fe96a9e6e8',
      name: 'jonasi',
      email: 'jonasi@inksane.be',
      passwordHash,
    },
  });

  // Create base classes
  await prisma.characterClass.createMany({
    data: [
      {
        name: 'Warrior',
        description: 'A mighty melee fighter skilled in combat',
        hpMultiplier: 1.2,
        manaMultiplier: 0.8,
        strengthMultiplier: 1.3,
        agilityMultiplier: 0.9,
        intelligenceMultiplier: 0.7,
        abilities: ['slash', 'shield_bash', 'war_cry'],
        passiveBonuses: {
          criticalChance: 0.02,
          armor: 2,
        },
        startingEquipment: ['iron_sword', 'wooden_shield', 'leather_armor'],
        levelUpBonuses: {
          hp: 10,
          mana: 3,
          strength: 3,
          agility: 1,
          intelligence: 1,
        },
      },
      {
        name: 'Rogue',
        description: 'A swift and cunning fighter specializing in stealth',
        hpMultiplier: 0.9,
        manaMultiplier: 0.9,
        strengthMultiplier: 0.9,
        agilityMultiplier: 1.4,
        intelligenceMultiplier: 0.9,
        abilities: ['backstab', 'stealth', 'poison_blade'],
        passiveBonuses: {
          dodgeChance: 0.05,
          criticalChance: 0.05,
        },
        startingEquipment: ['dagger', 'leather_armor', 'throwing_knives'],
        levelUpBonuses: {
          hp: 6,
          mana: 4,
          strength: 1,
          agility: 3,
          intelligence: 1,
        },
      },
      {
        name: 'Mage',
        description: 'A wielder of arcane magic and forbidden knowledge',
        hpMultiplier: 0.8,
        manaMultiplier: 1.4,
        strengthMultiplier: 0.7,
        agilityMultiplier: 0.8,
        intelligenceMultiplier: 1.4,
        abilities: ['fireball', 'ice_bolt', 'arcane_shield'],
        passiveBonuses: {
          magicResist: 3,
          manaRegen: 0.02,
        },
        startingEquipment: ['wooden_staff', 'cloth_robes', 'spell_book'],
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
      name: 'Fresh Start',
      description: 'A fresh start in a new world.',
      maps: {
        create: [
          {
            name: 'Ground Floor',
            description: 'A ground floor of a house',
            width: 15,
            height: 15,
            templateTiles: {
              create: generateHouseTiles(15, 15),
            },
          },
          {
            name: 'Second Floor',
            description: 'A second floor of a house',
            width: 15,
            height: 15,
            templateTiles: {
              create: generateHouseTiles(15, 15),
            },
          },
        ],
      },
    },
  });

  const groundFloorMap = await prisma.templateMap.findFirst({
    where: { templateId: template.id },
    include: { templateTiles: true },
  });

  if (!groundFloorMap) {
    console.error('No map found for template.');
    return;
  }

  // Create room tiles
  const livingRoomTiles = groundFloorMap.templateTiles.filter(
    (tile) => tile.x >= 2 && tile.x <= 7 && tile.y >= 2 && tile.y <= 7
  );

  const kitchenTiles = groundFloorMap.templateTiles.filter(
    (tile) => tile.x >= 8 && tile.x <= 13 && tile.y >= 2 && tile.y <= 5
  );

  const studyTiles = groundFloorMap.templateTiles.filter(
    (tile) => tile.x >= 8 && tile.x <= 13 && tile.y >= 6 && tile.y <= 9
  );

  // Create the objects
  await prisma.object.createMany({
    data: [
      {
        name: 'Comfortable Sofa',
        description: 'A plush three-seater sofa with decorative cushions',
        type: ObjectType.FURNITURE,
        properties: {
          durability: 100,
          weight: 50,
          value: 200,
          comfort: 8,
          size: 'large',
          interactable: true,
          interactions: {
            sit: { action: 'sit', effects: [{ type: 'comfort', value: 8 }] },
            rest: { action: 'rest', effects: [{ type: 'energy', value: 5 }] },
          },
        },
      },
      {
        name: 'Stone Fireplace',
        description: 'A warm, cozy fireplace made of carved stone',
        type: ObjectType.CRAFTING_STATION,
        properties: {
          durability: 200,
          weight: 300,
          value: 500,
          craftingTypes: ['cooking', 'heating'],
          level: 1,
          efficiency: 0.8,
          interactable: true,
        },
      },
      {
        name: 'Bookshelf',
        description: 'A tall wooden bookshelf filled with various tomes',
        type: ObjectType.STORAGE,
        properties: {
          durability: 100,
          weight: 150,
          value: 300,
          capacity: 50,
          compartments: 5,
          isSecure: false,
          accessLevel: 0,
          interactable: true,
        },
      },
      {
        name: 'Cooking Station',
        description: 'A fully equipped cooking area with stove and counter',
        type: ObjectType.CRAFTING_STATION,
        properties: {
          durability: 150,
          weight: 200,
          value: 400,
          craftingTypes: ['cooking', 'brewing'],
          level: 2,
          efficiency: 0.9,
          interactable: true,
        },
      },
      {
        name: 'Kitchen Storage',
        description: 'Various cabinets and drawers for storing ingredients',
        type: ObjectType.STORAGE,
        properties: {
          durability: 100,
          weight: 100,
          value: 250,
          capacity: 100,
          compartments: 8,
          isSecure: true,
          accessLevel: 1,
          interactable: true,
        },
      },
      {
        name: 'Writing Desk',
        description: 'An elegant desk for writing and studying',
        type: ObjectType.CRAFTING_STATION,
        properties: {
          durability: 100,
          weight: 80,
          value: 300,
          craftingTypes: ['scribing', 'enchanting'],
          level: 1,
          efficiency: 0.7,
          interactable: true,
        },
      },
      {
        name: 'Magic Lamp',
        description: 'A mysterious lamp that provides magical illumination',
        type: ObjectType.LIGHT_SOURCE,
        properties: {
          durability: 1000,
          weight: 2,
          value: 1000,
          brightness: 8,
          radius: 10,
          color: 'warm_yellow',
          duration: -1,
          isMagical: true,
        },
      },
    ],
  });

  // Get created objects
  const objects = await prisma.object.findMany({
    where: {
      name: {
        in: [
          'Comfortable Sofa',
          'Stone Fireplace',
          'Bookshelf',
          'Cooking Station',
          'Kitchen Storage',
          'Writing Desk',
          'Magic Lamp',
        ],
      },
    },
  });

  // Place objects in appropriate rooms
  const livingRoomObjects = objects.filter((obj) =>
    ['Comfortable Sofa', 'Stone Fireplace', 'Bookshelf'].includes(obj.name)
  );

  const kitchenObjects = objects.filter((obj) =>
    ['Cooking Station', 'Kitchen Storage'].includes(obj.name)
  );

  const studyObjects = objects.filter((obj) => ['Writing Desk', 'Magic Lamp'].includes(obj.name));

  // Create template objects for each room
  await prisma.templateObject.createMany({
    data: [
      // Living Room Objects
      ...livingRoomObjects.map((obj, index) => ({
        objectId: obj.id,
        tileId: livingRoomTiles[index + 2].id, // +2 to avoid corners
        properties: obj.properties,
      })),
      // Kitchen Objects
      ...kitchenObjects.map((obj, index) => ({
        objectId: obj.id,
        tileId: kitchenTiles[index + 2].id,
        properties: obj.properties,
      })),
      // Study Objects
      ...studyObjects.map((obj, index) => ({
        objectId: obj.id,
        tileId: studyTiles[index + 2].id,
        properties: obj.properties,
      })),
    ],
  });

  console.log('✅ Story template seeded successfully.');
}

function generateHouseTiles(width: number, height: number) {
  const tiles = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const isWall =
        x === 0 || x === width - 1 || y === 0 || y === height - 1 || (x === 7 && y >= 2 && y <= 9); // Room divider wall

      tiles.push({
        x,
        y,
        layer: 0,
        type: isWall ? TileType.WALL : TileType.CAVE_FLOOR, // Using CAVE_FLOOR for indoor flooring
      });
    }
  }
  return tiles;
}

seedStoryTemplate()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
