import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { UserFavoriteItem } from '@/types';
import { getUserFavorites, removeFromFavorites } from '@/data/enhanced';
import { formatPrice } from '@/services/api';

type SortType = 'default' | 'price' | 'change';

const WatchlistPage = () => {
  const [favorites, setFavorites] = useState<UserFavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortType>('default');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getUserFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('加载自选清单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (type: SortType) => {
    setSortBy(type);
    let sorted = [...favorites];
    
    if (type === 'price') {
      sorted.sort((a, b) => b.currentPrice - a.currentPrice);
    } else if (type === 'change') {
      sorted.sort((a, b) => b.priceChange - a.priceChange);
    }
    
    setFavorites(sorted);
  };

  const handleCardClick = (cardId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${cardId}`
    });
  };

  const handleToggleAlert = (cardId: string, enabled: boolean) => {
    Taro.showToast({
      title: enabled ? '预警已开启' : '预警已关闭',
      icon: 'success'
    });
  };

  const handleRemove = async (cardId: string) => {
    try {
      await removeFromFavorites(cardId);
      setFavorites(favorites.filter(f => f.cardId !== cardId));
      Taro.showToast({
        title: '已移除',
        icon: 'success'
      });
    } catch (error) {
      console.error('移除失败:', error);
    }
  };

  const handleAddNew = () => {
    Taro.switchTab({
      url: '/pages/search/index'
    });
  };

  return (
    <View className={styles.container}>
      {/* 头部 */}
      <View className={styles.header}>
        <Text className={styles.title}>我的自选</Text>
        <Text className={styles.count}>{favorites.length} 张卡牌</Text>
      </View>

      {/* 工具栏 */}
      <View className={styles.toolbar}>
        <View 
          className={`${styles.sortBtn} ${sortBy === 'default' ? styles.active : ''}`}
          onClick={() => handleSort('default')}
        >
          默认排序
        </View>
        <View 
          className={`${styles.sortBtn} ${sortBy === 'price' ? styles.active : ''}`}
          onClick={() => handleSort('price')}
        >
          按价格
        </View>
        <View 
          className={`${styles.sortBtn} ${sortBy === 'change' ? styles.active : ''}`}
          onClick={() => handleSort('change')}
        >
          按涨跌
        </View>
      </View>

      {/* 列表 */}
      {favorites.length > 0 ? (
        <ScrollView className={styles.list} scrollY>
          {favorites.map(item => (
            <View 
              key={item.cardId}
              className={styles.item}
              onClick={() => handleCardClick(item.cardId)}
            >
              <Image 
                className={styles.itemImage}
                src={item.cardImage}
                mode='aspectFill'
              />
              <View className={styles.itemInfo}>
                <Text className={styles.itemName}>{item.cardName}</Text>
                <View className={styles.itemMeta}>
                  <Text className={styles.metaItem}>
                    添加于 {item.addedAt.split(' ')[0]}
                  </Text>
                </View>
                <View className={styles.itemTargets}>
                  {item.targetBuyPrice && (
                    <Text className={`${styles.target} ${styles.buy}`}>
                      目标买入 ¥{item.targetBuyPrice}
                    </Text>
                  )}
                  {item.targetSellPrice && (
                    <Text className={`${styles.target} ${styles.sell}`}>
                      目标卖出 ¥{item.targetSellPrice}
                    </Text>
                  )}
                </View>
              </View>
              <View className={styles.itemPrice}>
                <Text className={styles.currentPrice}>{formatPrice(item.currentPrice)}</Text>
                <Text className={`${styles.priceChange} ${item.priceChange >= 0 ? styles.up : styles.down}`}>
                  {item.priceChange >= 0 ? '↑' : '↓'} {Math.abs(item.priceChange).toFixed(1)}%
                </Text>
              </View>
              <View className={styles.itemActions}>
                <View 
                  className={`${styles.alertSwitch} ${item.alertEnabled ? styles.enabled : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleAlert(item.cardId, !item.alertEnabled);
                  }}
                >
                  <View className={`${styles.switchDot} ${item.alertEnabled ? styles.enabled : ''}`} />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>⭐</Text>
          <Text className={styles.emptyText}>暂无自选卡牌</Text>
          <Text className={styles.emptyHint}>搜索并添加您关注的卡牌</Text>
          <View className={styles.addBtn} onClick={handleAddNew}>
            添加卡牌
          </View>
        </View>
      )}
    </View>
  );
};

export default WatchlistPage;