import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { AccessoryProduct, AccessoryCategory, CategoryInfo } from '@/data/accessories';
import { 
  getAccessoryProducts, 
  getCategories, 
  getHotAccessories,
  getRecommendedAccessories,
  formatSales 
} from '@/services/accessoryApi';

const AccessoriesPage = () => {
  const [products, setProducts] = useState<AccessoryProduct[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [hotList, setHotList] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<AccessoryProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, hotData, recommendedData] = await Promise.all([
        getAccessoryProducts(),
        getCategories(),
        getHotAccessories(5),
        getRecommendedAccessories(4)
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setHotList(hotData);
      setRecommended(recommendedData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: AccessoryCategory | 'all') => {
    setSelectedCategory(category);
  };

  const handleProductClick = (productId: string) => {
    Taro.navigateTo({
      url: `/pages/accessory-detail/index?id=${productId}`
    });
  };

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      Taro.navigateTo({
        url: `/pages/accessories/index?keyword=${encodeURIComponent(searchKeyword)}`
      });
    }
  };

  const getFilteredProducts = () => {
    let filtered = products;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(keyword) ||
        p.tags.some(t => t.toLowerCase().includes(keyword))
      );
    }
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const getCategoryName = (key: AccessoryCategory | 'all') => {
    if (key === 'all') return '全部';
    const cat = categories.find(c => c.key === key);
    return cat?.name || key;
  };

  return (
    <View className={styles.container}>
      <ScrollView scrollY enableBackToTop>
        {/* 头部搜索 */}
        <View className={styles.header}>
          <Text className={styles.title}>配件市场</Text>
          <View className={styles.searchBox}>
            <Input 
              className={styles.searchInput}
              placeholder='搜索卡盒、卡套...'
              value={searchKeyword}
              onInput={(e) => setSearchKeyword(e.detail.value)}
              onConfirm={handleSearch}
            />
            <View className={styles.searchBtn} onClick={handleSearch}>🔍</View>
          </View>
        </View>

        {/* 分类导航 */}
        <ScrollView className={styles.categoryNav} scrollX>
          <View 
            className={`${styles.categoryItem} ${selectedCategory === 'all' ? styles.active : ''}`}
            onClick={() => handleCategoryClick('all')}
          >
            <Text>全部</Text>
          </View>
          {categories.map(cat => (
            <View 
              key={cat.key}
              className={`${styles.categoryItem} ${selectedCategory === cat.key ? styles.active : ''}`}
              onClick={() => handleCategoryClick(cat.key)}
            >
              <Text>{cat.icon} {cat.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* 热销榜单 */}
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>🔥 卡盒热销榜</Text>
            <Text className={styles.moreBtn}>查看全部</Text>
          </View>
          
          <View className={styles.hotList}>
            {hotList.map(item => (
              <View 
                key={item.product.id}
                className={styles.hotItem}
                onClick={() => handleProductClick(item.product.id)}
              >
                <View className={`${styles.hotRank} ${item.rank <= 3 ? styles[`rank${item.rank}`] : ''}`}>
                  {item.rank}
                </View>
                <Image 
                  className={styles.hotImage}
                  src={item.product.images[0]}
                  mode='aspectFill'
                />
                <View className={styles.hotInfo}>
                  <Text className={styles.hotName} numberOfLines={2}>{item.product.name}</Text>
                  <Text className={styles.hotPrice}>¥{item.product.price}</Text>
                  <Text className={styles.hotSales}>已售{formatSales(item.product.sales)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 推荐商品 */}
        {selectedCategory === 'all' && (
          <View className={styles.section}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>⭐ 精选推荐</Text>
            </View>
            
            <View className={styles.recommendGrid}>
              {recommended.map(product => (
                <View 
                  key={product.id}
                  className={styles.recommendItem}
                  onClick={() => handleProductClick(product.id)}
                >
                  <Image 
                    className={styles.recommendImage}
                    src={product.images[0]}
                    mode='aspectFill'
                  />
                  {product.discount && (
                    <View className={styles.discountTag}>
                      {Math.round(product.discount * 10)}折
                    </View>
                  )}
                  <View className={styles.recommendInfo}>
                    <Text className={styles.recommendName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <View className={styles.recommendPriceRow}>
                      <Text className={styles.recommendPrice}>¥{product.price}</Text>
                      {product.originalPrice && (
                        <Text className={styles.originalPrice}>¥{product.originalPrice}</Text>
                      )}
                    </View>
                    <Text className={styles.recommendSales}>
                      已售{formatSales(product.sales)} | 好评{product.rating}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 商品瀑布流 */}
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              {selectedCategory === 'all' ? '📦 全部商品' : `${getCategoryName(selectedCategory)}`}
            </Text>
            <Text className={styles.goodsCount}>共{filteredProducts.length}件</Text>
          </View>
          
          <View className={styles.productGrid}>
            {filteredProducts.map(product => (
              <View 
                key={product.id}
                className={styles.productItem}
                onClick={() => handleProductClick(product.id)}
              >
                <View className={styles.productImageWrap}>
                  <Image 
                    className={styles.productImage}
                    src={product.images[0]}
                    mode='aspectFill'
                  />
                  {product.isHot && <View className={styles.hotTag}>热卖</View>}
                  {product.isNew && <View className={styles.newTag}>新品</View>}
                  {product.discount && (
                    <View className={styles.discountBadge}>
                      {Math.round(product.discount * 10)}折
                    </View>
                  )}
                </View>
                <View className={styles.productInfo}>
                  <Text className={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <View className={styles.productTags}>
                    {product.features.slice(0, 2).map((tag, index) => (
                      <Text key={index} className={styles.productTag}>{tag}</Text>
                    ))}
                  </View>
                  <View className={styles.productPriceRow}>
                    <Text className={styles.productPrice}>¥{product.price}</Text>
                    {product.originalPrice && (
                      <Text className={styles.productOriginal}>¥{product.originalPrice}</Text>
                    )}
                  </View>
                  <View className={styles.productMeta}>
                    <Text className={styles.productSales}>销量 {formatSales(product.sales)}</Text>
                    <Text className={styles.productRating}>⭐ {product.rating}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AccessoriesPage;