import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './alerts.module.scss';

const AlertsPage = () => {
  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>🔔 价格提醒</Text>
      </View>
      <View className={styles.content}>
        <Text className={styles.message}>价格提醒功能开发中</Text>
      </View>
    </ScrollView>
  );
};

export default AlertsPage;