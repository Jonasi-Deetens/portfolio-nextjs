// Example objects for a two-floor house

const groundFloorObjects = [
  // Living Room
  {
    name: 'Comfortable Sofa',
    description: 'A plush three-seater sofa with decorative cushions',
    type: 'FURNITURE',
    properties: {
      durability: 100,
      weight: 50,
      value: 200,
      comfort: 8,
      size: 'large',
      placement: {
        x: 0,
        y: 0,
        rotation: 0,
      },
      interactable: true,
      interactions: {
        sit: {
          action: 'sit',
          duration: 0, // instant
          effects: [
            {
              type: 'comfort',
              value: 8,
              duration: 0,
            },
          ],
          requirements: {
            energy: 0,
            items: [],
          },
        },
        rest: {
          action: 'rest',
          duration: 300, // 5 minutes
          effects: [
            {
              type: 'energy',
              value: 5,
              duration: 0,
            },
          ],
          requirements: {
            energy: 0,
            items: [],
          },
        },
      },
    },
  },
  {
    name: 'Stone Fireplace',
    description: 'A warm, cozy fireplace made of carved stone',
    type: 'CRAFTING_STATION',
    properties: {
      durability: 200,
      weight: 300,
      value: 500,
      craftingTypes: ['cooking', 'heating'],
      level: 1,
      efficiency: 0.8,
      requiredTools: ['firewood', 'flint'],
      recipes: ['roasted_meat', 'warm_water'],
      interactable: true,
      interactions: {
        light: {
          action: 'light_fire',
          duration: 60, // 1 minute
          effects: [
            {
              type: 'warmth',
              value: 10,
              duration: 3600, // 1 hour
            },
          ],
          requirements: {
            energy: 5,
            items: ['firewood', 'flint'],
          },
        },
        cook: {
          action: 'cook',
          duration: 300, // 5 minutes
          effects: [],
          requirements: {
            energy: 10,
            items: ['ingredients'],
            recipes: ['roasted_meat', 'warm_water'],
          },
        },
      },
    },
  },
  {
    name: 'Bookshelf',
    description: 'A tall wooden bookshelf filled with various tomes',
    type: 'STORAGE',
    properties: {
      durability: 100,
      weight: 150,
      value: 300,
      capacity: 50,
      compartments: 5,
      isSecure: false,
      accessLevel: 0,
      interactable: true,
      interactions: {
        search: {
          action: 'search_books',
          duration: 30, // 30 seconds
          effects: [
            {
              type: 'knowledge',
              value: 1,
              duration: 0,
            },
          ],
          requirements: {
            energy: 2,
            items: [],
          },
        },
        store: {
          action: 'store_item',
          duration: 10, // 10 seconds
          effects: [],
          requirements: {
            energy: 1,
            items: ['*'], // any item
          },
        },
      },
    },
  },

  // Kitchen
  {
    name: 'Cooking Station',
    description: 'A fully equipped cooking area with stove and counter',
    type: 'CRAFTING_STATION',
    properties: {
      durability: 150,
      weight: 200,
      value: 400,
      craftingTypes: ['cooking', 'brewing'],
      level: 2,
      efficiency: 0.9,
      requiredTools: ['pots', 'pans'],
      recipes: ['healing_potion', 'strength_elixir'],
      interactable: true,
      interactions: {
        cook: {
          action: 'cook',
          duration: 600, // 10 minutes
          effects: [],
          requirements: {
            energy: 15,
            items: ['ingredients'],
            recipes: ['healing_potion', 'strength_elixir'],
          },
        },
        brew: {
          action: 'brew',
          duration: 900, // 15 minutes
          effects: [],
          requirements: {
            energy: 20,
            items: ['ingredients'],
            recipes: ['healing_potion', 'strength_elixir'],
          },
        },
      },
    },
  },
  {
    name: 'Kitchen Storage',
    description: 'Various cabinets and drawers for storing ingredients',
    type: 'STORAGE',
    properties: {
      durability: 100,
      weight: 100,
      value: 250,
      capacity: 100,
      compartments: 8,
      isSecure: true,
      accessLevel: 1,
      interactable: true,
      interactions: {
        store: {
          action: 'store_item',
          duration: 10,
          effects: [],
          requirements: {
            energy: 1,
            items: ['*'],
          },
        },
        retrieve: {
          action: 'retrieve_item',
          duration: 10,
          effects: [],
          requirements: {
            energy: 1,
            items: [],
          },
        },
      },
    },
  },

  // Dining Area
  {
    name: 'Dining Table',
    description: 'A sturdy wooden dining table with six chairs',
    type: 'FURNITURE',
    properties: {
      durability: 150,
      weight: 200,
      value: 350,
      comfort: 6,
      size: 'large',
      placement: {
        x: 0,
        y: 0,
        rotation: 0,
      },
      interactable: true,
      interactions: {
        eat: {
          action: 'eat',
          duration: 300, // 5 minutes
          effects: [
            {
              type: 'satisfaction',
              value: 5,
              duration: 0,
            },
          ],
          requirements: {
            energy: 0,
            items: ['food'],
          },
        },
      },
    },
  },

  // Second Floor Objects
  // Master Bedroom
  {
    name: 'Luxury Bed',
    description: 'A comfortable king-sized bed with ornate headboard',
    type: 'FURNITURE',
    properties: {
      durability: 120,
      weight: 180,
      value: 600,
      comfort: 10,
      size: 'king',
      placement: {
        x: 0,
        y: 0,
        rotation: 0,
      },
      interactable: true,
      interactions: {
        sleep: {
          action: 'sleep',
          duration: 28800, // 8 hours
          effects: [
            {
              type: 'energy',
              value: 100,
              duration: 0,
            },
            {
              type: 'health',
              value: 10,
              duration: 0,
            },
          ],
          requirements: {
            energy: 0,
            items: [],
          },
        },
        rest: {
          action: 'rest',
          duration: 1800, // 30 minutes
          effects: [
            {
              type: 'energy',
              value: 30,
              duration: 0,
            },
          ],
          requirements: {
            energy: 0,
            items: [],
          },
        },
      },
    },
  },
  {
    name: 'Wardrobe',
    description: 'A spacious wardrobe for storing clothing and accessories',
    type: 'STORAGE',
    properties: {
      durability: 100,
      weight: 120,
      value: 400,
      capacity: 200,
      compartments: 4,
      isSecure: true,
      accessLevel: 1,
      interactable: true,
      interactions: {
        store: {
          action: 'store_clothing',
          duration: 10,
          effects: [],
          requirements: {
            energy: 1,
            items: ['clothing'],
          },
        },
        change: {
          action: 'change_clothes',
          duration: 60,
          effects: [
            {
              type: 'appearance',
              value: 1,
              duration: 0,
            },
          ],
          requirements: {
            energy: 2,
            items: ['clothing'],
          },
        },
      },
    },
  },

  // Study Room
  {
    name: 'Writing Desk',
    description: 'An elegant desk for writing and studying',
    type: 'CRAFTING_STATION',
    properties: {
      durability: 100,
      weight: 80,
      value: 300,
      craftingTypes: ['scribing', 'enchanting'],
      level: 1,
      efficiency: 0.7,
      requiredTools: ['quill', 'ink'],
      recipes: ['scroll', 'enchantment'],
      interactable: true,
      interactions: {
        write: {
          action: 'write',
          duration: 600,
          effects: [
            {
              type: 'knowledge',
              value: 2,
              duration: 0,
            },
          ],
          requirements: {
            energy: 10,
            items: [],
          },
        },
      },
    },
  },
  {
    name: 'Magic Lamp',
    description: 'A mysterious lamp that provides magical illumination',
    type: 'LIGHT_SOURCE',
    properties: {
      durability: 1000,
      weight: 2,
      value: 1000,
      brightness: 8,
      radius: 10,
      color: 'warm_yellow',
      duration: -1, // infinite
      isMagical: true,
    },
  },

  // Bathroom
  {
    name: 'Healing Pool',
    description: 'A magical bathing pool with healing properties',
    type: 'SHRINE',
    properties: {
      durability: 1000,
      weight: 1000,
      value: 5000,
      effects: [
        {
          type: 'healing',
          value: 2,
          duration: 0,
        },
        {
          type: 'cleansing',
          value: 1,
          duration: 0,
        },
      ],
      capacity: 2,
      isMagical: true,
    },
  },

  // Decorative Items
  {
    name: 'Wall Tapestry',
    description: 'A beautiful tapestry depicting ancient legends',
    type: 'DECORATION',
    properties: {
      durability: 80,
      weight: 10,
      value: 500,
      size: 'large',
      placement: {
        x: 0,
        y: 0,
        rotation: 0,
      },
      interactable: false,
    },
  },
  {
    name: 'Crystal Display',
    description: 'A collection of magical crystals on display',
    type: 'DECORATION',
    properties: {
      durability: 100,
      weight: 15,
      value: 1000,
      size: 'medium',
      placement: {
        x: 0,
        y: 0,
        rotation: 0,
      },
      interactable: true,
      effects: [
        {
          type: 'magic_aura',
          value: 1,
          duration: -1,
        },
      ],
    },
  },
];

export default groundFloorObjects;
