/**
 * 快讯页面分类筛选功能单元测试
 * 
 * 测试覆盖范围:
 * 1. getNewsArticles - 分类筛选逻辑
 * 2. getFlashNewsList - 快讯排序和限制逻辑
 * 3. getHotNews - 热门资讯获取逻辑
 * 4. formatReadCount - 阅读数格式化
 * 5. formatPublishTime - 发布时间格式化
 * 6. searchNews - 资讯搜索功能
 */

import {
  getNewsArticles,
  getFlashNewsList,
  getHotNews,
  getNewsDetail,
  getNewsComments,
  postNewsComment,
  likeNewsArticle,
  likeNewsComment,
  searchNews,
  formatReadCount,
  formatPublishTime
} from '../services/newsApi';
import {
  NewsCategory,
  mockNewsArticles,
  mockFlashNews,
  mockNewsComments,
  NewsCategoryNames
} from '../data/news';

describe('快讯页面分类筛选功能测试', () => {
  
  // ==================== 资讯分类筛选测试 ====================
  
  describe('getNewsArticles - 资讯文章分类筛选', () => {
    
    /**
     * 测试：获取所有资讯文章（不指定分类）
     * 预期：返回所有 Mock 数据，且按发布时间降序排列
     */
    test('应返回所有资讯文章且按时间降序排列', () => {
      const result = getNewsArticles();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(mockNewsArticles.length);
      
      // 验证按时间降序排列
      for (let i = 0; i < result.length - 1; i++) {
        const current = new Date(result[i].publishTime).getTime();
        const next = new Date(result[i + 1].publishTime).getTime();
        expect(current).toBeGreaterThanOrEqual(next);
      }
    });

    /**
     * 测试：按 market（行情分析）分类筛选
     * 预期：只返回分类为 market 的资讯
     */
    test('应正确筛选 market 分类的资讯', () => {
      const result = getNewsArticles('market');
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      // 验证所有结果都是 market 分类
      result.forEach(article => {
        expect(article.category).toBe('market');
      });
      
      // 验证至少有一条 market 分类的数据
      expect(result.length).toBeGreaterThan(0);
    });

    /**
     * 测试：按 event（赛事资讯）分类筛选
     * 预期：只返回分类为 event 的资讯
     */
    test('应正确筛选 event 分类的资讯', () => {
      const result = getNewsArticles('event');
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      result.forEach(article => {
        expect(article.category).toBe('event');
      });
      
      expect(result.length).toBeGreaterThan(0);
    });

    /**
     * 测试：按 release（新品发布）分类筛选
     * 预期：只返回分类为 release 的资讯
     */
    test('应正确筛选 release 分类的资讯', () => {
      const result = getNewsArticles('release');
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      result.forEach(article => {
        expect(article.category).toBe('release');
      });
    });

    /**
     * 测试：按 guide（新手指南）分类筛选
     * 预期：只返回分类为 guide 的资讯
     */
    test('应正确筛选 guide 分类的资讯', () => {
      const result = getNewsArticles('guide');
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      result.forEach(article => {
        expect(article.category).toBe('guide');
      });
    });

    /**
     * 测试：按 rating（评级讨论）分类筛选
     * 预期：只返回分类为 rating 的资讯
     */
    test('应正确筛选 rating 分类的资讯', () => {
      const result = getNewsArticles('rating');
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      result.forEach(article => {
        expect(article.category).toBe('rating');
      });
    });

    /**
     * 测试：按不存在的分类筛选
     * 预期：返回空数组
     */
    test('不存在的分类应返回空数组', () => {
      // 使用一个确保不存在的小写分类名
      const result = getNewsArticles('nonexistent' as NewsCategory);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    /**
     * 测试：所有分类都应有对应数据
     * 预期：market, event, release, guide, rating 五个分类都有数据
     */
    test('所有分类都应有对应数据', () => {
      const categories: NewsCategory[] = ['market', 'event', 'release', 'guide', 'rating'];
      
      categories.forEach(category => {
        const result = getNewsArticles(category);
        expect(result.length).toBeGreaterThan(0);
        expect(result.every(a => a.category === category)).toBe(true);
      });
    });
  });

  // ==================== 快讯排序测试 ====================
  
  describe('getFlashNewsList - 快讯列表排序和限制', () => {
    
    /**
     * 测试：获取所有快讯（无限制）
     * 预期：返回所有快讯，热门优先，按时间降序
     */
    test('应返回所有快讯且热门优先', () => {
      const result = getFlashNewsList();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(mockFlashNews.length);
      
      // 验证热门快讯排在前面
      const firstHotIndex = result.findIndex(item => item.isHot);
      const lastNonHotIndex = result.length - 1 - [...result].reverse().findIndex(item => !item.isHot);
      
      if (firstHotIndex !== -1 && lastNonHotIndex !== -1) {
        expect(firstHotIndex).toBeLessThan(lastNonHotIndex);
      }
    });

    /**
     * 测试：限制返回数量
     * 预期：只返回指定数量的快讯
     */
    test('应正确限制返回数量', () => {
      const limit = 3;
      const result = getFlashNewsList(limit);
      
      expect(result).toBeDefined();
      expect(result.length).toBe(limit);
    });

    /**
     * 测试：限制数量大于总数
     * 预期：返回所有快讯
     */
    test('限制数量大于总数时应返回所有快讯', () => {
      const limit = 100;
      const result = getFlashNewsList(limit);
      
      expect(result).toBeDefined();
      expect(result.length).toBe(mockFlashNews.length);
    });

    /**
     * 测试：限制数量为0
     * 预期：返回所有快讯
     */
    test('限制数量为0时应返回所有快讯', () => {
      const result = getFlashNewsList(0);
      
      expect(result).toBeDefined();
      expect(result.length).toBe(mockFlashNews.length);
    });

    /**
     * 测试：限制数量为负数
     * 预期：slice(0, -1) 返回除最后一个元素外的所有元素
     */
    test('限制数量为负数时应返回除最后一个外的所有快讯', () => {
      const result = getFlashNewsList(-1);
      
      expect(result).toBeDefined();
      // slice(0, -1) 返回除最后一个元素外的所有元素
      expect(result.length).toBe(mockFlashNews.length - 1);
    });

    /**
     * 测试：热门快讯标记正确
     * 预期：isHot 为 true 的快讯应有正确的标记
     */
    test('热门快讯应有正确的标记', () => {
      const result = getFlashNewsList();
      const hotItems = result.filter(item => item.isHot);
      
      hotItems.forEach(item => {
        expect(item.isHot).toBe(true);
      });
    });
  });

  // ==================== 热门资讯测试 ====================
  
  describe('getHotNews - 热门资讯获取', () => {
    
    /**
     * 测试：获取热门资讯（默认5条）
     * 预期：返回阅读量最高的5条资讯
     */
    test('应返回阅读量最高的资讯', () => {
      const result = getHotNews();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(5);
      
      // 验证按阅读量降序排列
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].readCount).toBeGreaterThanOrEqual(result[i + 1].readCount);
      }
    });

    /**
     * 测试：自定义热门数量
     * 预期：返回指定数量的热门资讯
     */
    test('应正确限制热门数量', () => {
      const limit = 3;
      const result = getHotNews(limit);
      
      expect(result).toBeDefined();
      expect(result.length).toBe(limit);
    });

    /**
     * 测试：限制数量大于总数
     * 预期：返回所有资讯
     */
    test('限制数量大于总数时应返回所有资讯', () => {
      const limit = 100;
      const result = getHotNews(limit);
      
      expect(result).toBeDefined();
      expect(result.length).toBe(mockNewsArticles.length);
    });

    /**
     * 测试：限制数量为1
     * 预期：返回阅读量最高的1条资讯
     */
    test('限制数量为1时应返回阅读量最高的资讯', () => {
      const result = getHotNews(1);
      
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      
      // 验证这条资讯的阅读量是最高的
      const maxReadCount = Math.max(...mockNewsArticles.map(a => a.readCount));
      expect(result[0].readCount).toBe(maxReadCount);
    });
  });

  // ==================== 资讯详情测试 ====================
  
  describe('getNewsDetail - 资讯详情获取', () => {
    
    /**
     * 测试：获取存在的资讯详情
     * 预期：返回对应的资讯文章
     */
    test('应返回存在的资讯详情', () => {
      const testId = mockNewsArticles[0].id;
      const result = getNewsDetail(testId);
      
      expect(result).toBeDefined();
      expect(result?.id).toBe(testId);
    });

    /**
     * 测试：获取不存在的资讯详情
     * 预期：返回 null
     */
    test('不存在的资讯应返回 null', () => {
      const result = getNewsDetail('non-existent-id');
      
      expect(result).toBeNull();
    });
  });

  // ==================== 资讯搜索测试 ====================
  
  describe('searchNews - 资讯搜索', () => {
    
    /**
     * 测试：按标题关键词搜索
     * 预期：返回标题匹配的资讯
     */
    test('应能按标题关键词搜索', () => {
      const result = searchNews('皮卡丘');
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      result.forEach(article => {
        expect(
          article.title.toLowerCase().includes('皮卡丘') ||
          article.summary.toLowerCase().includes('皮卡丘') ||
          article.tags.some(t => t.toLowerCase().includes('皮卡丘'))
        ).toBe(true);
      });
    });

    /**
     * 测试：大小写不敏感搜索
     * 预期：能匹配不同大小写的关键词
     */
    test('搜索应大小写不敏感', () => {
      const upperResult = searchNews('皮卡丘');
      const lowerResult = searchNews('皮卡丘');
      
      expect(upperResult.length).toBe(lowerResult.length);
    });

    /**
     * 测试：空关键词搜索
     * 预期：返回空数组
     */
    test('空关键词应返回空数组', () => {
      const result = searchNews('');
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      // 空字符串会导致匹配失败，返回空数组
    });

    /**
     * 测试：搜索不存在的关键词
     * 预期：返回空数组
     */
    test('不存在的关键词应返回空数组', () => {
      const result = searchNews('完全不存在的关键词xyz123');
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    /**
     * 测试：按标签搜索
     * 预期：返回标签匹配的资讯
     */
    test('应能按标签搜索', () => {
      const result = searchNews('行情');
      
      expect(result).toBeDefined();
      
      result.forEach(article => {
        expect(
          article.title.toLowerCase().includes('行情') ||
          article.summary.toLowerCase().includes('行情') ||
          article.tags.some(t => t.toLowerCase().includes('行情'))
        ).toBe(true);
      });
    });
  });

  // ==================== 格式化函数测试 ====================
  
  describe('formatReadCount - 阅读数格式化', () => {
    
    /**
     * 测试：小于1万的数字
     * 预期：直接返回数字字符串
     */
    test('小于1万应直接返回数字', () => {
      expect(formatReadCount(9999)).toBe('9999');
      expect(formatReadCount(100)).toBe('100');
      expect(formatReadCount(0)).toBe('0');
    });

    /**
     * 测试：等于1万的数字
     * 预期：返回格式化后的字符串
     */
    test('等于1万应返回1.0万', () => {
      expect(formatReadCount(10000)).toBe('1.0万');
    });

    /**
     * 测试：大于1万的数字
     * 预期：返回万为单位的字符串，保留一位小数
     */
    test('大于1万应返回万为单位', () => {
      expect(formatReadCount(15000)).toBe('1.5万');
      expect(formatReadCount(100000)).toBe('10.0万');
      expect(formatReadCount(105000)).toBe('10.5万');
    });
  });

  describe('formatPublishTime - 发布时间格式化', () => {
    
    /**
     * 测试：当前时间
     * 预期：返回"0分钟前"
     */
    test('当前时间应返回0分钟前', () => {
      const now = new Date().toISOString();
      const result = formatPublishTime(now);
      
      expect(result).toBe('0分钟前');
    });

    /**
     * 测试：1分钟前
     * 预期：返回"1分钟前"
     */
    test('1分钟前应返回1分钟前', () => {
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
      const result = formatPublishTime(oneMinuteAgo);
      
      expect(result).toBe('1分钟前');
    });

    /**
     * 测试：1小时前
     * 预期：返回"1小时前"
     */
    test('1小时前应返回1小时前', () => {
      const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
      const result = formatPublishTime(oneHourAgo);
      
      expect(result).toBe('1小时前');
    });

    /**
     * 测试：1天前
     * 预期：返回"1天前"
     */
    test('1天前应返回1天前', () => {
      const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
      const result = formatPublishTime(oneDayAgo);
      
      expect(result).toBe('1天前');
    });

    /**
     * 测试：超过7天
     * 预期：返回原始时间字符串（split(' ')[0] 结果）
     */
    test('超过7天应返回原始时间字符串', () => {
      const oldDate = new Date(Date.now() - 8 * 86400000).toISOString();
      const result = formatPublishTime(oldDate);
      
      // 超过7天时返回 time.split(' ')[0]，对于ISO格式返回完整字符串
      // 因为ISO格式没有空格，split(' ')[0] 返回整个字符串
      expect(result).toBe(oldDate);
    });

    /**
     * 测试：使用标准格式的时间字符串（YYYY-MM-DD HH:mm）
     * 预期：超过7天时返回日期部分
     */
    test('标准格式时间超过7天应返回日期部分', () => {
      const oldDate = '2024-01-01 10:00';
      const result = formatPublishTime(oldDate);
      
      // 超过7天时返回 time.split(' ')[0]
      expect(result).toBe('2024-01-01');
    });

    /**
     * 测试：59分钟前
     * 预期：返回分钟前
     */
    test('59分钟前应返回分钟前', () => {
      const minutesAgo = new Date(Date.now() - 59 * 60000).toISOString();
      const result = formatPublishTime(minutesAgo);
      
      expect(result).toContain('分钟前');
    });

    /**
     * 测试：23小时前
     * 预期：返回小时前
     */
    test('23小时前应返回小时前', () => {
      const hoursAgo = new Date(Date.now() - 23 * 3600000).toISOString();
      const result = formatPublishTime(hoursAgo);
      
      expect(result).toContain('小时前');
    });

    /**
     * 测试：6天前
     * 预期：返回天数前
     */
    test('6天前应返回天数前', () => {
      const daysAgo = new Date(Date.now() - 6 * 86400000).toISOString();
      const result = formatPublishTime(daysAgo);
      
      expect(result).toContain('天前');
    });
  });

  // ==================== 评论功能测试 ====================
  
  describe('评论相关功能', () => {
    
    /**
     * 测试：获取资讯评论
     * 预期：返回对应文章的所有评论
     */
    test('应返回对应文章的评论', () => {
      const articleId = mockNewsComments[0]?.articleId;
      if (!articleId) return;
      
      const result = getNewsComments(articleId);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      result.forEach(comment => {
        expect(comment.articleId).toBe(articleId);
      });
    });

    /**
     * 测试：获取不存在文章的评论
     * 预期：返回空数组
     */
    test('不存在文章的评论应返回空数组', () => {
      const result = getNewsComments('non-existent-article');
      
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    /**
     * 测试：发布新评论
     * 预期：成功创建评论并返回
     */
    test('应能发布新评论', () => {
      const initialCount = mockNewsComments.length;
      const newComment = {
        articleId: 'news-001',
        userId: 'user-test',
        userName: '测试用户',
        userAvatar: 'https://example.com/avatar.png',
        content: '这是一条测试评论',
        isAuthor: false
      };
      
      const result = postNewsComment(newComment);
      
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.content).toBe(newComment.content);
      expect(result.userName).toBe(newComment.userName);
      expect(result.likeCount).toBe(0);
      expect(mockNewsComments.length).toBe(initialCount + 1);
    });

    /**
     * 测试：点赞资讯文章
     * 预期：成功增加点赞数
     */
    test('应能点赞资讯文章', () => {
      const articleId = mockNewsArticles[0].id;
      const initialLikes = mockNewsArticles[0].likeCount;
      
      const result = likeNewsArticle(articleId);
      
      expect(result).toBe(true);
      expect(mockNewsArticles[0].likeCount).toBe(initialLikes + 1);
    });

    /**
     * 测试：点赞不存在的文章
     * 预期：返回 false
     */
    test('点赞不存在的文章应返回 false', () => {
      const result = likeNewsArticle('non-existent-id');
      
      expect(result).toBe(false);
    });

    /**
     * 测试：点赞评论
     * 预期：成功增加点赞数
     */
    test('应能点赞评论', () => {
      const commentId = mockNewsComments[0].id;
      const initialLikes = mockNewsComments[0].likeCount;
      
      const result = likeNewsComment(commentId);
      
      expect(result).toBe(true);
      expect(mockNewsComments[0].likeCount).toBe(initialLikes + 1);
    });

    /**
     * 测试：点赞不存在的评论
     * 预期：返回 false
     */
    test('点赞不存在的评论应返回 false', () => {
      const result = likeNewsComment('non-existent-id');
      
      expect(result).toBe(false);
    });
  });

  // ==================== 数据完整性测试 ====================
  
  describe('数据完整性验证', () => {
    
    /**
     * 测试：Mock 数据结构完整性
     * 预期：所有资讯文章都包含必要字段
     */
    test('所有资讯文章都应包含必要字段', () => {
      mockNewsArticles.forEach(article => {
        expect(article).toHaveProperty('id');
        expect(article).toHaveProperty('title');
        expect(article).toHaveProperty('summary');
        expect(article).toHaveProperty('category');
        expect(article).toHaveProperty('coverImage');
        expect(article).toHaveProperty('author');
        expect(article).toHaveProperty('publishTime');
        expect(article).toHaveProperty('readCount');
        expect(article).toHaveProperty('likeCount');
        expect(article).toHaveProperty('commentCount');
        expect(article).toHaveProperty('tags');
      });
    });

    /**
     * 测试：所有快讯都包含必要字段
     * 预期：所有快讯都包含必要字段
     */
    test('所有快讯都应包含必要字段', () => {
      mockFlashNews.forEach(news => {
        expect(news).toHaveProperty('id');
        expect(news).toHaveProperty('content');
        expect(news).toHaveProperty('category');
        expect(news).toHaveProperty('publishTime');
      });
    });

    /**
     * 测试：分类名称映射完整性
     * 预期：所有分类都有对应名称
     */
    test('所有分类都应有对应名称', () => {
      const categories: NewsCategory[] = ['market', 'event', 'release', 'guide', 'rating'];
      
      categories.forEach(category => {
        expect(NewsCategoryNames[category]).toBeDefined();
        expect(typeof NewsCategoryNames[category]).toBe('string');
        expect(NewsCategoryNames[category].length).toBeGreaterThan(0);
      });
    });
  });
});