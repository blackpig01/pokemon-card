import { 
  PokemonCard, 
  KlinePoint, 
  GradePriceData, 
  GradeType,
  CardDetailEnhanced,
  Transaction,
  PriceAlert,
  UserFavoriteItem,
  PricePoint
} from '../types';
import { hotCards, marketStats } from './cards';

/**
 * 生成K线数据
 */
export const generateKlineData = (basePrice: number, days: number): KlinePoint[] => {
  const data: KlinePoint[] = [];
  const now = new Date();
  let currentPrice = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // 模拟价格波动
    const volatility = basePrice * 0.08;
    const open = currentPrice;
    const change = (Math.random() - 0.5) * volatility;
    const close = Math.max(open + change, basePrice * 0.5);
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    currentPrice = close;
    
    data.push({
      timestamp: date.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      close: Math.round(close * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      volume: Math.floor(Math.random() * 500) + 50,
      avg: Math.round((high + low) / 2 * 100) / 100
    });
  }
  
  return data;
};

/**
 * 生成评级价差数据
 */
export const generateGradePrices = (basePrice: number): Record<GradeType, GradePriceData> => {
  // 评级价差系数（PSA10通常是裸卡的2-5倍）
  const gradeMultipliers: Record<GradeType, number> = {
    raw: 1,
    psa9: 1.5,
    psa10: 3,
    bgs9: 1.6,
    bgs10: 4
  };
  
  const grades: GradeType[] = ['raw', 'psa9', 'psa10', 'bgs9', 'bgs10'];
  const result: Record<GradeType, GradePriceData> = {} as any;
  
  grades.forEach(grade => {
    const price = basePrice * gradeMultipliers[grade];
    const trend: PricePoint[] = [];
    
    // 生成30天走势
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trend.push({
        timestamp: date.toISOString().split('T')[0],
        price: Math.round(price * (1 + (Math.random() - 0.5) * 0.1) * 100) / 100,
        volume: Math.floor(Math.random() * 100)
      });
    }
    
    result[grade] = {
      grade,
      current: Math.round(price * 100) / 100,
      change: Math.round((Math.random() - 0.3) * 20 * 100) / 100,
      changeAmount: Math.round(price * (Math.random() - 0.3) * 0.2 * 100) / 100,
      volume: Math.floor(Math.random() * 200) + 20,
      trend
    };
  });
  
  return result;
};

/**
 * 生成历史成交记录
 */
export const generateTransactions = (cardId: string, cardName: string): Transaction[] => {
  const platforms = ['集换社', 'eBay', 'LA拍卖', 'Goldin', '日本Yahoo'];
  const grades: GradeType[] = ['raw', 'psa9', 'psa10', 'bgs9', 'bgs10'];
  const gradeMultipliers: Record<GradeType, number> = {
    raw: 1,
    psa9: 1.5,
    psa10: 3,
    bgs9: 1.6,
    bgs10: 4
  };
  const transactions: Transaction[] = [];
  
  const basePrice = hotCards.find(c => c.id === cardId)?.price || 1000;
  
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    
    const grade = grades[Math.floor(Math.random() * grades.length)];
    const gradePrice = basePrice * gradeMultipliers[grade];
    
    transactions.push({
      id: `tx-${cardId}-${i}`,
      cardId,
      cardName,
      price: Math.round(gradePrice * (0.9 + Math.random() * 0.2) * 100) / 100,
      grade,
      volume: Math.floor(Math.random() * 3) + 1,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      seller: `卖家${Math.floor(Math.random() * 1000)}`,
      buyer: `买家${Math.floor(Math.random() * 1000)}`,
      timestamp: date.toISOString().replace('T', ' ').slice(0, 16)
    });
  }
  
  return transactions;
};

/**
 * 获取卡牌增强详情
 */
export const getCardDetailEnhanced = async (cardId: string): Promise<CardDetailEnhanced | null> => {
  const card = hotCards.find(c => c.id === cardId);
  if (!card) return null;
  
  return {
    ...card,
    gradePrices: generateGradePrices(card.price),
    klineData: {
      daily: generateKlineData(card.price, 30),
      weekly: generateKlineData(card.price, 12),
      monthly: generateKlineData(card.price, 6)
    },
    recentTransactions: generateTransactions(card.id, card.name)
  };
};

/**
 * 模拟用户自选清单
 */
export const mockFavorites: UserFavoriteItem[] = [
  {
    cardId: 'pikachu-vmax-001',
    cardName: '皮卡丘 VMAX',
    cardImage: 'https://picsum.photos/id/1/300/400',
    currentPrice: 1299,
    targetBuyPrice: 1200,
    targetSellPrice: 1500,
    priceChange: 12.5,
    addedAt: '2024-01-10 10:00',
    alertEnabled: true
  },
  {
    cardId: 'charizard-vstar-002',
    cardName: '喷火龙 VSTAR',
    cardImage: 'https://picsum.photos/id/237/300/400',
    currentPrice: 2599,
    targetBuyPrice: 2400,
    priceChange: -3.2,
    addedAt: '2024-01-08 15:30',
    alertEnabled: true
  },
  {
    cardId: 'umbreon-006',
    cardName: '月伊布 VMAX',
    cardImage: 'https://picsum.photos/id/338/300/400',
    currentPrice: 1899,
    targetSellPrice: 2200,
    priceChange: 15.8,
    addedAt: '2024-01-05 09:20',
    alertEnabled: false
  }
];

/**
 * 模拟价格预警列表
 */
export const mockAlerts: PriceAlert[] = [
  {
    id: 'alert-001',
    userId: 'user-001',
    cardId: 'pikachu-vmax-001',
    cardName: '皮卡丘 VMAX',
    cardImage: 'https://picsum.photos/id/1/300/400',
    alertType: 'buy',
    targetPrice: 1200,
    currentPrice: 1299,
    triggered: false,
    createdAt: '2024-01-10 10:00',
    updatedAt: '2024-01-15 14:30'
  },
  {
    id: 'alert-002',
    userId: 'user-001',
    cardId: 'charizard-vstar-002',
    cardName: '喷火龙 VSTAR',
    cardImage: 'https://picsum.photos/id/237/300/400',
    alertType: 'sell',
    targetPrice: 2800,
    currentPrice: 2599,
    triggered: false,
    createdAt: '2024-01-08 15:30',
    updatedAt: '2024-01-15 14:30'
  },
  {
    id: 'alert-003',
    userId: 'user-001',
    cardId: 'greninja-003',
    cardName: '甲贺忍蛙',
    cardImage: 'https://picsum.photos/id/659/300/400',
    alertType: 'buy',
    targetPrice: 850,
    currentPrice: 899,
    triggered: true,
    triggeredAt: '2024-01-12 16:45',
    createdAt: '2024-01-05 09:00',
    updatedAt: '2024-01-12 16:45'
  }
];

/**
 * 获取用户自选清单
 */
export const getUserFavorites = async (): Promise<UserFavoriteItem[]> => {
  return mockFavorites;
};

/**
 * 添加到自选
 */
export const addToFavorites = async (item: UserFavoriteItem): Promise<boolean> => {
  mockFavorites.push(item);
  return true;
};

/**
 * 从自选移除
 */
export const removeFromFavorites = async (cardId: string): Promise<boolean> => {
  const index = mockFavorites.findIndex(f => f.cardId === cardId);
  if (index > -1) {
    mockFavorites.splice(index, 1);
  }
  return true;
};

/**
 * 获取价格预警列表
 */
export const getPriceAlerts = async (): Promise<PriceAlert[]> => {
  return mockAlerts;
};

/**
 * 创建价格预警
 */
export const createPriceAlert = async (alert: Omit<PriceAlert, 'id' | 'triggered' | 'createdAt' | 'updatedAt'>): Promise<PriceAlert> => {
  const newAlert: PriceAlert = {
    ...alert,
    id: `alert-${Date.now()}`,
    triggered: false,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  };
  mockAlerts.push(newAlert);
  return newAlert;
};

/**
 * 删除价格预警
 */
export const deletePriceAlert = async (alertId: string): Promise<boolean> => {
  const index = mockAlerts.findIndex(a => a.id === alertId);
  if (index > -1) {
    mockAlerts.splice(index, 1);
  }
  return true;
};