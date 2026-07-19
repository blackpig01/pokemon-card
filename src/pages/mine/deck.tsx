import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './deck.module.scss';

const DeckPage = () => {
  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>🛠️ 卡组构筑</Text>
      </View>
      <View className={styles.content}>
        <Text className={styles.message}>智能卡组构筑功能开发中</Text>
      </View>
    </ScrollView>
  );
};

export default DeckPage;