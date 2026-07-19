export type CardGameType = 'ptcg' | 'opcg';

export type PokemonType = 'fire' | 'water' | 'grass' | 'electric' | 'psychic' | 'dark' | 'fighting' | 'steel' | 'dragon' | 'fairy' | 'normal';

export type EnergyType = PokemonType | 'colorless';

export type OPCGType = 'character' | 'event' | 'stage' | 'leader';

export type WeatherType = 'sunny' | 'rainy' | 'sandstorm' | 'snowy';

export type BattlePhase = 'draw' | 'main' | 'attack' | 'end';

export type PlayerSide = 'player' | 'opponent';

export interface PriceSource {
  platform: string;
  price: number;
  currency: string;
  grade?: string;
  url?: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  volume: number;
}

export interface CardBase {
  id: string;
  name: string;
  gameType: CardGameType;
  series: string;
  set: string;
  rarity: string;
  image: string;
  grade: string;
  lastUpdate: string;
  price: number;
  priceChange: number;
  volume: number;
  market: 'domestic' | 'japan' | 'american';
  priceSources: PriceSource[];
  priceHistory: PriceHistoryPoint[];
  recentTransactions: Transaction[];
}

export interface PokemonBattleCard extends CardBase {
  gameType: 'ptcg';
  types: PokemonType[];
  hp: number;
  maxHp: number;
  evolvesFrom?: string;
  abilities: Ability[];
  attacks: Attack[];
  weakness?: { type: PokemonType; value: string };
  resistance?: { type: PokemonType; value: string };
  retreatCost: number;
  isV?: boolean;
  isGX?: boolean;
  isVMAX?: boolean;
  isVSTAR?: boolean;
  bondLevel?: number;
}

export interface Ability {
  name: string;
  description: string;
  cost: EnergyType[];
}

export interface Attack {
  name: string;
  description: string;
  cost: EnergyType[];
  damage: number;
  requiresBond?: boolean;
}

export interface OnePieceCard extends CardBase {
  gameType: 'opcg';
  cardType: OPCGType;
  cost: number;
  power?: number;
  counter?: number;
  color: 'red' | 'blue' | 'yellow' | 'green' | 'purple';
  effect?: string;
  trigger?: string;
  belongsTo?: string;
  bounty?: number;
}

export interface Deck {
  id: string;
  name: string;
  gameType: CardGameType;
  cards: { cardId: string; count: number }[];
  totalCards: number;
  createdAt: string;
  updatedAt: string;
}

export interface FieldPokemon {
  card: PokemonBattleCard;
  position: 'active' | 'bench';
  benchIndex?: number;
  damage: number;
  energy: EnergyType[];
  status?: 'asleep' | 'paralyzed' | 'poisoned' | 'burned' | 'confused';
}

export interface BattleState {
  id: string;
  phase: BattlePhase;
  turn: number;
  currentPlayer: PlayerSide;
  weather: WeatherType | null;
  playerDeck: PokemonBattleCard[];
  playerHand: PokemonBattleCard[];
  playerActive: FieldPokemon | null;
  playerBench: FieldPokemon[];
  playerPrizeCards: PokemonBattleCard[];
  playerDiscard: PokemonBattleCard[];
  playerEnergy: EnergyType[];
  opponentDeck: PokemonBattleCard[];
  opponentHand: PokemonBattleCard[];
  opponentActive: FieldPokemon | null;
  opponentBench: FieldPokemon[];
  opponentPrizeCards: PokemonBattleCard[];
  opponentDiscard: PokemonBattleCard[];
  opponentEnergy: EnergyType[];
  playerBondCounter: number;
  playerLastAttackerId?: string;
  winner: PlayerSide | null;
  gameLog: BattleLog[];
}

export interface BattleLog {
  turn: number;
  player: PlayerSide;
  action: string;
  timestamp: string;
}

export interface Bounty {
  id: string;
  targetType: string;
  targetCost?: number;
  reward: {
    drawCards: number;
    costBonus: number;
    hasHaki: boolean;
  };
  completed: boolean;
  completedBy?: PlayerSide;
}

export interface OPCGBattleState {
  id: string;
  turn: number;
  currentPlayer: PlayerSide;
  playerLeader: OnePieceCard | null;
  playerLife: number;
  playerMaxLife: number;
  playerHand: OnePieceCard[];
  playerDeck: OnePieceCard[];
  playerDiscard: OnePieceCard[];
  playerField: OnePieceCard[];
  playerEnergy: number;
  playerBounty: Bounty | null;
  playerHaki: boolean;
  opponentLeader: OnePieceCard | null;
  opponentLife: number;
  opponentMaxLife: number;
  opponentHand: OnePieceCard[];
  opponentDeck: OnePieceCard[];
  opponentDiscard: OnePieceCard[];
  opponentField: OnePieceCard[];
  opponentEnergy: number;
  opponentBounty: Bounty | null;
  opponentHaki: boolean;
  winner: PlayerSide | null;
}

export interface Transaction {
  id: string;
  cardId: string;
  cardName: string;
  price: number;
  grade: GradeType;
  volume: number;
  platform: string;
  seller?: string;
  buyer?: string;
  timestamp: string;
}

export interface KlinePoint {
  timestamp: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  avg?: number;
}

export interface GradePriceData {
  grade: GradeType;
  current: number;
  change: number;
  changeAmount: number;
  volume: number;
  trend: PricePoint[];
}

export type GradeType = 'raw' | 'psa9' | 'psa10' | 'bgs9' | 'bgs10';

export interface GradeInfo {
  key: GradeType;
  label: string;
  color: string;
  description: string;
}

export interface PricePoint {
  timestamp: string;
  price: number;
  volume: number;
}

export interface CardTrend {
  cardId: string;
  cardName: string;
  image: string;
  data: PricePoint[];
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface CardDetailEnhanced extends CardBase {
  gradePrices: Record<GradeType, GradePriceData>;
  klineData: {
    daily: KlinePoint[];
    weekly: KlinePoint[];
    monthly: KlinePoint[];
  };
}

export interface RankItem {
  rank: number;
  card: CardBase;
  change: number;
}

export type RankPeriod = 'day' | 'week' | 'month';

export interface SearchFilters {
  keyword: string;
  gameType: CardGameType | 'all';
  series: string[];
  market: string;
  priceRange: [number, number];
  sortBy: 'price' | 'volume' | 'change';
  sortOrder: 'asc' | 'desc';
}

export interface UserFavoriteItem {
  cardId: string;
  cardName: string;
  cardImage: string;
  gameType: CardGameType;
  currentPrice: number;
  targetBuyPrice?: number;
  targetSellPrice?: number;
  priceChange: number;
  addedAt: string;
  alertEnabled: boolean;
}

export interface PriceAlert {
  id: string;
  userId: string;
  cardId: string;
  cardName: string;
  cardImage: string;
  alertType: 'buy' | 'sell';
  targetPrice: number;
  currentPrice: number;
  triggered: boolean;
  triggeredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketStats {
  totalVolume: number;
  totalValue: number;
  avgPrice: number;
  topGainer: CardBase;
  topLoser: CardBase;
  hotCards: CardBase[];
}

export interface UserCollection {
  totalValue: number;
  totalCards: number;
  ptcgCards: number;
  ptcgValue: number;
  opcgCards: number;
  opcgValue: number;
  rarityDistribution: Record<string, number>;
}

export const GRADE_LIST: GradeInfo[] = [
  { key: 'raw', label: '裸卡', color: '#86909C', description: '未评级卡牌' },
  { key: 'psa9', label: 'PSA 9', color: '#165DFF', description: 'PSA评级9分' },
  { key: 'psa10', label: 'PSA 10', color: '#00B42A', description: 'PSA评级满分' },
  { key: 'bgs9', label: 'BGS 9', color: '#FF7D00', description: 'BGS评级9分' },
  { key: 'bgs10', label: 'BGS 10黑标', color: '#F53F3F', description: 'BGS黑标满分' }
];

export const WEATHER_EFFECTS: Record<WeatherType, { name: string; bonus: PokemonType[]; penalty: PokemonType[] }> = {
  sunny: { name: '晴天', bonus: ['fire', 'grass'], penalty: ['water'] },
  rainy: { name: '雨天', bonus: ['water'], penalty: ['fire', 'electric'] },
  sandstorm: { name: '沙暴', bonus: ['rock', 'ground', 'steel'], penalty: ['grass', 'water', 'flying'] },
  snowy: { name: '雪天', bonus: ['ice'], penalty: ['fire', 'flying'] }
};

export const MARKET_LIST = [
  { key: 'all', label: '全部' },
  { key: 'domestic', label: '国现' },
  { key: 'japan', label: '日现' },
  { key: 'american', label: '美现' }
];

export const PLATFORMS = ['TCGPlayer', 'eBay', 'Mercari', '集换社', '卡淘'];