// Base interface for all object properties
interface BaseProperties {
  durability?: number;
  weight?: number;
  value?: number;
  isLocked?: boolean;
  isBreakable?: boolean;
  interactions?: Interaction[];
}

// Define interaction types
interface Interaction {
  type: string;
  requirements?: {
    level?: number;
    items?: string[];
    skills?: string[];
  };
  cooldown?: number;
  duration?: number;
  effects?: {
    type: string;
    value: number;
    duration?: number;
  }[];
}

// Storage types
interface StorageProperties extends BaseProperties {
  capacity: number;
  compartments?: number;
  isSecure?: boolean;
  accessLevel?: number;
  allowedItems?: string[];
  interactionType: 'open' | 'close' | 'store' | 'retrieve';
}

// Environment types
interface TreeProperties extends BaseProperties {
  height: number;
  woodType: string;
  growthStage: number;
  canBeChopped: boolean;
  respawnTime?: number;
  interactionType: 'chop' | 'gather' | 'examine';
  resources?: {
    type: string;
    amount: number;
    respawnTime?: number;
  }[];
}

interface RockProperties extends BaseProperties {
  size: number;
  rockType: string;
  canBeMined: boolean;
  mineralContent?: string[];
  interactionType: 'mine' | 'examine';
  resources?: {
    type: string;
    amount: number;
    respawnTime?: number;
  }[];
}

interface HouseProperties extends BaseProperties {
  size: number;
  rooms: number;
  isLocked: boolean;
  ownerId?: string;
  accessLevel: number;
  interactionType: 'enter' | 'exit' | 'lock' | 'unlock';
  allowedPlayers?: string[];
}

interface PortalProperties extends BaseProperties {
  destination: string;
  isActive: boolean;
  activationCost?: number;
  cooldownTime?: number;
  interactionType: 'activate' | 'deactivate' | 'teleport';
  restrictions?: {
    level?: number;
    items?: string[];
    faction?: string;
  };
}

// Equipment types
interface WeaponProperties extends BaseProperties {
  damage: number;
  attackSpeed: number;
  range: number;
  weaponType: string;
  requirements: {
    level: number;
    strength?: number;
    dexterity?: number;
    intelligence?: number;
  };
  effects?: string[];
  interactionType: 'equip' | 'unequip' | 'attack' | 'block';
  combatEffects?: {
    type: string;
    chance: number;
    duration?: number;
  }[];
}

interface ArmorProperties extends BaseProperties {
  defense: number;
  weight: number;
  armorType: string;
  requirements: {
    level: number;
    strength?: number;
  };
  resistances?: {
    physical?: number;
    magical?: number;
    fire?: number;
    ice?: number;
    lightning?: number;
  };
  interactionType: 'equip' | 'unequip';
  setBonus?: {
    pieces: number;
    effects: string[];
  };
}

// Item types
interface ConsumableProperties extends BaseProperties {
  effects: {
    type: string;
    value: number;
    duration?: number;
  }[];
  stackSize: number;
  useTime: number;
  interactionType: 'consume' | 'throw' | 'store';
  usageConditions?: {
    health?: number;
    status?: string[];
    environment?: string[];
  };
}

interface QuestItemProperties extends BaseProperties {
  questId: string;
  isKeyItem: boolean;
  isConsumable: boolean;
  questStage: number;
  interactionType: 'use' | 'examine' | 'give';
  questTriggers?: {
    stage: number;
    action: string;
    nextStage: number;
  }[];
}

// Furniture types
interface FurnitureProperties extends BaseProperties {
  comfort?: number;
  size: string;
  placement: {
    x: number;
    y: number;
    rotation: number;
  };
  interactable: boolean;
  interactionType: 'sit' | 'lie' | 'move' | 'rotate';
  comfortEffects?: {
    type: string;
    value: number;
    duration?: number;
  }[];
}

interface CraftingStationProperties extends BaseProperties {
  craftingTypes: string[];
  level: number;
  efficiency: number;
  requiredTools?: string[];
  recipes?: string[];
  interactionType: 'craft' | 'upgrade' | 'repair';
  craftingEffects?: {
    type: string;
    chance: number;
    duration?: number;
  }[];
}

// Interactive types
interface LeverProperties extends BaseProperties {
  isActive: boolean;
  connectedObjects: string[];
  activationType: 'toggle' | 'timed' | 'conditional';
  cooldown?: number;
  interactionType: 'pull' | 'push' | 'reset';
  triggerEffects?: {
    type: string;
    target: string;
    duration?: number;
  }[];
}

interface TrapProperties extends BaseProperties {
  damage: number;
  triggerType: string;
  isArmed: boolean;
  resetTime?: number;
  detectionDC?: number;
  interactionType: 'arm' | 'disarm' | 'trigger' | 'reset';
  trapEffects?: {
    type: string;
    damage: number;
    duration?: number;
    area?: number;
  }[];
}

interface LightSourceProperties extends BaseProperties {
  brightness: number;
  radius: number;
  color: string;
  duration?: number;
  isMagical: boolean;
  interactionType: 'toggle' | 'adjust' | 'extinguish';
  lightEffects?: {
    type: string;
    intensity: number;
    duration?: number;
  }[];
}

export type {
  BaseProperties,
  Interaction,
  StorageProperties,
  TreeProperties,
  RockProperties,
  HouseProperties,
  PortalProperties,
  WeaponProperties,
  ArmorProperties,
  ConsumableProperties,
  QuestItemProperties,
  FurnitureProperties,
  CraftingStationProperties,
  LeverProperties,
  TrapProperties,
  LightSourceProperties,
};
