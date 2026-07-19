import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { PriceAlert } from '@/types';
import { getPriceAlerts, deletePriceAlert, createPriceAlert } from '@/data/enhanced';
import { formatPrice } from '@/services/api';

type AlertTab = 'all' | 'active' | 'triggered';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AlertTab>('all');
  const [showModal, setShowModal] = useState(false);
  const [newAlertType, setNewAlertType] = useState<'buy' | 'sell'>('buy');
  const [newAlertPrice, setNewAlertPrice] = useState('');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await getPriceAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('加载预警列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAlerts = (): PriceAlert[] => {
    if (activeTab === 'all') return alerts;
    if (activeTab === 'active') return alerts.filter(a => !a.triggered);
    if (activeTab === 'triggered') return alerts.filter(a => a.triggered);
    return alerts;
  };

  const handleCardClick = (cardId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${cardId}`
    });
  };

  const handleDelete = async (alertId: string) => {
    try {
      await deletePriceAlert(alertId);
      setAlerts(alerts.filter(a => a.id !== alertId));
      Taro.showToast({
        title: '已删除',
        icon: 'success'
      });
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewAlertPrice('');
  };

  const handlePriceInput = (e: any) => {
    setNewAlertPrice(e.detail.value);
  };

  const handleCreateSubmit = async () => {
    if (!newAlertPrice) {
      Taro.showToast({
        title: '请输入目标价格',
        icon: 'none'
      });
      return;
    }

    try {
      // 模拟创建预警
      const newAlert = await createPriceAlert({
        userId: 'user-001',
        cardId: 'pikachu-vmax-001',
        cardName: '皮卡丘 VMAX',
        cardImage: 'https://picsum.photos/id/1/300/400',
        alertType: newAlertType,
        targetPrice: parseFloat(newAlertPrice),
        currentPrice: 1299,
        triggered: false,
        updatedAt: new Date().toISOString()
      });

      setAlerts([...alerts, newAlert]);
      setShowModal(false);
      setNewAlertPrice('');
      Taro.showToast({
        title: '预警已创建',
        icon: 'success'
      });
    } catch (error) {
      console.error('创建失败:', error);
    }
  };

  const calculateDistance = (alert: PriceAlert): string => {
    const distance = Math.abs(alert.currentPrice - alert.targetPrice);
    const percent = (distance / alert.currentPrice) * 100;
    return `差距 ¥${distance.toFixed(0)} (${percent.toFixed(1)}%)`;
  };

  return (
    <View className={styles.container}>
      {/* 头部 */}
      <View className={styles.header}>
        <Text className={styles.title}>价格预警</Text>
        <Text className={styles.subtitle}>
          当价格触及目标时，将收到微信通知
        </Text>
      </View>

      {/* Tab切换 */}
      <View className={styles.tabs}>
        <View 
          className={`${styles.tabItem} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => setActiveTab('all')}
        >
          全部 ({alerts.length})
        </View>
        <View 
          className={`${styles.tabItem} ${activeTab === 'active' ? styles.active : ''}`}
          onClick={() => setActiveTab('active')}
        >
          监控中 ({alerts.filter(a => !a.triggered).length})
        </View>
        <View 
          className={`${styles.tabItem} ${activeTab === 'triggered' ? styles.active : ''}`}
          onClick={() => setActiveTab('triggered')}
        >
          已触发 ({alerts.filter(a => a.triggered).length})
        </View>
      </View>

      {/* 预警列表 */}
      {getFilteredAlerts().length > 0 ? (
        <ScrollView className={styles.alertList} scrollY>
          {getFilteredAlerts().map(alert => (
            <View 
              key={alert.id}
              className={`${styles.alertItem} ${alert.triggered ? styles.triggered : ''}`}
              onClick={() => handleCardClick(alert.cardId)}
            >
              <View className={`${styles.alertBadge} ${styles[alert.alertType]} ${alert.triggered ? styles.triggered : ''}`}>
                {alert.alertType === 'buy' ? '买' : '卖'}
              </View>
              <Image 
                className={styles.alertImage}
                src={alert.cardImage}
                mode='aspectFill'
              />
              <View className={styles.alertInfo}>
                <Text className={styles.alertName}>{alert.cardName}</Text>
                <Text className={`${styles.alertType} ${styles[alert.alertType]}`}>
                  {alert.alertType === 'buy' ? '买入预警' : '卖出预警'}
                </Text>
                <Text className={styles.alertTime}>
                  创建于 {alert.createdAt.split(' ')[0]}
                </Text>
                {alert.triggered && (
                  <View className={styles.triggeredBadge}>
                    <Text>✓ 已触发</Text>
                  </View>
                )}
              </View>
              <View className={styles.alertPrice}>
                <Text className={styles.targetPrice}>目标价</Text>
                <Text className={`${styles.targetValue} ${styles[alert.alertType]}`}>
                  {formatPrice(alert.targetPrice)}
                </Text>
                <Text className={styles.currentValue}>
                  当前 {formatPrice(alert.currentPrice)}
                </Text>
                {!alert.triggered && (
                  <Text className={styles.distance}>
                    {calculateDistance(alert)}
                  </Text>
                )}
              </View>
              <View className={styles.alertActions}>
                <View 
                  className={styles.actionIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(alert.id);
                  }}
                >
                  <Text>🗑️</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>🔔</Text>
          <Text className={styles.emptyText}>暂无价格预警</Text>
          <Text className={styles.emptyHint}>点击下方按钮创建预警</Text>
        </View>
      )}

      {/* 创建按钮 */}
      <View className={styles.createBtn} onClick={handleCreate}>
        <Text>+</Text>
      </View>

      {/* 创建预警弹窗 */}
      {showModal && (
        <View className={styles.modal} onClick={handleModalClose}>
          <View 
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>创建价格预警</Text>
              <Text className={styles.modalClose} onClick={handleModalClose}>✕</Text>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>预警类型</Text>
              <View className={styles.formSelect}>
                <View 
                  className={`${styles.selectOption} ${newAlertType === 'buy' ? styles.selected : ''}`}
                  onClick={() => setNewAlertType('buy')}
                >
                  买入预警
                </View>
                <View 
                  className={`${styles.selectOption} ${newAlertType === 'sell' ? styles.selected : ''}`}
                  onClick={() => setNewAlertType('sell')}
                >
                  卖出预警
                </View>
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>目标价格 (元)</Text>
              <Input 
                className={styles.formInput}
                type='number'
                placeholder={newAlertType === 'buy' ? '低于此价格时提醒买入' : '高于此价格时提醒卖出'}
                value={newAlertPrice}
                onInput={handlePriceInput}
              />
            </View>

            <View className={styles.submitBtn} onClick={handleCreateSubmit}>
              创建预警
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default AlertsPage;