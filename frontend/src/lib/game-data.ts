// Mock data for Virtual Land & Building Simulation

export interface LandPlot {
  id: string;
  tokenId: number;
  x: number;
  y: number;
  terrain: 'grassland' | 'forest' | 'mountain' | 'desert' | 'water' | 'volcanic';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  size: number;
  owner: string;
  buildings: Building[];
  resources: ResourceNode[];
  lastHarvested: Date;
  productivity: number; // 0-100
}

export interface Building {
  id: string;
  blueprintId: string;
  buildingType: 'farm' | 'mine' | 'factory' | 'house' | 'tower' | 'portal';
  level: number;
  x: number;
  y: number;
  resourceConsumption: ResourceCost[];
  output: ResourceOutput[];
  constructedAt: Date;
  lastUpgraded?: Date;
}

export interface Blueprint {
  id: string;
  tokenId: number;
  buildingType: 'farm' | 'mine' | 'factory' | 'house' | 'tower' | 'portal';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  resourceConsumption: ResourceCost[];
  output: ResourceOutput[];
  constructionTime: number; // in minutes
  maxLevel: number;
  description: string;
  owner: string;
}

export interface ResourceCost {
  type: 'wood' | 'stone' | 'metal' | 'energy' | 'water' | 'food';
  amount: number;
}

export interface ResourceOutput {
  type: 'wood' | 'stone' | 'metal' | 'energy' | 'water' | 'food' | 'tokens';
  amount: number;
  interval: number; // in minutes
}

export interface ResourceNode {
  id: string;
  type: 'wood' | 'stone' | 'metal' | 'energy' | 'water' | 'food';
  x: number;
  y: number;
  capacity: number;
  currentAmount: number;
  regenerationRate: number;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'building_contest' | 'resource_challenge' | 'exploration' | 'pvp_tournament';
  startDate: Date;
  endDate: Date;
  participants: number;
  maxParticipants: number;
  entryFee: number; // in STX
  rewards: EventReward[];
  requirements: string[];
  status: 'upcoming' | 'active' | 'completed';
}

export interface EventReward {
  position: number;
  type: 'nft' | 'tokens' | 'blueprint' | 'land';
  amount: number;
  description: string;
}

export interface MarketplaceListing {
  id: string;
  type: 'land' | 'blueprint';
  tokenId: number;
  seller: string;
  price: number; // in STX
  currency: 'STX' | 'TOKENS';
  listedAt: Date;
  expiresAt?: Date;
  featured: boolean;
}

export interface PlayerProfile {
  address: string;
  username?: string;
  level: number;
  experience: number;
  joinedAt: Date;
  achievements: Achievement[];
  stats: PlayerStats;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface PlayerStats {
  landsOwned: number;
  blueprintsOwned: number;
  buildingsConstructed: number;
  resourcesHarvested: number;
  tokensEarned: number;
  eventsParticipated: number;
  marketplaceSales: number;
}

// Terrain type configurations
export const TERRAIN_CONFIG = {
  grassland: {
    name: 'Grassland',
    color: '#8BC34A',
    icon: '🌱',
    baseProductivity: 80,
    preferredBuildings: ['farm', 'house'],
    resourceBonus: { food: 1.2, water: 1.1 }
  },
  forest: {
    name: 'Forest',
    color: '#4CAF50',
    icon: '🌲',
    baseProductivity: 90,
    preferredBuildings: ['farm', 'house'],
    resourceBonus: { wood: 1.5, energy: 1.1 }
  },
  mountain: {
    name: 'Mountain',
    color: '#795548',
    icon: '⛰️',
    baseProductivity: 70,
    preferredBuildings: ['mine', 'tower'],
    resourceBonus: { stone: 1.8, metal: 1.4 }
  },
  desert: {
    name: 'Desert',
    color: '#FF9800',
    icon: '🏜️',
    baseProductivity: 60,
    preferredBuildings: ['mine', 'factory'],
    resourceBonus: { energy: 1.3, metal: 1.2 }
  },
  water: {
    name: 'Water',
    color: '#03A9F4',
    icon: '🌊',
    baseProductivity: 85,
    preferredBuildings: ['portal', 'factory'],
    resourceBonus: { water: 2.0, food: 1.3 }
  },
  volcanic: {
    name: 'Volcanic',
    color: '#E91E63',
    icon: '🌋',
    baseProductivity: 95,
    preferredBuildings: ['factory', 'tower'],
    resourceBonus: { energy: 2.0, metal: 1.6 }
  }
};

// Building type configurations
export const BUILDING_CONFIG = {
  farm: {
    name: 'Farm',
    icon: '🚜',
    description: 'Produces food and generates tokens',
    baseOutput: { food: 10, tokens: 2 },
    baseCost: { wood: 5, stone: 2 },
    constructionTime: 30
  },
  mine: {
    name: 'Mine',
    icon: '⛏️',
    description: 'Extracts stone and metal from the earth',
    baseOutput: { stone: 8, metal: 4 },
    baseCost: { wood: 3, energy: 5 },
    constructionTime: 45
  },
  factory: {
    name: 'Factory',
    icon: '🏭',
    description: 'Processes resources and generates energy',
    baseOutput: { energy: 15, tokens: 3 },
    baseCost: { stone: 8, metal: 6 },
    constructionTime: 60
  },
  house: {
    name: 'House',
    icon: '🏠',
    description: 'Provides shelter and generates passive income',
    baseOutput: { tokens: 5 },
    baseCost: { wood: 10, stone: 5 },
    constructionTime: 20
  },
  tower: {
    name: 'Tower',
    icon: '🗼',
    description: 'Advanced structure with multiple benefits',
    baseOutput: { energy: 20, tokens: 8 },
    baseCost: { stone: 15, metal: 10, energy: 5 },
    constructionTime: 90
  },
  portal: {
    name: 'Portal',
    icon: '🌀',
    description: 'Mystical structure with rare resource generation',
    baseOutput: { tokens: 15, energy: 10 },
    baseCost: { metal: 20, energy: 15, water: 10 },
    constructionTime: 120
  }
};

// Resource type configurations
export const RESOURCE_CONFIG = {
  wood: { name: 'Wood', icon: '🪵', color: '#795548' },
  stone: { name: 'Stone', icon: '🪨', color: '#9E9E9E' },
  metal: { name: 'Metal', icon: '⚙️', color: '#607D8B' },
  energy: { name: 'Energy', icon: '⚡', color: '#FFC107' },
  water: { name: 'Water', icon: '💧', color: '#03A9F4' },
  food: { name: 'Food', icon: '🍎', color: '#4CAF50' },
  tokens: { name: 'Tokens', icon: '🪙', color: '#FF9800' }
};

// Mock data generators
export function generateMockLandPlots(count: number = 12): LandPlot[] {
  const terrains: Array<LandPlot['terrain']> = ['grassland', 'forest', 'mountain', 'desert', 'water', 'volcanic'];
  const rarities: Array<LandPlot['rarity']> = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

  return Array.from({ length: count }, (_, i) => ({
    id: `land-${i + 1}`,
    tokenId: i + 1,
    x: (i % 4) * 100,
    y: Math.floor(i / 4) * 100,
    terrain: terrains[Math.floor(Math.random() * terrains.length)],
    rarity: rarities[Math.floor(Math.random() * rarities.length)],
    size: Math.floor(Math.random() * 50) + 50,
    owner: 'ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA',
    buildings: [],
    resources: [],
    lastHarvested: new Date(Date.now() - Math.random() * 86400000),
    productivity: Math.floor(Math.random() * 40) + 60
  }));
}

export function generateMockBlueprints(count: number = 8): Blueprint[] {
  const buildingTypes: Array<Blueprint['buildingType']> = ['farm', 'mine', 'factory', 'house', 'tower', 'portal'];
  const rarities: Array<Blueprint['rarity']> = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

  return Array.from({ length: count }, (_, i) => {
    const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
    const config = BUILDING_CONFIG[buildingType];

    return {
      id: `blueprint-${i + 1}`,
      tokenId: i + 1,
      buildingType,
      rarity: rarities[Math.floor(Math.random() * rarities.length)],
      resourceConsumption: Object.entries(config.baseCost).map(([type, amount]) => ({
        type: type as any,
        amount
      })),
      output: Object.entries(config.baseOutput).map(([type, amount]) => ({
        type: type as any,
        amount,
        interval: 60
      })),
      constructionTime: config.constructionTime,
      maxLevel: 5,
      description: config.description,
      owner: 'ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA'
    };
  });
}

export function generateMockCommunityEvents(count: number = 6): CommunityEvent[] {
  const eventTypes: Array<CommunityEvent['type']> = ['building_contest', 'resource_challenge', 'exploration', 'pvp_tournament'];

  return Array.from({ length: count }, (_, i) => {
    const startDate = new Date(Date.now() + Math.random() * 604800000); // Next week
    const endDate = new Date(startDate.getTime() + Math.random() * 604800000); // Duration up to a week

    return {
      id: `event-${i + 1}`,
      title: `Community Event ${i + 1}`,
      description: `Exciting ${eventTypes[i % eventTypes.length].replace('_', ' ')} event with amazing rewards!`,
      type: eventTypes[i % eventTypes.length],
      startDate,
      endDate,
      participants: Math.floor(Math.random() * 100),
      maxParticipants: 150,
      entryFee: Math.floor(Math.random() * 5) + 1,
      rewards: [
        { position: 1, type: 'nft', amount: 1, description: 'Legendary Blueprint NFT' },
        { position: 2, type: 'tokens', amount: 1000, description: '1000 Platform Tokens' },
        { position: 3, type: 'blueprint', amount: 1, description: 'Epic Blueprint' }
      ],
      requirements: ['Own at least 1 land plot', 'Minimum level 5'],
      status: i < 2 ? 'active' : i < 4 ? 'upcoming' : 'completed'
    };
  });
}

export function generateMockMarketplaceListings(count: number = 15): MarketplaceListing[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `listing-${i + 1}`,
    type: i % 2 === 0 ? 'land' : 'blueprint',
    tokenId: i + 1,
    seller: `ST${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
    price: Math.floor(Math.random() * 100) + 10,
    currency: Math.random() > 0.7 ? 'TOKENS' : 'STX',
    listedAt: new Date(Date.now() - Math.random() * 86400000),
    expiresAt: new Date(Date.now() + Math.random() * 604800000),
    featured: Math.random() > 0.8
  }));
}

// Player inventory mock data
export const MOCK_PLAYER_INVENTORY = {
  resources: {
    wood: 150,
    stone: 89,
    metal: 45,
    energy: 120,
    water: 200,
    food: 75,
    tokens: 1250
  },
  landPlots: generateMockLandPlots(12),
  blueprints: generateMockBlueprints(8)
};

// Mock player profile
export const MOCK_PLAYER_PROFILE: PlayerProfile = {
  address: 'ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA',
  username: 'LandMaster',
  level: 15,
  experience: 12450,
  joinedAt: new Date('2024-01-15'),
  achievements: [
    {
      id: 'first-land',
      title: 'First Steps',
      description: 'Acquired your first land plot',
      icon: '🏞️',
      unlockedAt: new Date('2024-01-16'),
      rarity: 'common'
    },
    {
      id: 'master-builder',
      title: 'Master Builder',
      description: 'Constructed 10 buildings',
      icon: '🏗️',
      unlockedAt: new Date('2024-02-20'),
      rarity: 'rare'
    }
  ],
  stats: {
    landsOwned: 12,
    blueprintsOwned: 8,
    buildingsConstructed: 25,
    resourcesHarvested: 5420,
    tokensEarned: 8750,
    eventsParticipated: 7,
    marketplaceSales: 3
  }
};
