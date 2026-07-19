import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './collection.module.scss';

const CollectionPage = () => {
  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>📚 我的收藏库</Text>
      </View>
      <View className={styles.content}>
        <Text className={styles.message}>收藏管理功能开发中</Text>
      </View>
    </ScrollView>
  );
};

export default CollectionPage;