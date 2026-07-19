import { CardBase, PokemonBattleCard, OnePieceCard, MarketStats, CardTrend, Transaction, GradeType, KlinePoint, GradePriceData, PricePoint } from '../types';

const generatePriceHistory = (days: number = 30, basePrice: number): { date: string; price: number; volume: number }[] => {
  const data = [];
  let currentPrice = basePrice * (0.8 + Math.random() * 0.4);
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const fluctuation = (Math.random() - 0.5) * basePrice * 0.08;
    currentPrice = Math.max(currentPrice + fluctuation, basePrice * 0.5);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice * 100) / 100,
      volume: Math.floor(Math.random() * 500) + 50
    });
  }
  
  return data;
};

const generateTransactions = (cardId: string, cardName: string): Transaction[] => {
  const platforms = ['TCGPlayer', 'eBay', 'Mercari', '集换社', '卡淘'];
  const grades: GradeType[] = ['raw', 'psa9', 'psa10', 'bgs9', 'bgs10'];
  const transactions: Transaction[] = [];
  
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    transactions.push({
      id: `${cardId}-tx-${i}`,
      cardId,
      cardName,
      price: Math.floor(Math.random() * 5000) + 100,
      grade: grades[Math.floor(Math.random() * grades.length)],
      volume: Math.floor(Math.random() * 10) + 1,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      timestamp: date.toISOString().split('T')[0]
    });
  }
  
  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const generatePriceSources = (basePrice: number) => [
  { platform: 'TCGPlayer', price: basePrice * (0.95 + Math.random() * 0.1), currency: 'USD' },
  { platform: 'eBay', price: basePrice * (1.0 + Math.random() * 0.2), currency: 'USD' },
  { platform: 'Mercari', price: basePrice * (0.9 + Math.random() * 0.15), currency: 'JPY' },
  { platform: '集换社', price: basePrice * (1.0 + Math.random() * 0.1), currency: 'CNY' },
  { platform: '卡淘', price: basePrice * (0.98 + Math.random() * 0.12), currency: 'CNY' }
];

const generateKlineData = (basePrice: number) => {
  const daily: KlinePoint[] = [];
  let currentPrice = basePrice;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const open = currentPrice;
    const close = currentPrice * (0.98 + Math.random() * 0.04);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (0.98 - Math.random() * 0.02);
    const volume = Math.floor(Math.random() * 1000);
    
    daily.push({
      timestamp: date.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      close: Math.round(close * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      volume
    });
    
    currentPrice = close;
  }
  
  return { daily, weekly: daily, monthly: daily };
};

const generateGradePrices = (basePrice: number): Record<GradeType, GradePriceData> => {
  const grades: GradeType[] = ['raw', 'psa9', 'psa10', 'bgs9', 'bgs10'];
  const multipliers: Record<GradeType, number> = {
    raw: 1,
    psa9: 2.5,
    psa10: 5,
    bgs9: 3,
    bgs10: 8
  };
  
  const result: Record<GradeType, GradePriceData> = {} as Record<GradeType, GradePriceData>;
  
  grades.forEach(grade => {
    const price = basePrice * multipliers[grade];
    const change = (Math.random() - 0.5) * 20;
    
    const trend: PricePoint[] = [];
    let p = price * (1 - change / 100);
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trend.push({
        timestamp: date.toISOString().split('T')[0],
        price: Math.round(p * 100) / 100,
        volume: Math.floor(Math.random() * 500)
      });
      p *= (0.99 + Math.random() * 0.02);
    }
    
    result[grade] = {
      grade,
      current: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changeAmount: Math.round(price * change / 100 * 100) / 100,
      volume: Math.floor(Math.random() * 1000),
      trend
    };
  });
  
  return result;
};

export const ptcgCards: PokemonBattleCard[] = [
  {
    id: 'pikachu-vmax-001',
    name: '皮卡丘 VMAX',
    gameType: 'ptcg',
    series: '剑盾',
    set: '强化扩张包 厄鬼裸',
    rarity: 'RR',
    image: 'https://picsum.photos/id/1/300/400',
    grade: 'PSA10',
    lastUpdate: '2024-01-15 14:30',
    price: 12800,
    priceChange: 23.5,
    volume: 856,
    market: 'domestic',
    priceSources: generatePriceSources(12800),
    priceHistory: generatePriceHistory(30, 12800),
    recentTransactions: generateTransactions('pikachu-vmax-001', '皮卡丘 VMAX'),
    types: ['electric'],
    hp: 320,
    maxHp: 320,
    abilities: [{ name: '伏特吸收', description: '从弃牌区回收2张电能量卡到手牌', cost: [] }],
    attacks: [
      { name: '千伏特', description: '造成210点伤害，此宝可梦陷入麻痹状态', cost: ['electric', 'electric', 'colorless'], damage: 210 },
      { name: '羁绊爆发', description: '连续3回合使用后解锁，造成240点伤害', cost: ['electric', 'electric', 'electric'], damage: 240, requiresBond: true }
    ],
    weakness: { type: 'fighting', value: 'x2' },
    retreatCost: 2,
    isVMAX: true,
    bondLevel: 0
  },
  {
    id: 'charizard-vstar-002',
    name: '喷火龙 VSTAR',
    gameType: 'ptcg',
    series: '剑盾',
    set: 'VSTAR UR',
    rarity: 'UR',
    image: 'https://picsum.photos/id/237/300/400',
    grade: 'PSA10',
    lastUpdate: '2024-01-15 14:25',
    price: 2599,
    priceChange: -3.2,
    volume: 432,
    market: 'domestic',
    priceSources: generatePriceSources(2599),
    priceHistory: generatePriceHistory(30, 2599),
    recentTransactions: generateTransactions('charizard-vstar-002', '喷火龙 VSTAR'),
    types: ['fire'],
    hp: 280,
    maxHp: 280,
    abilities: [{ name: '火焰之力', description: '每有1张火能量卡，手牌上限+1', cost: [] }],
    attacks: [
      { name: '十字火焰', description: '造成160点伤害', cost: ['fire', 'fire', 'colorless'], damage: 160 },
      { name: 'VSTAR爆发', description: '造成320点伤害，对手弃掉2张手牌', cost: ['fire', 'fire', 'fire'], damage: 320 }
    ],
    weakness: { type: 'water', value: 'x2' },
    retreatCost: 3,
    isVSTAR: true
  },
  {
    id: 'greninja-003',
    name: '甲贺忍蛙',
    gameType: 'ptcg',
    series: 'XY',
    set: 'XY闪焰王牌',
    rarity: 'SSR',
    image: 'https://picsum.photos/id/659/300/400',
    grade: 'BGS9.5',
    lastUpdate: '2024-01-15 14:20',
    price: 899,
    priceChange: 8.7,
    volume: 1243,
    market: 'japan',
    priceSources: generatePriceSources(899),
    priceHistory: generatePriceHistory(30, 899),
    recentTransactions: generateTransactions('greninja-003', '甲贺忍蛙'),
    types: ['water', 'dark'],
    hp: 130,
    maxHp: 130,
    evolvesFrom: '呱头蛙',
    attacks: [
      { name: '水手里剑', description: '投掷3枚硬币，每正面造成30点伤害', cost: ['water'], damage: 30 },
      { name: '暗影突袭', description: '造成100点伤害，对手无法响应', cost: ['water', 'dark'], damage: 100 }
    ],
    weakness: { type: 'grass', value: 'x2' },
    retreatCost: 1
  },
  {
    id: 'mewtwo-v-004',
    name: '超梦 V',
    gameType: 'ptcg',
    series: '剑盾',
    set: 'VMAX',
    rarity: 'RR',
    image: 'https://picsum.photos/id/64/300/400',
    grade: 'PSA10',
    lastUpdate: '2024-01-15 14:15',
    price: 699,
    priceChange: 5.3,
    volume: 678,
    market: 'american',
    priceSources: generatePriceSources(699),
    priceHistory: generatePriceHistory(30, 699),
    recentTransactions: generateTransactions('mewtwo-v-004', '超梦 V'),
    types: ['psychic'],
    hp: 220,
    maxHp: 220,
    attacks: [
      { name: '精神冲击', description: '造成120点伤害', cost: ['psychic', 'colorless'], damage: 120 },
      { name: 'V破坏', description: '造成200点伤害', cost: ['psychic', 'psychic', 'colorless'], damage: 200 }
    ],
    weakness: { type: 'dark', value: 'x2' },
    retreatCost: 2,
    isV: true
  },
  {
    id: 'rayquaza-vmax-005',
    name: '烈空坐 VMAX',
    gameType: 'ptcg',
    series: '朱紫',
    set: '漆黑X',
    rarity: 'SAR',
    image: 'https://picsum.photos/id/177/300/400',
    grade: 'PSA9',
    lastUpdate: '2024-01-15 14:10',
    price: 1599,
    priceChange: -1.8,
    volume: 312,
    market: 'domestic',
    priceSources: generatePriceSources(1599),
    priceHistory: generatePriceHistory(30, 1599),
    recentTransactions: generateTransactions('rayquaza-vmax-005', '烈空坐 VMAX'),
    types: ['dragon'],
    hp: 330,
    maxHp: 330,
    attacks: [
      { name: '龙尾', description: '造成130点伤害，将对手备战区1只宝可梦返回手牌', cost: ['dragon', 'colorless'], damage: 130 },
      { name: '极限俯冲VMAX', description: '造成320点伤害', cost: ['dragon', 'dragon', 'dragon'], damage: 320 }
    ],
    weakness: { type: 'fairy', value: 'x2' },
    retreatCost: 3,
    isVMAX: true
  },
  {
    id: 'umbreon-vmax-006',
    name: '月伊布 VMAX',
    gameType: 'ptcg',
    series: '剑盾',
    set: 'VSTAR',
    rarity: 'RR',
    image: 'https://picsum.photos/id/338/300/400',
    grade: 'PSA10',
    lastUpdate: '2024-01-15 14:05',
    price: 1899,
    priceChange: 15.8,
    volume: 523,
    market: 'japan',
    priceSources: generatePriceSources(1899),
    priceHistory: generatePriceHistory(30, 1899),
    recentTransactions: generateTransactions('umbreon-vmax-006', '月伊布 VMAX'),
    types: ['dark'],
    hp: 320,
    maxHp: 320,
    attacks: [
      { name: '月光', description: '回复此宝可梦60点HP', cost: ['dark'], damage: 0 },
      { name: '暗影波动', description: '造成190点伤害', cost: ['dark', 'dark', 'colorless'], damage: 190 }
    ],
    weakness: { type: 'fighting', value: 'x2' },
    retreatCost: 2,
    isVMAX: true
  },
  {
    id: 'gardevoir-vmax-007',
    name: '沙奈朵 VMAX',
    gameType: 'ptcg',
    series: '剑盾',
    set: 'V',
    rarity: 'RR',
    image: 'https://picsum.photos/id/91/300/400',
    grade: 'PSA8',
    lastUpdate: '2024-01-15 14:00',
    price: 1099,
    priceChange: 6.2,
    volume: 892,
    market: 'american',
    priceSources: generatePriceSources(1099),
    priceHistory: generatePriceHistory(30, 1099),
    recentTransactions: generateTransactions('gardevoir-vmax-007', '沙奈朵 VMAX'),
    types: ['psychic', 'fairy'],
    hp: 330,
    maxHp: 330,
    attacks: [
      { name: '精神控制', description: '选择对手1只宝可梦，本回合不能攻击', cost: ['psychic'], damage: 0 },
      { name: '星光爆发', description: '造成250点伤害', cost: ['psychic', 'fairy', 'colorless'], damage: 250 }
    ],
    weakness: { type: 'poison', value: 'x2' },
    retreatCost: 2,
    isVMAX: true
  },
  {
    id: 'gengar-vmax-008',
    name: '耿鬼 VMAX',
    gameType: 'ptcg',
    series: '剑盾',
    set: 'VSTAR',
    rarity: 'RR',
    image: 'https://picsum.photos/id/1027/300/400',
    grade: 'PSA9',
    lastUpdate: '2024-01-15 13:55',
    price: 799,
    priceChange: -4.5,
    volume: 445,
    market: 'domestic',
    priceSources: generatePriceSources(799),
    priceHistory: generatePriceHistory(30, 799),
    recentTransactions: generateTransactions('gengar-vmax-008', '耿鬼 VMAX'),
    types: ['ghost', 'dark'],
    hp: 320,
    maxHp: 320,
    attacks: [
      { name: '暗影拳', description: '造成120点伤害', cost: ['ghost', 'colorless'], damage: 120 },
      { name: '恶梦VMAX', description: '造成280点伤害', cost: ['ghost', 'dark', 'colorless'], damage: 280 }
    ],
    weakness: { type: 'dark', value: 'x2' },
    retreatCost: 3,
    isVMAX: true
  }
];

export const opcgCards: OnePieceCard[] = [
  {
    id: 'luffy-gear5-001',
    name: '蒙奇·D·路飞',
    gameType: 'opcg',
    series: '觉醒的勇者',
    set: 'OP05',
    rarity: 'SEC',
    image: 'https://picsum.photos/id/10/300/400',
    grade: 'PSA10',
    lastUpdate: '2024-01-15 14:30',
    price: 298,
    priceChange: -15.2,
    volume: 2156,
    market: 'domestic',
    priceSources: generatePriceSources(298),
    priceHistory: generatePriceHistory(30, 298),
    recentTransactions: generateTransactions('luffy-gear5-001', '蒙奇·D·路飞'),
    cardType: 'character',
    cost: 6,
    power: 9000,
    counter: 1,
    color: 'red',
    effect: '战斗阶段：可以选择对手1张事件卡返回手牌',
    trigger: '攻击命中时',
    belongsTo: '草帽海贼团',
    bounty: 300000000
  },
  {
    id: 'zoro-wano-002',
    name: '罗罗诺亚·索隆',
    gameType: 'opcg',
    series: '和之国',
    set: 'OP02',
    rarity: 'SR',
    image: 'https://picsum.photos/id/20/300/400',
    grade: 'PSA9',
    lastUpdate: '2024-01-15 14:25',
    price: 168,
    priceChange: 8.5,
    volume: 892,
    market: 'japan',
    priceSources: generatePriceSources(168),
    priceHistory: generatePriceHistory(30, 168),
    recentTransactions: generateTransactions('zoro-wano-002', '罗罗诺亚·索隆'),
    cardType: 'character',
    cost: 5,
    power: 8000,
    counter: 1,
    color: 'green',
    effect: '攻击命中时：造成1点伤害',
    belongsTo: '草帽海贼团',
    bounty: 111000000
  },
  {
    id: 'sanji-wci-003',
    name: '山治',
    gameType: 'opcg',
    series: '蛋糕岛',
    set: 'OP03',
    rarity: 'R',
    image: 'https://picsum.photos/id/30/300/400',
    grade: 'raw',
    lastUpdate: '2024-01-15 14:20',
    price: 45,
    priceChange: 3.2,
    volume: 3421,
    market: 'domestic',
    priceSources: generatePriceSources(45),
    priceHistory: generatePriceHistory(30, 45),
    recentTransactions: generateTransactions('sanji-wci-003', '山治'),
    cardType: 'character',
    cost: 4,
    power: 6000,
    color: 'blue',
    belongsTo: '草帽海贼团',
    bounty: 103000000
  },
  {
    id: 'kaido-leader-004',
    name: '凯多',
    gameType: 'opcg',
    series: '四皇',
    set: 'OP04',
    rarity: 'L',
    image: 'https://picsum.photos/id/40/300/400',
    grade: 'PSA10',
    lastUpdate: '2024-01-15 14:15',
    price: 598,
    priceChange: 12.8,
    volume: 523,
    market: 'american',
    priceSources: generatePriceSources(598),
    priceHistory: generatePriceHistory(30, 598),
    recentTransactions: generateTransactions('kaido-leader-004', '凯多'),
    cardType: 'leader',
    cost: 0,
    power: 7000,
    color: 'purple',
    effect: '登场时：抽2张卡',
    belongsTo: '百兽海贼团',
    bounty: 461110000
  },
  {
    id: 'shanks-red-005',
    name: '香克斯',
    gameType: 'opcg',
    series: '新世界',
    set: 'OP01',
    rarity: 'SR',
    image: 'https://picsum.photos/id/50/300/400',
    grade: 'PSA9',
    lastUpdate: '2024-01-15 14:10',
    price: 328,
    priceChange: 5.6,
    volume: 678,
    market: 'japan',
    priceSources: generatePriceSources(328),
    priceHistory: generatePriceHistory(30, 328),
    recentTransactions: generateTransactions('shanks-red-005', '香克斯'),
    cardType: 'character',
    cost: 7,
    power: 10000,
    counter: 1,
    color: 'red',
    effect: '对手回合：可以丢弃1张手牌，取消对手1次攻击',
    belongsTo: '红发海贼团',
    bounty: 404890000
  },
  {
    id: 'ace-fire-006',
    name: '波特卡斯·D·艾斯',
    gameType: 'opcg',
    series: '顶上战争',
    set: 'OP02',
    rarity: 'SR',
    image: 'https://picsum.photos/id/60/300/400',
    grade: 'PSA10',
    lastUpdate: '2024-01-15 14:05',
    price: 258,
    priceChange: -2.3,
    volume: 445,
    market: 'domestic',
    priceSources: generatePriceSources(258),
    priceHistory: generatePriceHistory(30, 258),
    recentTransactions: generateTransactions('ace-fire-006', '波特卡斯·D·艾斯'),
    cardType: 'character',
    cost: 5,
    power: 7000,
    color: 'red',
    effect: '登场时：对对手生命区造成1点伤害',
    belongsTo: '白胡子海贼团',
    bounty: 55000000
  },
  {
    id: 'law-op05-007',
    name: '特拉法尔加·罗',
    gameType: 'opcg',
    series: '觉醒的勇者',
    set: 'OP05',
    rarity: 'R',
    image: 'https://picsum.photos/id/70/300/400',
    grade: 'raw',
    lastUpdate: '2024-01-15 14:00',
    price: 32,
    priceChange: 1.8,
    volume: 2134,
    market: 'domestic',
    priceSources: generatePriceSources(32),
    priceHistory: generatePriceHistory(30, 32),
    recentTransactions: generateTransactions('law-op05-007', '特拉法尔加·罗'),
    cardType: 'character',
    cost: 4,
    power: 5000,
    color: 'purple',
    belongsTo: '心脏海贼团',
    bounty: 300000000
  },
  {
    id: 'whitebeard-legend-008',
    name: '爱德华·纽盖特',
    gameType: 'opcg',
    series: '传奇',
    set: 'OP06',
    rarity: 'SEC',
    image: 'https://picsum.photos/id/80/300/400',
    grade: 'PSA10',
    lastUpdate: '2024-01-15 13:55',
    price: 1280,
    priceChange: 8.9,
    volume: 123,
    market: 'american',
    priceSources: generatePriceSources(1280),
    priceHistory: generatePriceHistory(30, 1280),
    recentTransactions: generateTransactions('whitebeard-legend-008', '爱德华·纽盖特'),
    cardType: 'character',
    cost: 8,
    power: 12000,
    counter: 2,
    color: 'yellow',
    effect: '攻击命中时：对对手生命区造成2点伤害',
    belongsTo: '白胡子海贼团',
    bounty: 504600000
  }
];

export const allCards: CardBase[] = [...ptcgCards, ...opcgCards];

export const generateTrendData = (cardId: string, days: number = 30): CardTrend => {
  const card = allCards.find(c => c.id === cardId);
  const basePrice = card?.price || 1000;
  const trend = Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable';
  const changePercent = trend === 'up' ? Math.random() * 20 : trend === 'down' ? -Math.random() * 15 : 0;
  
  const data: PricePoint[] = [];
  let currentPrice = basePrice * (1 - changePercent / 100);
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const fluctuation = (Math.random() - 0.5) * basePrice * 0.05;
    currentPrice = Math.max(currentPrice + fluctuation, 1);
    
    data.push({
      timestamp: date.toISOString().split('T')[0],
      price: Math.round(currentPrice * 100) / 100,
      volume: Math.floor(Math.random() * 1000) + 100
    });
  }
  
  return {
    cardId,
    cardName: card?.name || '',
    image: card?.image || '',
    data,
    trend,
    changePercent: Math.round(changePercent * 100) / 100
  };
};

export const marketStats: MarketStats = {
  totalVolume: 128956,
  totalValue: 45678900,
  avgPrice: 899,
  topGainer: ptcgCards[5],
  topLoser: opcgCards[0],
  hotCards: [...ptcgCards.slice(0, 3), ...opcgCards.slice(0, 2)]
};

export const volumeRankList = [...allCards].sort((a, b) => b.volume - a.volume);
export const priceRankList = [...allCards].sort((a, b) => b.price - a.price);
export const gainerRankList = [...allCards].sort((a, b) => b.priceChange - a.priceChange);

export const ptcgSeriesList = ['剑盾', '朱紫', 'XY', '黑白', '日月', '宝石', '初代'];
export const opcgSeriesList = ['觉醒的勇者', '和之国', '蛋糕岛', '四皇', '新世界', '顶上战争', '传奇'];

export const seriesList = [...ptcgSeriesList, ...opcgSeriesList];

export const marketList = [
  { key: 'all', label: '全部' },
  { key: 'domestic', label: '国现' },
  { key: 'japan', label: '日现' },
  { key: 'american', label: '美现' }
];

export const getCardById = (cardId: string): CardBase | null => {
  return allCards.find(card => card.id === cardId) || null;
};

export const getCardDetailEnhanced = (cardId: string) => {
  const card = getCardById(cardId);
  if (!card) return null;
  
  return {
    ...card,
    gradePrices: generateGradePrices(card.price),
    klineData: generateKlineData(card.price)
  };
};