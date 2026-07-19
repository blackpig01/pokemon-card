import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './opcg-battle.module.scss';

const OPCGBattlePage = () => {
  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>🏴‍☠️ OPCG对战</Text>
        <Text className={styles.subtitle}>海贼王卡牌对战</Text>
      </View>
      
      <View className={styles.comingSoon}>
        <Text className={styles.icon}>🚧</Text>
        <Text className={styles.message}>OPCG对战模式开发中</Text>
        <Text className={styles.details}>即将推出悬赏令系统和四皇争霸模式</Text>
      </View>
      
      <View className={styles.features}>
        <View className={styles.feature}>
          <Text className={styles.featureIcon}>🏴‍☠️</Text>
          <Text className={styles.featureTitle}>悬赏令系统</Text>
          <Text className={styles.featureDesc}>每局开始前获得悬赏令，完成悬赏可获得丰厚奖励</Text>
        </View>
        <View className={styles.feature}>
          <Text className={styles.featureIcon}>👑</Text>
          <Text className={styles.featureTitle}>四皇争霸模式</Text>
          <Text className={styles.featureDesc}>支持2-4人对战，引入联盟机制</Text>
        </View>
        <View className={styles.feature}>
          <Text className={styles.featureIcon}>💥</Text>
          <Text className={styles.featureTitle}>霸气系统</Text>
          <Text className={styles.featureDesc}>获得霸气标记可抵消一次伤害</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default OPCGBattlePage;