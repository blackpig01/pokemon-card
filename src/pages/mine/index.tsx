import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const MinePage = () => {
  const handleMenuClick = (title: string) => {
    Taro.showToast({ title: `${title}开发中`, icon: 'none' });
  };

  const stats = [
    { label: '收藏价值', value: '¥12,800', icon: '💰' },
    { label: '卡牌数', value: '108', icon: '📚' },
    { label: '胜率', value: '52%', icon: '🏆' },
    { label: '对战数', value: '128', icon: '⚔️' }
  ];

  const menuItems = [
    { icon: '📚', title: '收藏管理', desc: '管理我的卡牌收藏' },
    { icon: '🛠️', title: '卡组构筑', desc: '智能卡组推荐' },
    { icon: '🏆', title: '战绩记录', desc: '对战历史与段位' },
    { icon: '🔔', title: '价格提醒', desc: '设置价格监控' },
    { icon: '📷', title: '卡牌鉴定', desc: 'AI拍照识别真伪' },
    { icon: '👥', title: '社区广场', desc: '卡组分享与交流' },
    { icon: '⚙️', title: '设置', desc: '账号与偏好设置' },
    { icon: '❓', title: '帮助与反馈', desc: '常见问题与建议' }
  ];

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.header}>
        <View className={styles.avatar}>🧙</View>
        <Text className={styles.userName}>双海训练师</Text>
        <Text className={styles.userId}>ID: 88888888</Text>
        <View className={styles.rankBadge}>
          <Text>🏆 黄金段位</Text>
        </View>
      </View>

      <View className={styles.stats}>
        {stats.map((stat, idx) => (
          <View key={idx} className={styles.statItem}>
            <Text className={styles.statIcon}>{stat.icon}</Text>
            <Text className={styles.statValue}>{stat.value}</Text>
            <Text className={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.menuSection}>
        {menuItems.map((item, idx) => (
          <View key={idx} className={styles.menuItem} onClick={() => handleMenuClick(item.title)}>
            <Text className={styles.menuIcon}>{item.icon}</Text>
            <View className={styles.menuInfo}>
              <Text className={styles.menuTitle}>{item.title}</Text>
              <Text className={styles.menuDesc}>{item.desc}</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        ))}
      </View>

      <View className={styles.footer}>
        <Text className={styles.appName}>双海卡牌 Dual Sea TCG</Text>
        <Text className={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

export default MinePage;