// 卡牌资讯数据类型

// 资讯分类
export type NewsCategory = 'market' | 'event' | 'release' | 'guide' | 'rating';

// 资讯分类名称映射
export const NewsCategoryNames: Record<NewsCategory, string> = {
  market: '行情分析',
  event: '赛事资讯',
  release: '新品发布',
  guide: '新手指南',
  rating: '评级讨论'
};

// 资讯文章
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  coverImage: string;
  author: string;
  publishTime: string;
  readCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  relatedCards?: string[]; // 相关卡牌ID
  source?: string; // 来源
}

// 快讯（短资讯）
export interface FlashNews {
  id: string;
  content: string;
  category: NewsCategory;
  publishTime: string;
  source?: string;
  relatedCard?: string; // 相关联卡牌名称
  isHot?: boolean; // 是否热门
}

// 资讯评论
export interface NewsComment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  publishTime: string;
  likeCount: number;
  isAuthor?: boolean; // 是否作者本人
}

// Mock 资讯数据
export const mockNewsArticles: NewsArticle[] = [
  {
    id: 'news-001',
    title: '皮卡丘 illustration Rare 价格突破历史新高',
    summary: '最近皮卡丘 illustration Rare 卡牌在二手市场价格持续走高，PSA10评级版本已突破8000元大关...',
    content: `
最近皮卡丘 illustration Rare 卡牌在二手市场价格持续走高，PSA10评级版本已突破8000元大关。

**市场分析：**
- 近一个月涨幅达到35%
- 主要受到限量发售和收藏热度影响
- PSA10版本成交量明显增加

**专家观点：**
知名卡牌收藏家表示，这张卡牌的升值空间依然很大，建议有收藏意向的玩家尽早入手。

**相关卡牌：**
- 皮卡丘 illustration Rare
- 皮卡丘 VMAX
- 皮卡丘 V
    `,
    category: 'market',
    coverImage: 'https://picsum.photos/400/250?random=1',
    author: '卡牌分析师',
    publishTime: '2024-01-15 10:30',
    readCount: 3520,
    likeCount: 156,
    commentCount: 42,
    tags: ['皮卡丘', '行情', '升值'],
    relatedCards: ['card-001']
  },
  {
    id: 'news-002',
    title: '2024宝可梦卡牌世界锦标赛即将开幕',
    summary: '2024年宝可梦卡牌世界锦标赛将于8月在美国洛杉矶举行，预计将有来自全球各地的顶尖选手参赛...',
    content: `
2024年宝可梦卡牌世界锦标赛将于8月在美国洛杉矶举行，预计将有来自全球各地的顶尖选手参赛。

**赛事信息：**
- 时间：2024年8月15-18日
- 地点：美国洛杉矶会议中心
- 参赛选手：来自50+国家和地区的顶尖选手

**中国选手：**
今年将有5位中国选手参赛，包括去年亚洲赛区冠军张明。

**奖金池：**
总奖金池达到50万美元，冠军将获得15万美元。
    `,
    category: 'event',
    coverImage: 'https://picsum.photos/400/250?random=2',
    author: '赛事报道员',
    publishTime: '2024-01-14 18:00',
    readCount: 2845,
    likeCount: 89,
    commentCount: 28,
    tags: ['世界锦标赛', '赛事', '2024']
  },
  {
    id: 'news-003',
    title: '新系列「 Scarlet & Violet 」正式发布',
    summary: '宝可梦官方发布了最新卡牌系列「 Scarlet & Violet 」，包含超过200张全新卡牌设计...',
    content: `
宝可梦官方发布了最新卡牌系列「 Scarlet & Violet 」，包含超过200张全新卡牌设计。

**系列亮点：**
- 新增「宝可梦 illustration Rare」稀有卡牌
- 引入全新机制「古代宝可梦」和「未来宝可梦」
- 首批限量版包含特典卡

**热门卡牌：**
- 喷火龙 illustration Rare（预计价格5000+）
- 妙蛙花 ex
- 水箭龟 ex

**发售渠道：**
各大卡牌店和线上商城均已开始预售。
    `,
    category: 'release',
    coverImage: 'https://picsum.photos/400/250?random=3',
    author: '新品观察员',
    publishTime: '2024-01-13 09:00',
    readCount: 4120,
    likeCount: 234,
    commentCount: 67,
    tags: ['新系列', 'Scarlet&Violet', '发售']
  },
  {
    id: 'news-004',
    title: '新手入门：如何选择第一张收藏卡牌',
    summary: '对于刚接触宝可梦卡牌收藏的新手来说，选择第一张收藏卡牌往往令人困惑...',
    content: `
对于刚接触宝可梦卡牌收藏的新手来说，选择第一张收藏卡牌往往令人困惑。

**入门建议：**

1. **选择热门卡牌**
   - 皮卡丘系列卡牌最受欢迎
   - 喷火龙系列保值性好
   
2. **注意卡牌状态**
   - PSA评级卡牌更保值
   - 无评级卡牌需仔细检查是否有划痕

3. **控制预算**
   - 建议新手从100-500元价位开始
   - 不要盲目追求高价卡牌

4. **学习基础知识**
   - 了解卡牌稀有度分类
   - 熟悉各大系列特点
    `,
    category: 'guide',
    coverImage: 'https://picsum.photos/400/250?random=4',
    author: '收藏导师',
    publishTime: '2024-01-12 14:30',
    readCount: 1890,
    likeCount: 78,
    commentCount: 23,
    tags: ['新手', '入门', '收藏']
  },
  {
    id: 'news-005',
    title: 'PSA评级注意事项详解',
    summary: 'PSA评级是卡牌收藏中非常重要的一环，了解评级标准可以帮助你更好地保护卡牌价值...',
    content: `
PSA评级是卡牌收藏中非常重要的一环，了解评级标准可以帮助你更好地保护卡牌价值。

**PSA评级等级：**
- PSA 10：完美状态，无任何瑕疵
- PSA 9：优秀状态，仅有轻微瑕疵
- PSA 8：良好状态，有可见但不影响整体的瑕疵

**评级注意事项：**

1. **送评前检查**
   - 确保卡牌表面清洁
   - 检查是否有划痕、折痕
   
2. **保护措施**
   - 使用卡套保护
   - 避免阳光直射
   
3. **评级周期**
   - 普通评级约需15-30天
   - 快速评级服务额外收费
    `,
    category: 'rating',
    coverImage: 'https://picsum.photos/400/250?random=5',
    author: '评级专家',
    publishTime: '2024-01-11 16:00',
    readCount: 2340,
    likeCount: 112,
    commentCount: 35,
    tags: ['PSA', '评级', '保值']
  },
  {
    id: 'news-006',
    title: '喷火龙 VMAX 价格走势分析',
    summary: '喷火龙 VMAX 作为系列核心卡牌，其价格走势一直备受关注...',
    content: `
喷火龙 VMAX 作为系列核心卡牌，其价格走势一直备受关注。

**近期走势：**
- PSA10版本价格稳定在4500-5000元区间
- 无评级版本价格约在800-1200元

**影响因素：**
- 新系列发布带来的热度
- 赛事使用频率
- 收藏市场需求变化

**投资建议：**
短期持有风险较低，长期升值空间取决于系列整体热度。
    `,
    category: 'market',
    coverImage: 'https://picsum.photos/400/250?random=6',
    author: '行情分析师',
    publishTime: '2024-01-10 11:30',
    readCount: 3120,
    likeCount: 145,
    commentCount: 48,
    tags: ['喷火龙', '行情', 'VMAX'],
    relatedCards: ['card-002']
  }
];

// Mock 快讯数据
export const mockFlashNews: FlashNews[] = [
  {
    id: 'flash-001',
    content: '🔥 皮卡丘 illustration Rare 今日成交价突破8000元，创历史新高！',
    category: 'market',
    publishTime: '2024-01-15 15:30',
    source: '卡牌交易网',
    relatedCard: '皮卡丘 illustration Rare',
    isHot: true
  },
  {
    id: 'flash-002',
    content: '📢 宝可梦官方宣布将于下月发布「151系列」复刻版卡牌',
    category: 'release',
    publishTime: '2024-01-15 12:00',
    source: '官方公告'
  },
  {
    id: 'flash-003',
    content: '🏆 中国选手张明获得亚洲赛区冠军，将代表中国参加世界锦标赛',
    category: 'event',
    publishTime: '2024-01-14 20:30',
    source: '赛事官方',
    isHot: true
  },
  {
    id: 'flash-004',
    content: '⚠️ PSA评级费用将于2月1日起上调10%，建议尽快送评',
    category: 'rating',
    publishTime: '2024-01-14 09:00',
    source: 'PSA官方'
  },
  {
    id: 'flash-005',
    content: '💡 新手注意：购买卡牌时请认准官方授权店铺，避免假卡',
    category: 'guide',
    publishTime: '2024-01-13 18:00',
    source: '卡牌协会'
  },
  {
    id: 'flash-006',
    content: '📈 喷火龙 VMAX PSA10 近一周成交量达50张，市场需求旺盛',
    category: 'market',
    publishTime: '2024-01-13 10:00',
    source: '市场监测',
    relatedCard: '喷火龙 VMAX'
  },
  {
    id: 'flash-007',
    content: '🎉 「Scarlet & Violet」系列预售开启，首批限量10000套',
    category: 'release',
    publishTime: '2024-01-12 08:00',
    source: '官方商城',
    isHot: true
  },
  {
    id: 'flash-008',
    content: '📊 最新统计：国内宝可梦卡牌收藏爱好者已超过50万人',
    category: 'market',
    publishTime: '2024-01-11 16:00',
    source: '行业报告'
  }
];

// Mock 资讯评论数据
export const mockNewsComments: NewsComment[] = [
  {
    id: 'comment-001',
    articleId: 'news-001',
    userId: 'user-001',
    userName: '卡牌收藏家',
    userAvatar: 'https://picsum.photos/50/50?random=10',
    content: '这张卡确实值得收藏，我去年买的PSA10版本已经涨了2000元',
    publishTime: '2024-01-15 11:00',
    likeCount: 23,
    isAuthor: false
  },
  {
    id: 'comment-002',
    articleId: 'news-001',
    userId: 'user-002',
    userName: '新手玩家',
    userAvatar: 'https://picsum.photos/50/50?random=11',
    content: '新手可以入手吗？价格有点高',
    publishTime: '2024-01-15 11:30',
    likeCount: 5,
    isAuthor: false
  },
  {
    id: 'comment-003',
    articleId: 'news-002',
    userId: 'user-003',
    userName: '赛事关注者',
    userAvatar: 'https://picsum.photos/50/50?random=12',
    content: '期待张明的表现！希望能为中国夺冠！',
    publishTime: '2024-01-14 19:00',
    likeCount: 45,
    isAuthor: false
  }
];