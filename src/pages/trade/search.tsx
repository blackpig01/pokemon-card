import React, { useState } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './search.module.scss';
import { ptcgCards, opcgCards, getCardById } from '@/data/cards';
import { CardGameType } from '@/types';

const SearchPage = () => {
  const [keyword, setKeyword] = useState('');
  const [gameType, setGameType] = useState<CardGameType | 'all'>('all');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    const allCards = [...ptcgCards, ...opcgCards];
    const filtered = allCards.filter(card => {
      const matchKeyword = keyword === '' || card.name.includes(keyword);
      const matchType = gameType === 'all' || card.gameType === gameType;
      return matchKeyword && matchType;
    });
    setResults(filtered);
  };

  const handleCardClick = (cardId: string) => {
    Taro.navigateTo({ url: `/pages/trade/detail?id=${cardId}` });
  };

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.searchBar}>
        <Input 
          className={styles.searchInput}
          placeholder="搜索卡牌名称..."
          value={keyword}
          onChange={(e) => setKeyword(e.detail.value)}
          onConfirm={handleSearch}
        />
        <View className={styles.searchBtn} onClick={handleSearch}>
          <Text>搜索</Text>
        </View>
      </View>

      <View className={styles.filterTabs}>
        <Text 
          className={`${styles.tab} ${gameType === 'all' ? styles.active : ''}`}
          onClick={() => { setGameType('all'); handleSearch(); }}
        >全部</Text>
        <Text 
          className={`${styles.tab} ${gameType === 'ptcg' ? styles.active : ''}`}
          onClick={() => { setGameType('ptcg'); handleSearch(); }}
        >宝可梦</Text>
        <Text 
          className={`${styles.tab} ${gameType === 'opcg' ? styles.active : ''}`}
          onClick={() => { setGameType('opcg'); handleSearch(); }}
        >海贼王</Text>
      </View>

      <View className={styles.results}>
        {results.length === 0 ? (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>🔍</Text>
            <Text className={styles.emptyText}>暂无搜索结果</Text>
            <Text className={styles.emptyHint}>请尝试其他关键词</Text>
          </View>
        ) : (
          <View className={styles.cardList}>
            {results.map(card => (
              <View key={card.id} className={styles.cardItem} onClick={() => handleCardClick(card.id)}>
                <Text className={styles.cardName}>{card.name}</Text>
                <Text className={styles.cardSeries}>{card.series} · {card.set}</Text>
                <Text className={styles.cardRarity}>{card.rarity}</Text>
                <Text className={`${styles.cardPrice} ${card.priceChange >= 0 ? styles.up : styles.down}`}>
                  ¥{card.price.toLocaleString()}
                  <Text className={styles.priceChange}>
                    {card.priceChange >= 0 ? '+' : ''}{card.priceChange}%
                  </Text>
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default SearchPage;