import React, { useState, useEffect } from 'react';
import { View, Text, Image, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { PokemonCard } from '@/types';
import { searchCards, formatPrice } from '@/services/api';
import { seriesList, marketList } from '@/data/cards';

const SearchPage = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [results, setResults] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const hotKeywords = ['皮卡丘 VMAX', '喷火龙', '甲贺忍蛙', '超梦', '烈空坐', '月伊布'];

  useEffect(() => {
    // 初始加载热门关键词相关数据
    handleSearch();
  }, []);

  const handleSearch = () => {
    if (!keyword.trim() && !selectedSeries && !selectedMarket) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      // 同步获取数据，无延迟
      const cards = searchCards(keyword, {
        series: selectedSeries || undefined,
        market: selectedMarket || undefined
      });
      setResults(cards);
      setHasSearched(true);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordChange = (e: any) => {
    setKeyword(e.detail.value);
  };

  const handleClear = () => {
    setKeyword('');
    setResults([]);
    setHasSearched(false);
  };

  const handleSeriesFilter = (series: string) => {
    setSelectedSeries(selectedSeries === series ? '' : series);
  };

  const handleMarketFilter = (market: string) => {
    setSelectedMarket(selectedMarket === market ? '' : market);
  };

  const handleHotSearch = (kw: string) => {
    setKeyword(kw);
    setTimeout(() => handleSearch(), 0);
  };

  const handleCardClick = (cardId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${cardId}`
    });
  };

  return (
    <View className={styles.container}>
      {/* 搜索框 */}
      <View className={styles.searchHeader}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            value={keyword}
            placeholder='搜索卡牌名称、系列...'
            onInput={handleKeywordChange}
            onConfirm={handleSearch}
          />
          {keyword && (
            <Text className={styles.clearBtn} onClick={handleClear}>✕</Text>
          )}
        </View>
      </View>

      {/* 筛选器 */}
      <View className={styles.filters}>
        <View className={styles.filterRow}>
          <Text style={{ fontSize: '24rpx', color: '#86909C', marginRight: '16rpx', lineHeight: '48rpx' }}>系列:</Text>
          <ScrollView scrollX style={{ flex: 1 }} scrollEnabled={false}>
            <View style={{ display: 'flex', gap: '16rpx' }}>
              {seriesList.map(series => (
                <View 
                  key={series}
                  className={`${styles.filterChip} ${selectedSeries === series ? styles.active : ''}`}
                  onClick={() => handleSeriesFilter(series)}
                >
                  {series}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
        <View className={styles.filterRow}>
          <Text style={{ fontSize: '24rpx', color: '#86909C', marginRight: '16rpx', lineHeight: '48rpx' }}>市场:</Text>
          <ScrollView scrollX style={{ flex: 1 }} scrollEnabled={false}>
            <View style={{ display: 'flex', gap: '16rpx' }}>
              {marketList.map(market => (
                <View 
                  key={market.key}
                  className={`${styles.filterChip} ${selectedMarket === market.key ? styles.active : ''}`}
                  onClick={() => handleMarketFilter(market.key)}
                >
                  {market.label}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* 搜索结果 */}
      {hasSearched ? (
        <ScrollView className={styles.results} scrollY>
          {results.length > 0 ? (
            results.map(card => (
              <View 
                key={card.id} 
                className={styles.resultItem}
                onClick={() => handleCardClick(card.id)}
              >
                <Image 
                  className={styles.cardImage}
                  src={card.image}
                  mode='aspectFill'
                />
                <View className={styles.cardInfo}>
                  <Text className={styles.cardName}>{card.name}</Text>
                  <Text className={styles.cardSeries}>{card.series} · {card.set}</Text>
                  <View className={styles.cardMeta}>
                    <Text className={styles.metaTag}>{card.rarity}</Text>
                    <Text className={styles.metaTag}>
                      {card.market === 'domestic' ? '国现' : card.market === 'japan' ? '日现' : '美现'}
                    </Text>
                  </View>
                </View>
                <View className={styles.cardPrice}>
                  <Text className={styles.price}>{formatPrice(card.price)}</Text>
                  <Text className={`${styles.change} ${card.priceChange >= 0 ? styles.up : styles.down}`}>
                    {card.priceChange >= 0 ? '↑' : '↓'} {Math.abs(card.priceChange).toFixed(1)}%
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View className={styles.empty}>
              <Text className={styles.emptyIcon}>🔍</Text>
              <Text className={styles.emptyText}>未找到相关卡牌</Text>
              <Text className={styles.emptyHint}>试试其他关键词或筛选条件</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        /* 热门搜索 */
        <View className={styles.hotSearch}>
          <Text className={styles.sectionTitle}>热门搜索</Text>
          <View className={styles.hotTags}>
            {hotKeywords.map(kw => (
              <View 
                key={kw}
                className={styles.hotTag}
                onClick={() => handleHotSearch(kw)}
              >
                🔥 {kw}
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default SearchPage;
