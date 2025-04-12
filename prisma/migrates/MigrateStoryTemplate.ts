import { ObjectType, PrismaClient, TileType, TemplateTile } from '@prisma/client';
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
          },
          {
            name: 'Second Floor',
            description: 'A second floor of a house',
            width: 15,
            height: 15,
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

  // First, create all template tiles for the ground floor
  const groundFloorTiles: TemplateTile[] = [];
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 15; x++) {
      let tileType;

      // Default to WALL for the border
      if (x === 0 || x === 14 || y === 0 || (y === 9 && x !== 7)) {
        tileType = TileType.WALL;
      } else if (
        (x === 13 && y === 2) ||
        (x === 12 && y === 2) ||
        (x === 10 && y === 1) ||
        (x === 10 && y === 2)
      ) {
        tileType = TileType.WALL;
      } else if (x === 13 && y === 1) {
        tileType = TileType.STAIRS_UP;
      } else if (x === 7 && y === 9) {
        tileType = TileType.DOORWAY;
      } else {
        tileType = TileType.WOODEN_FLOOR;
      }

      const tile = await prisma.templateTile.create({
        data: {
          x,
          y,
          layer: 0,
          type: tileType,
          map: { connect: { id: groundFloorMap.id } },
        },
      });

      groundFloorTiles.push(tile);
    }
  }

  // Create objects for the furniture and items
  const objects = await prisma.object.createMany({
    data: [
      {
        name: 'Elegant Lamp',
        description: 'A beautiful decorative lamp that provides warm lighting',
        type: ObjectType.LIGHT_SOURCE,
        properties: {
          durability: 100,
          brightness: 5,
          interactable: true,
        },
      },
      {
        name: 'Wooden Bookshelf',
        description: 'A sturdy bookshelf filled with various books',
        type: ObjectType.FURNITURE,
        properties: {
          durability: 100,
          storage: true,
          interactable: true,
        },
      },
      {
        name: 'Dining Chair',
        description: 'A comfortable wooden chair',
        type: ObjectType.FURNITURE,
        properties: {
          durability: 50,
          comfort: 3,
          interactable: true,
        },
      },
      {
        name: 'Dining Table',
        description: 'A large wooden dining table',
        type: ObjectType.FURNITURE,
        properties: {
          durability: 100,
          surface: true,
          interactable: true,
        },
      },
      {
        name: 'Modern Refrigerator',
        description: 'A refrigerator for storing food',
        type: ObjectType.STORAGE,
        properties: {
          durability: 200,
          storage: true,
          preservation: true,
          interactable: true,
        },
      },
      {
        name: 'Kitchen Table',
        description: 'A sturdy kitchen preparation table',
        type: ObjectType.FURNITURE,
        properties: {
          durability: 150,
          surface: true,
          interactable: true,
        },
      },
      {
        name: 'Comfortable Sofa',
        description: 'A plush three-seater sofa',
        type: ObjectType.FURNITURE,
        properties: {
          durability: 100,
          comfort: 8,
          interactable: true,
        },
      },
      {
        name: 'Stone Fireplace',
        description: 'A warm stone fireplace',
        type: ObjectType.LIGHT_SOURCE,
        properties: {
          durability: 500,
          heat: true,
          light: true,
          interactable: true,
        },
      },
      {
        name: 'Modern Television',
        description: 'A flat-screen television',
        type: ObjectType.FURNITURE,
        properties: {
          durability: 50,
          entertainment: true,
          interactable: true,
        },
      },
      {
        name: 'Kitchen Sink',
        description: 'A stainless steel kitchen sink',
        type: ObjectType.FURNITURE,
        properties: {
          durability: 200,
          water: true,
          interactable: true,
        },
      },
      {
        name: 'Modern Stove',
        description: 'A modern cooking stove',
        type: ObjectType.CRAFTING_STATION,
        properties: {
          durability: 200,
          cooking: true,
          heat: true,
          interactable: true,
        },
      },
    ],
  });

  // Get all created objects
  const createdObjects = await prisma.object.findMany();

  // Get all template tiles
  const templateTiles = await prisma.templateTile.findMany({
    where: { mapId: groundFloorMap.id },
  });

  // Create template objects by mapping objects to their positions
  const objectPlacements = [
    // Lamps
    {
      name: 'Elegant Lamp',
      positions: [
        [1, 1],
        [9, 1],
        [1, 8],
        [13, 8],
      ],
    },
    // Bookshelves
    {
      name: 'Wooden Bookshelf',
      positions: [
        [2, 1],
        [3, 1],
      ],
    },
    // Chairs
    {
      name: 'Dining Chair',
      positions: [
        [6, 1],
        [7, 1],
        [6, 3],
        [7, 3],
      ],
    },
    // Tables
    {
      name: 'Dining Table',
      positions: [
        [6, 2],
        [7, 2],
      ],
    },
    // Refrigerator
    { name: 'Modern Refrigerator', positions: [[12, 3]] },
    // Kitchen Tables
    {
      name: 'Kitchen Table',
      positions: [
        [13, 3],
        [13, 5],
        [13, 7],
      ],
    },
    // Sofa
    {
      name: 'Comfortable Sofa',
      positions: [
        [3, 6],
        [4, 6],
        [5, 6],
      ],
    },
    // Fireplace
    { name: 'Stone Fireplace', positions: [[3, 8]] },
    // Television
    { name: 'Modern Television', positions: [[4, 8]] },
    // Sink
    { name: 'Kitchen Sink', positions: [[13, 4]] },
    // Stove
    { name: 'Modern Stove', positions: [[13, 6]] },
  ];

  // Create template objects
  for (const placement of objectPlacements) {
    const object = createdObjects.find((obj) => obj.name === placement.name);
    if (!object) continue;

    for (const [x, y] of placement.positions) {
      const tile = templateTiles.find((t) => t.x === x && t.y === y);
      if (!tile) continue;

      await prisma.templateObject.create({
        data: {
          objectId: object.id,
          tileId: tile.id,
          properties: object.properties,
        },
      });
    }
  }

  // After creating template objects

  // Create innkeeper's stats first
  const innkeeperStats = await prisma.stat.create({
    data: {
      hp: 100,
      maxHp: 100,
      mana: 50,
      maxMana: 50,
      strength: 12,
      agility: 10,
      intelligence: 8,
      charisma: 15,
      luck: 10,
    },
  });

  // Create the innkeeper character first
  const innkeeper = await prisma.templateCharacter.create({
    data: {
      name: 'Martha the Innkeeper',
      isPlayer: false,
      classId: 1,
      level: 5,
      equipment: {
        weapon: 'iron_dagger',
        armor: 'leather_apron',
      },
      inventory: {
        items: ['health_potion', 'bread', 'cheese'],
      },
      gold: 100,
      tileId: groundFloorTiles[4].id,
      statId: innkeeperStats.id,
    },
  });

  // Then create the NPC data with a connection to the character
  await prisma.nPC.create({
    data: {
      templateCharacterId: innkeeper.id,
      behavior: {
        routine: 'innkeeper',
        dialogue: {
          greeting: 'Welcome to my humble inn!',
          farewell: 'Safe travels!',
        },
      },
      merchant: true,
      shopInventory: {
        items: ['bread', 'cheese', 'ale', 'room_key'],
        prices: { bread: 2, cheese: 3, ale: 5, room_key: 10 },
      },
    },
  });

  // Create cook's stats
  const cookStats = await prisma.stat.create({
    data: {
      hp: 80,
      maxHp: 80,
      mana: 40,
      maxMana: 40,
      strength: 10,
      agility: 14,
      intelligence: 12,
      charisma: 10,
      luck: 8,
    },
  });

  // Create the cook character
  const cook = await prisma.templateCharacter.create({
    data: {
      name: 'Chef Gordon',
      isPlayer: false,
      classId: 2,
      level: 4,
      equipment: {
        weapon: 'kitchen_knife',
        armor: 'chef_outfit',
      },
      inventory: {
        items: ['spices', 'cooking_ingredients', 'recipe_book'],
      },
      gold: 75,
      tileId: groundFloorTiles[3].id,
      statId: cookStats.id,
    },
  });

  // Create cook's NPC data
  await prisma.nPC.create({
    data: {
      templateCharacterId: cook.id,
      behavior: {
        routine: 'cook',
        dialogue: {
          greeting: "Hungry? I've got just the thing!",
          farewell: "Come back when you're hungry!",
        },
      },
      merchant: true,
      shopInventory: {
        items: ['cooked_meal', 'special_stew', 'fresh_bread'],
        prices: { cooked_meal: 8, special_stew: 12, fresh_bread: 4 },
      },
    },
  });

  // Create scholar's stats
  const scholarStats = await prisma.stat.create({
    data: {
      hp: 70,
      maxHp: 70,
      mana: 120,
      maxMana: 120,
      strength: 8,
      agility: 9,
      intelligence: 16,
      charisma: 12,
      luck: 10,
    },
  });

  // Create the scholar character
  const scholar = await prisma.templateCharacter.create({
    data: {
      name: 'Professor Arcanus',
      isPlayer: false,
      classId: 3,
      level: 6,
      equipment: {
        weapon: 'magic_staff',
        armor: 'scholar_robes',
      },
      inventory: {
        items: ['spell_scroll', 'ancient_tome', 'magic_quill'],
      },
      gold: 150,
      tileId: groundFloorTiles[3].id,
      statId: scholarStats.id,
    },
  });

  // Create scholar's NPC data
  await prisma.nPC.create({
    data: {
      templateCharacterId: scholar.id,
      behavior: {
        routine: 'scholar',
        dialogue: {
          greeting: 'Ah, a seeker of knowledge!',
          farewell: 'May wisdom guide your path.',
        },
      },
      merchant: true,
      shopInventory: {
        items: ['spell_scroll', 'magic_book', 'enchanted_ink'],
        prices: { spell_scroll: 25, magic_book: 50, enchanted_ink: 15 },
      },
      questGiver: true,
      availableQuests: {
        quests: [
          {
            id: 'ancient_knowledge',
            title: 'Seeking Ancient Knowledge',
            description: 'Find rare magical tomes in the nearby ruins.',
            reward: { gold: 100, items: ['rare_spell_scroll'] },
          },
        ],
      },
    },
  });

  console.log('✅ Story template seeded successfully.');
}

seedStoryTemplate()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
