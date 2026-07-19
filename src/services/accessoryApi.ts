/**
 * 卡盒及周边商品 API 服务
 */
import { 
  AccessoryProduct, 
  AccessoryCategory,
  CategoryInfo,
  HotAccessory,
  DanmakuMessage,
  Comment,
  accessoryProducts,
  CATEGORIES,
  mockDanmakuMessages,
  mockComments
} from '@/data/accessories';

// 模拟 API 延迟的辅助函数（减少延迟时间避免超时）
const simulateDelay = (ms: number = 50): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 获取所有卡盒商品
 */
export const getAccessoryProducts = async (): Promise<AccessoryProduct[]> => {
  await simulateDelay(50);
  return accessoryProducts;
};

/**
 * 获取商品分类列表
 */
export const getCategories = async (): Promise<CategoryInfo[]> => {
  await simulateDelay(30);
  
  // 计算每个分类的商品数量
  return CATEGORIES.map(cat => ({
    ...cat,
    count: accessoryProducts.filter(p => p.category === cat.key).length
  }));
};

/**
 * 按分类获取商品
 */
export const getProductsByCategory = async (
  category: AccessoryCategory
): Promise<AccessoryProduct[]> => {
  await simulateDelay(50);
  return accessoryProducts.filter(p => p.category === category);
};

/**
 * 获取商品详情
 */
export const getAccessoryDetail = async (
  productId: string
): Promise<AccessoryProduct | null> => {
  await simulateDelay(50);
  return accessoryProducts.find(p => p.id === productId) || null;
};

/**
 * 搜索商品
 */
export const searchAccessories = async (
  keyword: string,
  filters?: {
    category?: AccessoryCategory;
    priceRange?: [number, number];
    sortBy?: 'price' | 'sales' | 'rating';
    sortOrder?: 'asc' | 'desc';
  }
): Promise<AccessoryProduct[]> => {
  await simulateDelay(50);
  
  let results = [...accessoryProducts];
  
  // 关键词搜索
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(lowerKeyword) ||
      p.description.toLowerCase().includes(lowerKeyword) ||
      p.tags.some(t => t.toLowerCase().includes(lowerKeyword))
    );
  }
  
  // 分类筛选
  if (filters?.category) {
    results = results.filter(p => p.category === filters.category);
  }
  
  // 价格区间筛选
  if (filters?.priceRange) {
    const [min, max] = filters.priceRange;
    results = results.filter(p => p.price >= min && p.price <= max);
  }
  
  // 排序
  if (filters?.sortBy) {
    results.sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      if (filters.sortBy === 'price') {
        return (a.price - b.price) * order;
      } else if (filters.sortBy === 'sales') {
        return (a.sales - b.sales) * order;
      } else if (filters.sortBy === 'rating') {
        return (a.rating - b.rating) * order;
      }
      return 0;
    });
  }
  
  return results;
};

/**
 * 获取热销榜单
 */
export const getHotAccessories = async (limit: number = 10): Promise<HotAccessory[]> => {
  await simulateDelay(50);
  
  // 计算综合热度分数 = 销量 * 0.4 + 好评率 * 100 * 0.3 + 浏览量 * 0.3
  const scored = accessoryProducts.map(product => ({
    rank: 0,
    product,
    hotScore: product.sales * 0.4 + product.rating * 100 * 0.3 + (product.isHot ? 1000 : 0) * 0.3
  }));
  
  // 按热度排序
  scored.sort((a, b) => b.hotScore - a.hotScore);
  
  // 添加排名
  return scored.slice(0, limit).map((item, index) => ({
    ...item,
    rank: index + 1
  }));
};

/**
 * 获取推荐商品
 */
export const getRecommendedAccessories = async (limit: number = 4): Promise<AccessoryProduct[]> => {
  await simulateDelay(50);
  
  const recommended = accessoryProducts.filter(p => p.isRecommend);
  return recommended.slice(0, limit);
};

/**
 * 获取新品列表
 */
export const getNewAccessories = async (limit: number = 6): Promise<AccessoryProduct[]> => {
  await simulateDelay(50);
  
  const news = accessoryProducts.filter(p => p.isNew);
  if (news.length < limit) {
    // 如果新品不足，补充热销商品
    return [...news, ...accessoryProducts.filter(p => !p.isNew).slice(0, limit - news.length)];
  }
  return news.slice(0, limit);
};

// ==================== 弹幕系统 API ====================

/**
 * 获取弹幕消息
 */
export const getDanmakuMessages = async (cardId: string): Promise<DanmakuMessage[]> => {
  await simulateDelay(30);
  // 返回最近10条弹幕
  return mockDanmakuMessages.slice(-10);
};

/**
 * 发送弹幕
 */
export const sendDanmaku = async (
  cardId: string,
  content: string,
  userName: string = '匿名用户'
): Promise<DanmakuMessage> => {
  await simulateDelay(20);
  
  const newDanmaku: DanmakuMessage = {
    id: `dm-${Date.now()}`,
    userId: `user-${Date.now()}`,
    userName,
    content,
    timestamp: Date.now(),
    color: getRandomColor(),
    type: 'danmaku'
  };
  
  mockDanmakuMessages.push(newDanmaku);
  
  // 保持最多50条弹幕
  if (mockDanmakuMessages.length > 50) {
    mockDanmakuMessages.shift();
  }
  
  return newDanmaku;
};

// ==================== 评论系统 API ====================

/**
 * 获取卡牌评论
 */
export const getCardComments = async (
  cardId: string,
  filters?: {
    tag?: string;
    sortBy?: 'likes' | 'time';
  }
): Promise<Comment[]> => {
  await simulateDelay(50);
  
  let comments = mockComments.filter(c => c.cardId === cardId);
  
  // 标签筛选
  if (filters?.tag) {
    comments = comments.filter(c => c.tags.includes(filters.tag!));
  }
  
  // 排序
  if (filters?.sortBy === 'likes') {
    comments.sort((a, b) => b.likes - a.likes);
  } else {
    // 默认按时间倒序，置顶评论优先
    comments.sort((a, b) => {
      if (a.isTop && !b.isTop) return -1;
      if (!a.isTop && b.isTop) return 1;
      return 0;
    });
  }
  
  return comments;
};

/**
 * 发布评论
 */
export const postComment = async (
  cardId: string,
  content: string,
  userName: string = '匿名用户',
  tags: string[] = []
): Promise<Comment> => {
  await simulateDelay(50);
  
  const newComment: Comment = {
    id: `cmt-${Date.now()}`,
    userId: `user-${Date.now()}`,
    userName,
    cardId,
    content,
    tags,
    likes: 0,
    dislikes: 0,
    replies: 0,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  };
  
  mockComments.unshift(newComment);
  return newComment;
};

/**
 * 点赞评论
 */
export const likeComment = async (commentId: string): Promise<boolean> => {
  await simulateDelay(30);
  
  const comment = mockComments.find(c => c.id === commentId);
  if (comment) {
    if (comment.isLiked) {
      comment.likes--;
      comment.isLiked = false;
    } else {
      comment.likes++;
      comment.isLiked = true;
      // 取消踩
      if (comment.isDisliked) {
        comment.dislikes--;
        comment.isDisliked = false;
      }
    }
  }
  
  return true;
};

/**
 * 点踩评论
 */
export const dislikeComment = async (commentId: string): Promise<boolean> => {
  await simulateDelay(30);
  
  const comment = mockComments.find(c => c.id === commentId);
  if (comment) {
    if (comment.isDisliked) {
      comment.dislikes--;
      comment.isDisliked = false;
    } else {
      comment.dislikes++;
      comment.isDisliked = true;
      // 取消赞
      if (comment.isLiked) {
        comment.likes--;
        comment.isLiked = false;
      }
    }
  }
  
  return true;
};

// ==================== 工具函数 ====================

/**
 * 获取随机弹幕颜色
 */
const getRandomColor = (): string => {
  const colors = [
    '#FFD93D', // 黄色
    '#00B42A', // 绿色
    '#165DFF', // 蓝色
    '#F53F3F', // 红色
    '#722ED1', // 紫色
    '#F53F3F', // 橙色
    '#0FC6C2', // 青色
    '#EB0AA4', // 粉色
    '#FFFFFF', // 白色
    '#7F7F7F'  // 灰色
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * 格式化销量
 */
export const formatSales = (sales: number): string => {
  if (sales >= 10000) {
    return `${(sales / 10000).toFixed(1)}万`;
  }
  return sales.toString();
};

/**
 * 格式化折扣
 */
export const formatDiscount = (discount: number): string => {
  return `${Math.round(discount * 10)}折`;
};
