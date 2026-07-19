import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './cross-battle.module.scss';

const CrossBattlePage = () => {
  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>⚔️ 双海大乱斗</Text>
        <Text className={styles.subtitle}>宝可梦 vs 海贼王 混合对战</Text>
      </View>
      
      <View className={styles.comingSoon}>
        <Text className={styles.icon}>⚡🏴‍☠️</Text>
        <Text className={styles.message}>双海大乱斗开发中</Text>
        <Text className={styles.details}>王牌模式即将登场！</Text>
      </View>
      
      <View className={styles.rules}>
        <Text className={styles.sectionTitle}>📜 规则融合</Text>
        <View className={styles.ruleCard}>
          <Text className={styles.ruleIcon}>⚡</Text>
          <View className={styles.ruleContent}>
            <Text className={styles.ruleTitle}>宝可梦方</Text>
            <Text className={styles.ruleDesc}>使用PTCG规则（60张卡组，奖卡机制）</Text>
          </View>
        </View>
        <View className={styles.ruleCard}>
          <Text className={styles.ruleIcon}>🏴‍☠️</Text>
          <View className={styles.ruleContent}>
            <Text className={styles.ruleTitle}>海贼方</Text>
            <Text className={styles.ruleDesc}>使用OPCG规则（领袖+生命区机制）</Text>
          </View>
        </View>
      </View>
      
      <View className={styles.balance}>
        <Text className={styles.sectionTitle}>⚖️ 平衡机制</Text>
        <View className={styles.balanceItems}>
          <Text className={styles.balanceItem}>• 宝可梦击杀海贼角色 → 获得1张奖卡</Text>
          <Text className={styles.balanceItem}>• 海贼击败宝可梦 → 减少1点生命区</Text>
          <Text className={styles.balanceItem}>• 双方同时满足胜利条件 → 进入「最终对决」</Text>
        </View>
      </View>
      
      <View className={styles.specialCards}>
        <Text className={styles.sectionTitle}>🎴 专属卡牌</Text>
        <View className={styles.specialCard}>
          <Text className={styles.specialIcon}>⚡</Text>
          <View className={styles.specialContent}>
            <Text className={styles.specialName}>皮卡丘的雷电</Text>
            <Text className={styles.specialDesc}>海贼方可使用，造成麻痹效果</Text>
          </View>
        </View>
        <View className={styles.specialCard}>
          <Text className={styles.specialIcon}>💪</Text>
          <View className={styles.specialContent}>
            <Text className={styles.specialName}>路飞的橡胶拳</Text>
            <Text className={styles.specialDesc}>宝可梦方可使用，无视抗性</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default CrossBattlePage;