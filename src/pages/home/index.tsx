import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { PokemonCard, MarketStats } from '@/types';
import { getHotCards, getMarketStats, formatPrice, formatVolume } from '@/services/api';

const HomePage = () => {
  const [hotCards, setHotCards] = useState<PokemonCard[]>([]);
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setLoading(true);
      // 同步获取数据，无延迟
      const cards = getHotCards();
      const stats = getMarketStats();
      setHotCards(cards);
      setMarketStats(stats);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (cardId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${cardId}`
    });
  };

  const handleQuickAction = (type: string) => {
    if (type === 'rank') {
      Taro.switchTab({ url: '/pages/rank/index' });
    } else if (type === 'search') {
      Taro.switchTab({ url: '/pages/search/index' });
    }
  };

  return (
    <ScrollView 
      className={styles.container}
      scrollY
      enableBackToTop
      onScrollToLower={() => {}}
    >
      {/* 头部区域 */}
      <View className={styles.header}>
        <Text className={styles.title}>宝可梦卡牌追踪</Text>
        
        {/* 统计数据 */}
        {marketStats && (
          <View className={styles.stats}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{formatVolume(marketStats.totalVolume)}</Text>
              <Text className={styles.statLabel}>总成交量</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{formatPrice(marketStats.totalValue)}</Text>
              <Text className={styles.statLabel}>总成交额</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{formatPrice(marketStats.avgPrice)}</Text>
              <Text className={styles.statLabel}>均价</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>实时</Text>
              <Text className={styles.statLabel}>更新于 14:30</Text>
            </View>
          </View>
        )}
      </View>

      {/* 快捷入口 */}
      <View className={styles.quickActions}>
        <View className={styles.actionItem} onClick={() => handleQuickAction('rank')}>
          <Text className={styles.actionIcon}>🏆</Text>
          <Text className={styles.actionText}>排行榜</Text>
        </View>
        <View className={styles.actionItem} onClick={() => handleQuickAction('search')}>
          <Text className={styles.actionIcon}>🔍</Text>
          <Text className={styles.actionText}>搜索卡牌</Text>
        </View>
        <View className={styles.actionItem}>
          <Text className={styles.actionIcon}>📊</Text>
          <Text className={styles.actionText}>走势分析</Text>
        </View>
        <View className={styles.actionItem}>
          <Text className={styles.actionIcon}>⭐</Text>
          <Text className={styles.actionText}>我的收藏</Text>
        </View>
      </View>

      {/* 热门卡牌 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>热门卡牌</Text>
          <View className={styles.moreBtn}>查看全部</View>
        </View>
        
        <View className={styles.hotCards}>
          {hotCards.map(card => (
            <View 
              key={card.id} 
              className={styles.hotCardItem}
              onClick={() => handleCardClick(card.id)}
            >
              <Image 
                className={styles.cardImage}
                src={card.image}
                mode='aspectFill'
              />
              <View className={styles.cardInfo}>
                <Text className={styles.cardName}>{card.name}</Text>
                <Text className={styles.cardSeries}>{card.series} · {card.set}</Text>
                <View className={styles.cardPrice}>
                  <Text className={styles.price}>{formatPrice(card.price)}</Text>
                  <Text className={`${styles.change} ${card.priceChange >= 0 ? styles.up : styles.down}`}>
                    {card.priceChange >= 0 ? '↑' : '↓'} {Math.abs(card.priceChange).toFixed(1)}%
                  </Text>
                </View>
                <Text className={styles.cardVolume}>成交量: {formatVolume(card.volume)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 涨幅榜 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>涨幅榜 TOP5</Text>
          <View className={styles.moreBtn}>查看更多</View>
        </View>
        
        <View className={styles.gainerList}>
          {marketStats?.hotCards.slice(0, 5).map((card, index) => (
            <View key={card.id} className={styles.gainerItem}>
              <Text className={`${styles.rank} ${index < 3 ? styles.top : ''}`}>{index + 1}</Text>
              <Image className={styles.gainerImage} src={card.image} mode='aspectFill' />
              <View className={styles.gainerInfo}>
                <Text className={styles.gainerName}>{card.name}</Text>
                <Text className={styles.gainerSeries}>{card.series}</Text>
              </View>
              <View className={styles.gainerPrice}>
                <Text className={styles.price}>{formatPrice(card.price)}</Text>
                <Text className={`${styles.change} ${card.priceChange >= 0 ? styles.up : styles.down}`}>
                  {card.priceChange >= 0 ? '↑' : '↓'} {Math.abs(card.priceChange).toFixed(1)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 跌幅提醒 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>跌幅提醒</Text>
        </View>
        
        <View className={styles.gainerList}>
          {hotCards.filter(card => card.priceChange < 0).slice(0, 3).map((card, index) => (
            <View key={card.id} className={styles.gainerItem}>
              <Text className={styles.rank}>{index + 1}</Text>
              <Image className={styles.gainerImage} src={card.image} mode='aspectFill' />
              <View className={styles.gainerInfo}>
                <Text className={styles.gainerName}>{card.name}</Text>
                <Text className={styles.gainerSeries}>{card.series}</Text>
              </View>
              <View className={styles.gainerPrice}>
                <Text className={styles.price}>{formatPrice(card.price)}</Text>
                <Text className={`${styles.change} ${card.priceChange >= 0 ? styles.up : styles.down}`}>
                  {card.priceChange >= 0 ? '↑' : '↓'} {Math.abs(card.priceChange).toFixed(1)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;
