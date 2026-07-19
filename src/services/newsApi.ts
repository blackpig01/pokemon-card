// 卡牌资讯 API 服务

import {
  NewsArticle,
  FlashNews,
  NewsComment,
  NewsCategory,
  mockNewsArticles,
  mockFlashNews,
  mockNewsComments
} from '@/data/news';

// 获取快讯列表
export const getFlashNewsList = (limit?: number): FlashNews[] => {
  const sortedNews = [...mockFlashNews].sort((a, b) => {
    // 热门优先
    if (a.isHot && !b.isHot) return -1;
    if (!a.isHot && b.isHot) return 1;
    // 然后按时间排序
    return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
  });
  
  return limit ? sortedNews.slice(0, limit) : sortedNews;
};

// 获取资讯文章列表
export const getNewsArticles = (category?: NewsCategory): NewsArticle[] => {
  let articles = [...mockNewsArticles];
  
  if (category) {
    articles = articles.filter(a => a.category === category);
  }
  
  // 按发布时间排序
  return articles.sort((a, b) => 
    new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
  );
};

// 获取热门资讯
export const getHotNews = (limit: number = 5): NewsArticle[] => {
  return [...mockNewsArticles]
    .sort((a, b) => b.readCount - a.readCount)
    .slice(0, limit);
};

// 获取资讯详情
export const getNewsDetail = (id: string): NewsArticle | null => {
  return mockNewsArticles.find(a => a.id === id) || null;
};

// 获取资讯评论
export const getNewsComments = (articleId: string): NewsComment[] => {
  return mockNewsComments
    .filter(c => c.articleId === articleId)
    .sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime());
};

// 发布资讯评论
export const postNewsComment = (comment: Omit<NewsComment, 'id' | 'publishTime' | 'likeCount'>): NewsComment => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  const newComment: NewsComment = {
    ...comment,
    id: `comment-${Date.now()}`,
    publishTime: `${year}-${month}-${day} ${hours}:${minutes}`,
    likeCount: 0
  };
  
  mockNewsComments.unshift(newComment);
  return newComment;
};

// 点赞资讯文章
export const likeNewsArticle = (id: string): boolean => {
  const article = mockNewsArticles.find(a => a.id === id);
  if (article) {
    article.likeCount += 1;
    return true;
  }
  return false;
};

// 点赞评论
export const likeNewsComment = (commentId: string): boolean => {
  const comment = mockNewsComments.find(c => c.id === commentId);
  if (comment) {
    comment.likeCount += 1;
    return true;
  }
  return false;
};

// 搜索资讯
export const searchNews = (keyword: string): NewsArticle[] => {
  const lowerKeyword = keyword.toLowerCase();
  return mockNewsArticles.filter(a => 
    a.title.toLowerCase().includes(lowerKeyword) ||
    a.summary.toLowerCase().includes(lowerKeyword) ||
    a.tags.some(t => t.toLowerCase().includes(lowerKeyword))
  );
};

// 格式化阅读数
export const formatReadCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`;
  }
  return `${count}`;
};

// 格式化发布时间
export const formatPublishTime = (time: string): string => {
  const date = new Date(time);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) {
    return `${minutes}分钟前`;
  }
  if (hours < 24) {
    return `${hours}小时前`;
  }
  if (days < 7) {
    return `${days}天前`;
  }
  return time.split(' ')[0];
};