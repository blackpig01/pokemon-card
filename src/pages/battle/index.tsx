import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const BattlePage = () => {
  const handleQuickMatch = () => {
    Taro.showToast({ title: '开始匹配中...', icon: 'loading' });
  };

  const handleModeClick = (mode: string) => {
    if (mode === 'ptcg-standard') {
      Taro.navigateTo({ url: '/pages/battle/ptcg-battle' });
    } else if (mode === 'opcg-standard') {
      Taro.navigateTo({ url: '/pages/battle/opcg-battle' });
    } else if (mode === 'cross-battle') {
      Taro.navigateTo({ url: '/pages/battle/cross-battle' });
    } else {
      Taro.showToast({ title: `${mode}功能开发中`, icon: 'none' });
    }
  };

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.tradeHeader}>
        <Text className={styles.headerTitle}>⚔️ 对战区</Text>
      </View>

      <View className={styles.quickMatch}>
        <Text className={styles.quickMatchH3}>🎮 快速匹配</Text>
        <Text className={styles.quickMatchP}>选择你的卡组，立即开始对战</Text>
        <button className={`${styles.btn} ${styles.btnPrimary}`} style={{ width: '60%' }} onClick={handleQuickMatch}>
          开始匹配
        </button>
      </View>

      <View className={styles.battleModes}>
        <View className={styles.modeSection}>
          <View className={styles.modeTitle}>
            <Text className={styles.dot} style={{ background: '#ff6b35' }}></Text>
            <Text>宝可梦 PTCG</Text>
          </View>
          <View className={styles.modeGrid}>
            <View className={styles.modeCard} onClick={() => handleModeClick('ptcg-standard')}>
              <Text className={styles.modeIcon}>🎯</Text>
              <Text className={styles.modeName}>标准对战</Text>
              <Text className={styles.modeTag} style={{ background: '#e3f2fd', color: '#2979ff' }}>经典</Text>
            </View>
            <View className={styles.modeCard} onClick={() => handleModeClick('ptcg-bond')}>
              <Text className={styles.modeIcon}>💫</Text>
              <Text className={styles.modeName}>羁绊进化</Text>
              <Text className={styles.modeTag} style={{ background: '#fff3e0', color: '#ff6b35' }}>创新</Text>
            </View>
            <View className={styles.modeCard} onClick={() => handleModeClick('ptcg-weather')}>
              <Text className={styles.modeIcon}>🌦️</Text>
              <Text className={styles.modeName}>天气场地</Text>
              <Text className={styles.modeTag} style={{ background: '#fff3e0', color: '#ff6b35' }}>创新</Text>
            </View>
          </View>
        </View>

        <View className={styles.modeSection}>
          <View className={styles.modeTitle}>
            <Text className={styles.dot} style={{ background: '#c41e3a' }}></Text>
            <Text>海贼王 OPCG</Text>
          </View>
          <View className={styles.modeGrid}>
            <View className={styles.modeCard} onClick={() => handleModeClick('opcg-standard')}>
              <Text className={styles.modeIcon}>⚓</Text>
              <Text className={styles.modeName}>标准对战</Text>
              <Text className={styles.modeTag} style={{ background: '#e3f2fd', color: '#2979ff' }}>经典</Text>
            </View>
            <View className={styles.modeCard} onClick={() => handleModeClick('opcg-bounty')}>
              <Text className={styles.modeIcon}>📜</Text>
              <Text className={styles.modeName}>悬赏令</Text>
              <Text className={styles.modeTag} style={{ background: '#fff3e0', color: '#ff6b35' }}>创新</Text>
            </View>
            <View className={styles.modeCard} onClick={() => handleModeClick('opcg-kaido')}>
              <Text className={styles.modeIcon}>👑</Text>
              <Text className={styles.modeName}>四皇争霸</Text>
              <Text className={styles.modeTag} style={{ background: '#f3e5f5', color: '#9c27b0' }}>多人</Text>
            </View>
          </View>
        </View>

        <View className={styles.modeSection}>
          <View className={styles.modeTitle}>
            <Text className={styles.dot} style={{ background: 'linear-gradient(90deg, #ff6b35, #c41e3a)' }}></Text>
            <Text>双海大乱斗</Text>
          </View>
          <View className={styles.modeGrid}>
            <View className={styles.modeCard} style={{ gridColumn: 'span 3', background: 'linear-gradient(135deg,#1a1a2e,#16213e)', color: 'white' }} onClick={() => handleModeClick('cross-battle')}>
              <Text className={styles.modeIcon}>⚔️</Text>
              <Text className={styles.modeName}>宝可梦 vs 海贼王</Text>
              <Text className={styles.modeTag} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>跨IP对战</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.detailSection}>
        <Text className={styles.detailTitle}>📊 我的战绩</Text>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>宝可梦</Text>
            <Text className={styles.infoValue} style={{ color: '#ff6b35' }}>10胜5负</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>海贼王</Text>
            <Text className={styles.infoValue} style={{ color: '#c41e3a' }}>8胜3负</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>双海大乱斗</Text>
            <Text className={styles.infoValue} style={{ color: '#2979ff' }}>5胜2负</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>当前段位</Text>
            <Text className={styles.infoValue}>黄金III ⭐⭐⭐</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default BattlePage;