import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { CardDetailEnhanced, GradeType } from '@/types';
import { getCardDetailEnhanced, addToFavorites, createPriceAlert } from '@/data/enhanced';
import { formatPrice } from '@/services/api';
import { KlineChart, GradePriceCompare, Danmaku, CommentSection } from '@/components';

const DetailPage = () => {
  const [card, setCard] = useState<CardDetailEnhanced | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<GradeType>('psa10');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertPrice, setAlertPrice] = useState('');

  useEffect(() => {
    const { id } = Taro.getCurrentInstance().router?.params || {};
    if (id) {
      loadCardDetail(id);
    }
  }, []);

  const loadCardDetail = async (cardId: string) => {
    try {
      setLoading(true);
      const data = await getCardDetailEnhanced(cardId);
      setCard(data);
    } catch (error) {
      console.error('加载卡牌详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCollect = async () => {
    if (!card) return;
    
    try {
      await addToFavorites({
        cardId: card.id,
        cardName: card.name,
        cardImage: card.image,
        currentPrice: card.price,
        priceChange: card.priceChange,
        addedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        alertEnabled: false
      });
      
      Taro.showToast({
        title: '已添加到收藏',
        icon: 'success'
      });
    } catch (error) {
      console.error('添加收藏失败:', error);
    }
  };

  const handleShare = () => {
    Taro.showShareMenu({
      withShareTicket: true
    });
  };

  const handleAlert = () => {
    setShowAlertModal(true);
  };

  const handleGradeSelect = (grade: GradeType) => {
    setSelectedGrade(grade);
  };

  if (loading) {
    return (
      <View className={styles.container}>
        <View className={styles.loading}>
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  if (!card) {
    return (
      <View className={styles.container}>
        <View className={styles.loading}>
          <Text>卡牌不存在</Text>
        </View>
      </View>
    );
  }

  const gradeData = card.gradePrices[selectedGrade];
  const transactions = card.recentTransactions.slice(0, 10);

  return (
    <View className={styles.container}>
      <ScrollView scrollY>
        {/* 卡牌图片 */}
        <View className={styles.cardImage}>
          <Image 
            style={{ width: '100%', height: '100%' }}
            src={card.image}
            mode='aspectFit'
          />
        </View>

        {/* 内容区域 */}
        <View className={styles.content}>
          {/* 头部信息 */}
          <View className={styles.header}>
            <Text className={styles.name}>{card.name}</Text>
            <Text className={styles.series}>{card.series} · {card.set}</Text>
            <View className={styles.metaTags}>
              <Text className={styles.tag}>{card.rarity}</Text>
              <Text className={styles.tag}>
                {card.market === 'domestic' ? '国现' : card.market === 'japan' ? '日现' : '美现'}
              </Text>
              <Text className={styles.tag}>{card.grade}</Text>
            </View>
          </View>

          {/* 价格区域 */}
          <View className={styles.priceSection}>
            <View className={styles.price}>
              <Text className={styles.current}>{formatPrice(gradeData?.current || card.price)}</Text>
              {card.originalPrice && (
                <Text className={styles.original}>{formatPrice(card.originalPrice)}</Text>
              )}
            </View>
            <View className={`${styles.change} ${(gradeData?.change || card.priceChange) >= 0 ? styles.up : styles.down}`}>
              {(gradeData?.change || card.priceChange) >= 0 ? '↑' : '↓'} {Math.abs(gradeData?.change || card.priceChange).toFixed(1)}%
            </View>
          </View>

          {/* 评级价差对比 */}
          <View className={styles.section}>
            <GradePriceCompare 
              gradePrices={card.gradePrices}
              onGradeSelect={handleGradeSelect}
            />
          </View>

          {/* K线走势图 */}
          <View className={styles.section}>
            <KlineChart 
              data={card.klineData.daily}
              title={`${selectedGrade === 'raw' ? '裸卡' : selectedGrade.toUpperCase()} 价格走势`}
              showVolume={true}
            />
          </View>

          {/* 实时弹幕 */}
          <View className={styles.section}>
            <Danmaku 
              cardId={card.id}
              cardName={card.name}
            />
          </View>

          {/* 深度留言讨论区 */}
          <View className={styles.section}>
            <CommentSection cardId={card.id} />
          </View>

          {/* 历史成交明细 */}
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>📜 最近成交记录</Text>
            <View className={styles.transactions}>
              {transactions.map(tx => (
                <View key={tx.id} className={styles.txItem}>
                  <View className={`${styles.txGrade} ${styles[tx.grade]}`}>
                    {tx.grade === 'raw' ? '裸' : tx.grade.toUpperCase().slice(0, 3)}
                  </View>
                  <View className={styles.txInfo}>
                    <Text className={styles.txPrice}>{formatPrice(tx.price)}</Text>
                    <Text className={styles.txMeta}>{tx.platform} · {tx.volume}张</Text>
                  </View>
                  <Text className={styles.txTime}>{tx.timestamp}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className={styles.actions}>
        <View className={`${styles.actionBtn} ${styles.secondary}`} onClick={handleShare}>
          分享
        </View>
        <View className={`${styles.actionBtn} ${styles.alert}`} onClick={handleAlert}>
          🔔 预警
        </View>
        <View className={`${styles.actionBtn} ${styles.primary}`} onClick={handleCollect}>
          ⭐ 收藏
        </View>
      </View>
    </View>
  );
};

export default DetailPage;