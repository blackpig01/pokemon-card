import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const Index: React.FC = () => {
  const handleGameCardClick = (path: string) => {
    Taro.switchTab({ url: path }).catch(() => {
      Taro.navigateTo({ url: path });
    });
  };

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <input type="text" placeholder="搜索卡牌、系列、玩家..." />
          <Text className={styles.searchIcon}>📷</Text>
        </View>
        <View className={styles.banner}>
          <Text className={styles.bannerTitle}>🏆 双海大乱斗赛季开启</Text>
          <Text className={styles.bannerDesc}>宝可梦 vs 海贼王，跨IP巅峰对决！</Text>
        </View>
      </View>

      <Text className={styles.sectionTitle}>⚔️ 对战区</Text>
      <View className={styles.gameGrid}>
        <View className={styles.gameCard} style={{ background: 'linear-gradient(135deg, #ff6b35, #ff8c42)' }} onClick={() => handleGameCardClick('/pages/battle/index')}>
          <Text className={styles.icon}>🔥</Text>
          <Text className={styles.name}>宝可梦 PTCG</Text>
          <Text className={styles.sub}>标准/羁绊/天气</Text>
        </View>
        <View className={styles.gameCard} style={{ background: 'linear-gradient(135deg, #c41e3a, #e63946)' }} onClick={() => handleGameCardClick('/pages/battle/index')}>
          <Text className={styles.icon}>🏴‍☠️</Text>
          <Text className={styles.name}>海贼王 OPCG</Text>
          <Text className={styles.sub}>标准/悬赏/四皇</Text>
        </View>
      </View>

      <Text className={styles.sectionTitle}>💰 交易区</Text>
      <View className={styles.gameGrid}>
        <View className={styles.gameCard} style={{ background: 'linear-gradient(135deg, #2979ff, #5393ff)' }} onClick={() => handleGameCardClick('/pages/trade/index')}>
          <Text className={styles.icon}>📈</Text>
          <Text className={styles.name}>热门卡牌</Text>
          <Text className={styles.sub}>价格趋势</Text>
        </View>
        <View className={styles.gameCard} style={{ background: 'linear-gradient(135deg, #00c853, #69f0ae)' }} onClick={() => handleGameCardClick('/pages/trade/index')}>
          <Text className={styles.icon}>🆕</Text>
          <Text className={styles.name}>最新上架</Text>
          <Text className={styles.sub}>新品上市</Text>
        </View>
      </View>

      <Text className={styles.sectionTitle}>🔥 热门对战卡组</Text>
      <View className={styles.cardListItem}>
        <View className={styles.cardRow}>
          <View className={styles.cardImg} style={{ background: 'linear-gradient(135deg,#ffd700,#ff8c00)' }}>🔥</View>
          <View className={styles.cardInfo}>
            <Text className={styles.cardName}>喷火龙VMAX卡组</Text>
            <Text className={styles.cardMeta}>PTCG · 火属性 · 60张</Text>
          </View>
          <View className={styles.cardPrice}>
            <Text className={`${styles.priceTrend} ${styles.trendUp}`}>胜率 65%</Text>
          </View>
        </View>
      </View>
      <View className={styles.cardListItem}>
        <View className={styles.cardRow}>
          <View className={styles.cardImg} style={{ background: 'linear-gradient(135deg,#c41e3a,#e63946)' }}>🏴‍☠️</View>
          <View className={styles.cardInfo}>
            <Text className={styles.cardName}>五档路飞卡组</Text>
            <Text className={styles.cardMeta}>OPCG · 草帽团 · 50张</Text>
          </View>
          <View className={styles.cardPrice}>
            <Text className={`${styles.priceTrend} ${styles.trendUp}`}>胜率 58%</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Index;