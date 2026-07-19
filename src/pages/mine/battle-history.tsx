import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './battle-history.module.scss';

const BattleHistoryPage = () => {
  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>🏆 战绩记录</Text>
      </View>
      <View className={styles.content}>
        <Text className={styles.message}>战绩记录功能开发中</Text>
      </View>
    </ScrollView>
  );
};

export default BattleHistoryPage;