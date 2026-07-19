import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface CardItem {
  id: string;
  name: string;
  meta: string;
  price: string;
  trend: 'up' | 'down' | 'flat';
  trendValue: string;
  icon: string;
  bgColor: string;
  platforms: { name: string; price: string }[];
}

const TradePage = () => {
  const [activeTab, setActiveTab] = useState<'hot' | 'trend' | 'new'>('hot');
  const [activeFilter, setActiveFilter] = useState('全部');

  const tabs = [
    { key: 'hot', label: '🔥热门飙升' },
    { key: 'trend', label: '📈价格趋势' },
    { key: 'new', label: '⭐新品上市' }
  ];

  const filters = ['全部', '宝可梦', '海贼王', 'PSA评级', '异画', 'SEC'];

  const cards: CardItem[] = [
    {
      id: '1',
      name: '喷火龙VMAX',
      meta: 'SWSH050 · PSA10 · 英文版',
      price: '¥12,800',
      trend: 'up',
      trendValue: '↑23%',
      icon: '🔥',
      bgColor: 'linear-gradient(135deg,#ffd700,#ff8c00)',
      platforms: [
        { name: 'TCGPlayer', price: '$180' },
        { name: 'eBay', price: '$195' },
        { name: '集换社', price: '¥1,280' }
      ]
    },
    {
      id: '2',
      name: '五档路飞异画 SEC',
      meta: 'OP08 · SEC · 日文版',
      price: '¥298',
      trend: 'down',
      trendValue: '↓15%',
      icon: '🏴‍☠️',
      bgColor: 'linear-gradient(135deg,#c41e3a,#e63946)',
      platforms: [
        { name: 'TCGPlayer', price: '$42' },
        { name: '煤炉', price: '¥3,200' }
      ]
    },
    {
      id: '3',
      name: '皮卡丘 25周年',
      meta: 'S8a · SR · 日文版',
      price: '¥1,580',
      trend: 'flat',
      trendValue: '→持平',
      icon: '⚡',
      bgColor: 'linear-gradient(135deg,#ffd700,#ffeb3b)',
      platforms: [
        { name: 'PSA10', price: '¥5,480,000' },
        { name: 'eBay', price: '$220' }
      ]
    },
    {
      id: '4',
      name: '索隆 异画',
      meta: 'OP06 · SEC · 日文版',
      price: '¥458',
      trend: 'up',
      trendValue: '↑8%',
      icon: '⚔️',
      bgColor: 'linear-gradient(135deg,#4a148c,#7b1fa2)',
      platforms: [
        { name: 'TCGPlayer', price: '$68' },
        { name: '集换社', price: '¥420' }
      ]
    },
    {
      id: '5',
      name: '超梦 VSTAR',
      meta: 'S12a · VSTAR · 日文版',
      price: '¥890',
      trend: 'down',
      trendValue: '↓5%',
      icon: '👽',
      bgColor: 'linear-gradient(135deg,#9c27b0,#ce93d8)',
      platforms: [
        { name: 'eBay', price: '$130' },
        { name: '卡淘', price: '¥850' }
      ]
    }
  ];

  const handleCardClick = (cardId: string) => {
    Taro.navigateTo({ url: `/pages/trade/detail?id=${cardId}` });
  };

  const getTrendStyle = (trend: string) => {
    if (trend === 'up') return styles.trendUp;
    if (trend === 'down') return styles.trendDown;
    return styles.trendFlat;
  };

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.tradeHeader}>
        <View className={styles.searchBar}>
          <Text style={{ color: '#999' }}>🔍</Text>
          <input type="text" placeholder="搜索卡牌..." />
          <Text style={{ color: '#999' }}>⚙️</Text>
        </View>
        <View className={styles.tradeTabs}>
          {tabs.map(tab => (
            <Text
              key={tab.key}
              className={`${styles.tradeTab} ${activeTab === tab.key ? styles.tradeTabActive : ''}`}
              onClick={() => setActiveTab(tab.key as 'hot' | 'trend' | 'new')}
            >
              {tab.label}
            </Text>
          ))}
        </View>
      </View>

      <View className={styles.filterBar}>
        {filters.map(filter => (
          <Text
            key={filter}
            className={`${styles.filterChip} ${activeFilter === filter ? styles.filterChipActive : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Text>
        ))}
      </View>

      {cards.map(card => (
        <View key={card.id} className={styles.cardListItem} onClick={() => handleCardClick(card.id)}>
          <View className={styles.cardRow}>
            <View className={styles.cardImg} style={{ background: card.bgColor }}>{card.icon}</View>
            <View className={styles.cardInfo}>
              <Text className={styles.cardName}>{card.name}</Text>
              <Text className={styles.cardMeta}>{card.meta}</Text>
            </View>
            <View className={styles.cardPrice}>
              <Text className={styles.priceMain}>{card.price}</Text>
              <Text className={`${styles.priceTrend} ${getTrendStyle(card.trend)}`}>
                {card.trendValue}
              </Text>
            </View>
          </View>
          <View className={styles.platformTags}>
            {card.platforms.map((platform, idx) => (
              <Text key={idx} className={styles.platformTag}>
                {platform.name} {platform.price}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default TradePage;