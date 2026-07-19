import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './authentication.module.scss';

const AuthenticationPage = () => {
  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>📷 卡牌鉴定</Text>
      </View>
      <View className={styles.content}>
        <Text className={styles.message}>卡牌鉴定功能开发中</Text>
      </View>
    </ScrollView>
  );
};

export default AuthenticationPage;