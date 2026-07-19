import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Swiper, SwiperItem } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { AccessoryProduct } from '@/data/accessories';
import { getAccessoryDetail, formatSales } from '@/services/accessoryApi';

const AccessoryDetailPage = () => {
  const [product, setProduct] = useState<AccessoryProduct | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = Taro.getCurrentInstance().router?.params || {};
    if (id) {
      loadProduct(id);
    }
  }, []);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const data = await getAccessoryDetail(productId);
      setProduct(data);
    } catch (error) {
      console.error('加载商品详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    Taro.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    Taro.showToast({
      title: '即将跳转支付',
      icon: 'success'
    });
  };

  const handleShare = () => {
    Taro.showShareMenu({
      withShareTicket: true
    });
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

  if (!product) {
    return (
      <View className={styles.container}>
        <View className={styles.loading}>
          <Text>商品不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <ScrollView scrollY>
        {/* 商品图片轮播 */}
        <View className={styles.imageSection}>
          <Swiper
            className={styles.imageSwiper}
            current={currentImage}
            onChange={(e) => setCurrentImage(e.detail.current)}
            indicatorDots
            indicatorColor='rgba(255,255,255,0.5)'
            indicatorActiveColor='#FFD93D'
            autoplay={false}
          >
            {product.images.map((img, index) => (
              <SwiperItem key={index}>
                <Image 
                  className={styles.productImage}
                  src={img}
                  mode='aspectFill'
                />
              </SwiperItem>
            ))}
          </Swiper>
          
          {/* 图片指示器 */}
          <View className={styles.imageIndicator}>
            {product.images.map((_, index) => (
              <View 
                key={index}
                className={`${styles.indicatorDot} ${index === currentImage ? styles.active : ''}`}
              />
            ))}
          </View>
          
          {/* 标签 */}
          <View className={styles.imageTags}>
            {product.isHot && <View className={styles.tag}>🔥 热卖</View>}
            {product.isNew && <View className={styles.tag}>✨ 新品</View>}
          </View>
        </View>

        {/* 价格与销量 */}
        <View className={styles.priceSection}>
          <View className={styles.priceRow}>
            <Text className={styles.price}>¥{product.price}</Text>
            {product.originalPrice && (
              <>
                <Text className={styles.originalPrice}>¥{product.originalPrice}</Text>
                <View className={styles.discountBadge}>
                  {Math.round(product.discount! * 10)}折
                </View>
              </>
            )}
          </View>
          <View className={styles.salesRow}>
            <Text className={styles.sales}>已售 {formatSales(product.sales)}</Text>
            <Text className={styles.rating}>⭐ {product.rating} 好评</Text>
            <Text className={styles.stock}>库存 {product.stock} 件</Text>
          </View>
        </View>

        {/* 商品名称与描述 */}
        <View className={styles.infoSection}>
          <Text className={styles.productName}>{product.name}</Text>
          <View className={styles.tags}>
            {product.features.map((tag, index) => (
              <Text key={index} className={styles.featureTag}>{tag}</Text>
            ))}
          </View>
          <Text className={styles.description}>{product.description}</Text>
        </View>

        {/* 规格参数 */}
        <View className={styles.specSection}>
          <Text className={styles.sectionTitle}>📋 规格参数</Text>
          <View className={styles.specTable}>
            {Object.entries(product.specifications).map(([key, value]) => (
              <View key={key} className={styles.specRow}>
                <Text className={styles.specKey}>{key}</Text>
                <Text className={styles.specValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 购买数量 */}
        <View className={styles.quantitySection}>
          <Text className={styles.sectionTitle}>📦 购买数量</Text>
          <View className={styles.quantityControl}>
            <View 
              className={styles.quantityBtn}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </View>
            <Text className={styles.quantityNum}>{quantity}</Text>
            <View 
              className={styles.quantityBtn}
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            >
              +
            </View>
          </View>
        </View>

        {/* 购买保障 */}
        <View className={styles.guaranteeSection}>
          <Text className={styles.sectionTitle}>🛡️ 购买保障</Text>
          <View className={styles.guaranteeList}>
            <View className={styles.guaranteeItem}>
              <Text>📦</Text>
              <Text>7天无理由退换</Text>
            </View>
            <View className={styles.guaranteeItem}>
              <Text>🚚</Text>
              <Text>全国包邮</Text>
            </View>
            <View className={styles.guaranteeItem}>
              <Text>✅</Text>
              <Text>正品保证</Text>
            </View>
            <View className={styles.guaranteeItem}>
              <Text>💬</Text>
              <Text>在线客服</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className={styles.actionBar}>
        <View className={styles.actionLeft}>
          <View className={styles.actionIcon} onClick={handleShare}>
            <Text>📤</Text>
            <Text className={styles.actionText}>分享</Text>
          </View>
          <View className={styles.actionIcon}>
            <Text>🛒</Text>
            <Text className={styles.actionText}>购物车</Text>
          </View>
        </View>
        <View className={styles.actionRight}>
          <View className={styles.addCartBtn} onClick={handleAddToCart}>
            加入购物车
          </View>
          <View className={styles.buyBtn} onClick={handleBuyNow}>
            立即购买
          </View>
        </View>
      </View>
    </View>
  );
};

export default AccessoryDetailPage;