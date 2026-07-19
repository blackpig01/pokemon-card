import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import {
  NewsArticle,
  FlashNews,
  NewsCategory,
  NewsCategoryNames
} from '@/data/news';
import {
  getFlashNewsList,
  getNewsArticles,
  getHotNews,
  formatReadCount,
  formatPublishTime
} from '@/services/newsApi';

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | 'all'>('all');
  const [flashNews, setFlashNews] = useState<FlashNews[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [hotNews, setHotNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadArticles();
  }, [activeCategory]);

  const loadData = () => {
    try {
      setLoading(true);
      setFlashNews(getFlashNewsList(8));
      setHotNews(getHotNews(3));
      loadArticles();
    } catch (error) {
      console.error('加载资讯失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadArticles = () => {
    const category = activeCategory === 'all' ? undefined : activeCategory;
    setNewsArticles(getNewsArticles(category));
  };

  const handleArticleClick = (id: string) => {
    // 跳转到资讯详情页（后续可创建）
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  };

  const getCategoryIcon = (category: NewsCategory): string => {
    const icons: Record<NewsCategory, string> = {
      market: '📈',
      event: '🏆',
      release: '🎉',
      guide: '💡',
      rating: '⭐'
    };
    return icons[category];
  };

  return (
    <View className={styles.container}>
      {/* 头部 */}
      <View className={styles.header}>
        <Text className={styles.title}>快讯</Text>
        <Text className={styles.subtitle}>卡牌资讯实时更新</Text>
      </View>

      {/* 快讯滚动区 */}
      <View className={styles.flashSection}>
        <ScrollView className={styles.flashScroll} scrollY>
          {flashNews.map(item => (
            <View 
              key={item.id} 
              className={`${styles.flashItem} ${item.isHot ? styles.hotFlash : ''}`}
            >
              <View className={styles.flashHeader}>
                <Text className={styles.flashIcon}>{getCategoryIcon(item.category)}</Text>
                <Text className={styles.flashContent}>{item.content}</Text>
              </View>
              <View className={styles.flashMeta}>
                <Text className={styles.flashTime}>{formatPublishTime(item.publishTime)}</Text>
                {item.source && (
                  <Text className={styles.flashSource}>来源: {item.source}</Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 分类导航 */}
      <View className={styles.categoryNav}>
        <View 
          className={`${styles.categoryItem} ${activeCategory === 'all' ? styles.active : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          全部
        </View>
        {Object.entries(NewsCategoryNames).map(([key, name]) => (
          <View 
            key={key}
            className={`${styles.categoryItem} ${activeCategory === key ? styles.active : ''}`}
            onClick={() => setActiveCategory(key as NewsCategory)}
          >
            {name}
          </View>
        ))}
      </View>

      {/* 热门资讯 */}
      {activeCategory === 'all' && hotNews.length > 0 && (
        <View className={styles.hotSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>🔥 热门资讯</Text>
          </View>
          <View className={styles.hotList}>
            {hotNews.map(article => (
              <View 
                key={article.id}
                className={styles.hotArticle}
                onClick={() => handleArticleClick(article.id)}
              >
                <Image 
                  className={styles.hotCover}
                  src={article.coverImage}
                  mode='aspectFill'
                />
                <View className={styles.hotContent}>
                  <Text className={styles.hotTitle} numberOfLines={2}>{article.title}</Text>
                  <View className={styles.hotMeta}>
                    <Text className={styles.hotReads}>{formatReadCount(article.readCount)}阅读</Text>
                    <Text className={styles.hotTime}>{formatPublishTime(article.publishTime)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 资讯列表 */}
      <ScrollView className={styles.articleList} scrollY>
        {newsArticles.map(article => (
          <View 
            key={article.id}
            className={styles.articleItem}
            onClick={() => handleArticleClick(article.id)}
          >
            <Image 
              className={styles.articleCover}
              src={article.coverImage}
              mode='aspectFill'
            />
            <View className={styles.articleContent}>
              <View className={styles.articleHeader}>
                <Text className={styles.articleCategory}>
                  {getCategoryIcon(article.category)} {NewsCategoryNames[article.category]}
                </Text>
                <Text className={styles.articleTime}>{formatPublishTime(article.publishTime)}</Text>
              </View>
              <Text className={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
              <Text className={styles.articleSummary} numberOfLines={2}>{article.summary}</Text>
              <View className={styles.articleTags}>
                {article.tags.slice(0, 3).map((tag, idx) => (
                  <Text key={idx} className={styles.articleTag}>{tag}</Text>
                ))}
              </View>
              <View className={styles.articleMeta}>
                <Text className={styles.authorName}>{article.author}</Text>
                <View className={styles.articleStats}>
                  <Text className={styles.statItem}>👁 {formatReadCount(article.readCount)}</Text>
                  <Text className={styles.statItem}>👍 {article.likeCount}</Text>
                  <Text className={styles.statItem}>💬 {article.commentCount}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default NewsPage;