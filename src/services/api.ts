import { PokemonCard, CardTrend, MarketStats } from '@/types';
import { hotCards, generateTrendData, marketStats, volumeRankList, priceRankList, gainerRankList } from '@/data/cards';

/**
 * 获取热门卡牌列表（同步返回，无延迟）
 */
export const getHotCards = (): PokemonCard[] => {
  return hotCards;
};

/**
 * 获取卡牌详情（同步返回，无延迟）
 */
export const getCardDetail = (cardId: string): PokemonCard | null => {
  return hotCards.find(card => card.id === cardId) || null;
};

/**
 * 获取卡牌走势数据（同步返回，无延迟）
 */
export const getCardTrend = (cardId: string, days: number = 30): CardTrend | null => {
  return generateTrendData(cardId, days);
};

/**
 * 获取市场统计（同步返回，无延迟）
 */
export const getMarketStats = (): MarketStats => {
  return marketStats;
};

/**
 * 获取成交量排行榜（同步返回，无延迟）
 */
export const getVolumeRank = (): PokemonCard[] => {
  return volumeRankList;
};

/**
 * 获取价格排行榜（同步返回，无延迟）
 */
export const getPriceRank = (): PokemonCard[] => {
  return priceRankList;
};

/**
 * 获取涨幅排行榜（同步返回，无延迟）
 */
export const getGainerRank = (): PokemonCard[] => {
  return gainerRankList;
};

/**
 * 搜索卡牌（同步返回，无延迟）
 */
export const searchCards = (
  keyword: string,
  filters?: {
    series?: string;
    market?: string;
    priceRange?: [number, number];
  }
): PokemonCard[] => {
  let results = [...hotCards];
  
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    results = results.filter(card => 
      card.name.toLowerCase().includes(lowerKeyword) ||
      card.series.toLowerCase().includes(lowerKeyword) ||
      card.set.toLowerCase().includes(lowerKeyword)
    );
  }
  
  if (filters?.series) {
    results = results.filter(card => card.series === filters.series);
  }
  
  if (filters?.market && filters.market !== 'all') {
    results = results.filter(card => card.market === filters.market);
  }
  
  if (filters?.priceRange) {
    const [min, max] = filters.priceRange;
    results = results.filter(card => card.price >= min && card.price <= max);
  }
  
  return results;
};

/**
 * 格式化价格显示
 */
export const formatPrice = (price: number): string => {
  return `¥${price.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * 格式化成交量显示
 */
export const formatVolume = (volume: number): string => {
  if (volume >= 10000) {
    return `${(volume / 10000).toFixed(1)}万`;
  }
  return volume.toString();
};
