import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './detail.module.scss';

const TradeDetailPage = () => {
  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleAlert = () => {
    Taro.showToast({ title: '已设置价格提醒', icon: 'success' });
  };

  const handleSell = () => {
    Taro.showToast({ title: '出售功能开发中', icon: 'none' });
  };

  const priceSources = [
    { name: 'TCGPlayer', price: '$180.50' },
    { name: 'eBay', price: '$195.00' },
    { name: '集换社', price: '¥1,280' },
    { name: '卡淘', price: '¥1,350 (拍卖中)' }
  ];

  const transactions = [
    { date: '07-15', platform: 'TCGPlayer', price: '$182.00', condition: 'PSA10' },
    { date: '07-14', platform: 'eBay', price: '$195.50', condition: 'PSA10' },
    { date: '07-12', platform: '集换社', price: '¥1,250', condition: '未评级' },
    { date: '07-10', platform: '卡淘', price: '¥1,380', condition: 'PSA9' }
  ];

  const cardInfo = [
    { label: '系列', value: '剑盾' },
    { label: '稀有度', value: 'VMAX' },
    { label: '属性', value: '🔥 火' },
    { label: 'HP', value: '330' },
    { label: '弱点', value: '💧 水' },
    { label: '撤退', value: '3' }
  ];

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.navBar}>
        <Text className={styles.navBack} onClick={handleBack}>←</Text>
        <Text className={styles.navTitle}>卡牌详情</Text>
        <Text className={styles.navFavorite}>⭐</Text>
      </View>

      <View className={styles.detailImg}>🔥</View>
      <View className={styles.detailInfo}>
        <Text className={styles.detailName}>喷火龙VMAX</Text>
        <Text className={styles.detailMeta}>SWSH050 · 英文版 · PSA10</Text>
      </View>

      <View className={styles.detailSection}>
        <Text className={styles.detailTitle}>💰 当前价格</Text>
        {priceSources.map((source, idx) => (
          <View key={idx} className={styles.priceRow}>
            <Text className={styles.platformName}>{source.name}</Text>
            <Text className={styles.platformPrice}>{source.price}</Text>
          </View>
        ))}
        <View className={styles.bottomActions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleAlert}>🔔 价格提醒</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSell}>📤 我要出售</button>
        </View>
      </View>

      <View className={styles.detailSection}>
        <Text className={styles.detailTitle}>📊 价格走势图 (30天)</Text>
        <View className={styles.chartPlaceholder}>📈 价格走势图区域</View>
        <View className={styles.chartStats}>
          <Text>最高: ¥1,580</Text>
          <Text>最低: ¥980</Text>
          <Text>平均: ¥1,280</Text>
        </View>
      </View>

      <View className={styles.detailSection}>
        <Text className={styles.detailTitle}>📈 近期成交记录</Text>
        {transactions.map((tx, idx) => (
          <View key={idx} className={styles.txRow}>
            <Text className={styles.txDate}>{tx.date}</Text>
            <Text className={styles.txPlatform}>{tx.platform}</Text>
            <Text className={styles.txPrice}>{tx.price}</Text>
            <Text className={styles.txCondition}>{tx.condition}</Text>
          </View>
        ))}
      </View>

      <View className={styles.detailSection}>
        <Text className={styles.detailTitle}>📋 卡牌信息</Text>
        <View className={styles.infoGrid}>
          {cardInfo.map((info, idx) => (
            <View key={idx} className={styles.infoItem}>
              <Text className={styles.infoLabel}>{info.label}</Text>
              <Text className={styles.infoValue}>{info.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default TradeDetailPage;