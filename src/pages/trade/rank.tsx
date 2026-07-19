import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './rank.module.scss';
import { ptcgCards, opcgCards } from '@/data/cards';
import { CardGameType } from '@/types';

const RankPage = () => {
  const [gameType, setGameType] = useState<CardGameType | 'all'>('all');
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const allCards = [...ptcgCards, ...opcgCards];
  const filteredCards = gameType === 'all' 
    ? allCards 
    : gameType === 'ptcg' 
      ? ptcgCards 
      : opcgCards;

  const sortedCards = [...filteredCards].sort((a, b) => b.priceChange - a.priceChange);

  const handleCardClick = (cardId: string) => {
    Taro.navigateTo({ url: `/pages/trade/detail?id=${cardId}` });
  };

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>📈 价格排行榜</Text>
        <Text className={styles.subtitle}>Price Rank</Text>
      </View>

      <View className={styles.filterArea}>
        <View className={styles.gameTabs}>
          <Text 
            className={`${styles.tab} ${gameType === 'all' ? styles.active : ''}`}
            onClick={() => setGameType('all')}
          >全部</Text>
          <Text 
            className={`${styles.tab} ${gameType === 'ptcg' ? styles.active : ''}`}
            onClick={() => setGameType('ptcg')}
          >宝可梦</Text>
          <Text 
            className={`${styles.tab} ${gameType === 'opcg' ? styles.active : ''}`}
            onClick={() => setGameType('opcg')}
          >海贼王</Text>
        </View>
        
        <View className={styles.periodTabs}>
          <Text 
            className={`${styles.tab} ${period === 'week' ? styles.active : ''}`}
            onClick={() => setPeriod('week')}
          >近7天</Text>
          <Text 
            className={`${styles.tab} ${period === 'month' ? styles.active : ''}`}
            onClick={() => setPeriod('month')}
          >近30天</Text>
        </View>
      </View>

      <View className={styles.rankList}>
        {sortedCards.slice(0, 20).map((card, index) => (
          <View key={card.id} className={styles.rankItem} onClick={() => handleCardClick(card.id)}>
            <View className={`${styles.rankNumber} ${index < 3 ? styles.top : ''}`}>
              {index === 0 && '🥇'}
              {index === 1 && '🥈'}
              {index === 2 && '🥉'}
              {index > 2 && index + 1}
            </View>
            <Image className={styles.cardImage} src={card.image} mode='aspectFit' />
            <View className={styles.cardInfo}>
              <Text className={styles.cardName}>{card.name}</Text>
              <Text className={styles.cardMeta}>{card.series} · {card.rarity}</Text>
              <Text className={styles.cardPrice}>¥{card.price.toLocaleString()}</Text>
            </View>
            <View className={`${styles.change} ${card.priceChange >= 0 ? styles.up : styles.down}`}>
              <Text>{card.priceChange >= 0 ? '+' : ''}{card.priceChange}%</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default RankPage;