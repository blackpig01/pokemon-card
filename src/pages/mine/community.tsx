import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './community.module.scss';

const CommunityPage = () => {
  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>👥 社区广场</Text>
      </View>
      <View className={styles.content}>
        <Text className={styles.message}>社区广场功能开发中</Text>
      </View>
    </ScrollView>
  );
};

export default CommunityPage;