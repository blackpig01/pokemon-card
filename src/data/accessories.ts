/**
 * 卡盒及周边商品类型定义
 */

/**
 * 卡盒商品分类
 */
export type AccessoryCategory = 
  | 'storage_box'      // 卡牌收纳盒
  | 'custom_box'       // 定制与高端卡盒
  | 'portable_case'    // 便携卡盒
  | 'sleeve'           // 卡套
  | 'binder'           // 卡册
  | 'accessory_other'; // 其他周边

/**
 * 商品材质
 */
export type Material = 
  | 'acrylic'          // 亚克力
  | 'aluminum'         // 铝合金
  | 'pp_new'           // PP新料
  | 'abs'              // ABS塑料
  | 'metal'            // 金属
  | 'leather';         // 皮革

/**
 * 卡盒商品接口
 */
export interface AccessoryProduct {
  id: string;
  name: string;                      // 商品名称
  category: AccessoryCategory;       // 分类
  material: Material;                // 材质
  price: number;                    // 当前价格
  originalPrice?: number;            // 原价（用于显示折扣）
  discount?: number;                 // 折扣率
  sales: number;                     // 销量
  rating: number;                    // 好评率
  stock: number;                     // 库存
  images: string[];                  // 商品图片
  description: string;               // 商品描述
  features: string[];                // 核心特点
  specifications: Record<string, string>; // 规格参数
  market: 'domestic' | 'japan' | 'american'; // 市场来源
  tags: string[];                   // 商品标签
  isHot?: boolean;                   // 是否热销
  isNew?: boolean;                   // 是否新品
  isRecommend?: boolean;             // 是否推荐
  createdAt: string;                // 上架时间
  updatedAt: string;                 // 更新时间
}

/**
 * 商品分类信息
 */
export interface CategoryInfo {
  key: AccessoryCategory;
  name: string;
  icon: string;
  description: string;
  count: number;
}

/**
 * 热销榜单商品
 */
export interface HotAccessory {
  rank: number;
  product: AccessoryProduct;
  hotScore: number;  // 综合热度分数
}

/**
 * 弹幕消息
 */
export interface DanmakuMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: number;
  color?: string;    // 弹幕颜色
  type: 'danmaku' | 'system';  // 弹幕类型
}

/**
 * 评论接口
 */
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  cardId: string;
  content: string;
  images?: string[];           // 评论图片
  tags: string[];              // 标签
  likes: number;               // 点赞数
  dislikes: number;            // 踩数
  replies: number;             // 回复数
  isTop?: boolean;              // 是否置顶
  isLiked?: boolean;            // 当前用户是否点赞
  isDisliked?: boolean;        // 当前用户是否点踩
  createdAt: string;
  updatedAt: string;
}

/**
 * 评论标签
 */
export const COMMENT_TAGS = [
  { key: 'market_analysis', label: '行情分析', color: '#FFD93D' },
  { key: 'buy_request', label: '求购', color: '#00B42A' },
  { key: 'sell', label: '出卡', color: '#165DFF' },
  { key: 'grade_discuss', label: '评级讨论', color: '#722ED1' },
  { key: 'collection', label: '收藏心得', color: '#F53F3F' },
  { key: 'question', label: '疑问解答', color: '#0FC6C2' }
];

/**
 * 分类列表
 */
export const CATEGORIES: CategoryInfo[] = [
  { 
    key: 'storage_box', 
    name: '收纳盒', 
    icon: '📦',
    description: '大容量、分格防尘收纳盒',
    count: 0
  },
  { 
    key: 'custom_box', 
    name: '高端定制', 
    icon: '💎',
    description: '金属铝合金、DIY刻字定制',
    count: 0
  },
  { 
    key: 'portable_case', 
    name: '便携卡盒', 
    icon: '🎒',
    description: '硬壳推拉式卡套卡盒',
    count: 0
  },
  { 
    key: 'sleeve', 
    name: '卡套', 
    icon: '🛡️',
    description: '保护卡牌的全透明卡套',
    count: 0
  },
  { 
    key: 'binder', 
    name: '卡册', 
    icon: '📒',
    description: '活页式卡册收集册',
    count: 0
  },
  { 
    key: 'accessory_other', 
    name: '其他周边', 
    icon: '🎁',
    description: '卡砖、展示架等周边',
    count: 0
  }
];

/**
 * Mock 卡盒商品数据
 */
export const accessoryProducts: AccessoryProduct[] = [
  {
    id: 'acc-001',
    name: '九宫格透明收纳盒（大容量版）',
    category: 'storage_box',
    material: 'acrylic',
    price: 89,
    originalPrice: 129,
    discount: 0.69,
    sales: 2580,
    rating: 4.8,
    stock: 356,
    images: [
      'https://picsum.photos/id/20/400/400',
      'https://picsum.photos/id/26/400/400',
      'https://picsum.photos/id/96/400/400'
    ],
    description: '九宫格分格设计，自带防尘盖，透明亚克力材质，可存放大量裸卡。每一格可放置约100张卡，非常适合收藏爱好者。',
    features: ['九宫格分区', '自带防尘盖', '透明可视', '大容量', '防压防摔'],
    specifications: {
      '材质': '优质亚克力',
      '尺寸': '30cm × 20cm × 15cm',
      '重量': '约1.2kg',
      '每格容量': '约100张卡',
      '适用': '宝可梦/游戏王/海贼王等集换式卡牌'
    },
    market: 'domestic',
    tags: ['防尘', '大容量', '九宫格', '透明'],
    isHot: true,
    isRecommend: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: 'acc-002',
    name: '铝合金金属卡盒（商务黑）',
    category: 'custom_box',
    material: 'aluminum',
    price: 299,
    originalPrice: 399,
    discount: 0.75,
    sales: 890,
    rating: 4.9,
    stock: 120,
    images: [
      'https://picsum.photos/id/119/400/400',
      'https://picsum.photos/id/129/400/400',
      'https://picsum.photos/id/139/400/400'
    ],
    description: '航空级铝合金材质，防潮防压防摔。支持DIY激光刻字定制，可刻上专属昵称或收藏编号。高端玩家的首选。',
    features: ['铝合金材质', '防潮防压', 'DIY刻字', '商务风格', '限量版'],
    specifications: {
      '材质': '航空级铝合金',
      '尺寸': '25cm × 15cm × 8cm',
      '重量': '约0.8kg',
      '容量': '约500张卡',
      '颜色': '商务黑/香槟金'
    },
    market: 'domestic',
    tags: ['金属', '高端', '防潮', '定制'],
    isHot: true,
    isNew: true,
    isRecommend: true,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15'
  },
  {
    id: 'acc-003',
    name: '硬壳便携卡盒（推拉式）',
    category: 'portable_case',
    material: 'abs',
    price: 49,
    originalPrice: 69,
    discount: 0.71,
    sales: 3560,
    rating: 4.7,
    stock: 890,
    images: [
      'https://picsum.photos/id/180/400/400',
      'https://picsum.photos/id/181/400/400',
      'https://picsum.photos/id/182/400/400'
    ],
    description: '硬壳保护，推拉式开合，方便外出对战或卡牌交换时携带。内置海绵垫层，有效防止卡牌碰撞损坏。',
    features: ['硬壳保护', '推拉开合', '内置海绵', '轻巧便携', '多色可选'],
    specifications: {
      '材质': 'ABS硬壳+海绵内衬',
      '尺寸': '18cm × 12cm × 5cm',
      '重量': '约0.3kg',
      '容量': '约80张卡',
      '颜色': '黑/白/红/蓝'
    },
    market: 'domestic',
    tags: ['便携', '硬壳', '轻便', '对战'],
    isHot: true,
    isRecommend: true,
    createdAt: '2023-12-20',
    updatedAt: '2024-01-14'
  },
  {
    id: 'acc-004',
    name: '亚克力翻盖展示盒',
    category: 'storage_box',
    material: 'acrylic',
    price: 59,
    originalPrice: 89,
    discount: 0.66,
    sales: 1680,
    rating: 4.6,
    stock: 234,
    images: [
      'https://picsum.photos/id/230/400/400',
      'https://picsum.photos/id/231/400/400',
      'https://picsum.photos/id/232/400/400'
    ],
    description: '翻盖式设计，方便拿取。透明亚克力材质，完美展示高人气RR/SR卡。适合放在桌面展示收藏。',
    features: ['翻盖设计', '透明展示', '桌面摆放', '防尘保护'],
    specifications: {
      '材质': '高透明亚克力',
      '尺寸': '25cm × 18cm × 6cm',
      '重量': '约0.6kg',
      '容量': '约120张卡',
      '适用': 'RR/SR/UR等稀有卡展示'
    },
    market: 'domestic',
    tags: ['展示', '翻盖', '桌面', '稀有卡'],
    isRecommend: true,
    createdAt: '2023-12-25',
    updatedAt: '2024-01-13'
  },
  {
    id: 'acc-005',
    name: 'PP新料加厚卡套（100张装）',
    category: 'sleeve',
    material: 'pp_new',
    price: 19.9,
    originalPrice: 29.9,
    discount: 0.67,
    sales: 8960,
    rating: 4.9,
    stock: 2340,
    images: [
      'https://picsum.photos/id/250/400/400',
      'https://picsum.photos/id/251/400/400',
      'https://picsum.photos/id/252/400/400'
    ],
    description: '采用PP新料制作，加厚设计，全透明不偏色。有效保护卡牌表面免受磨损。每包100张装，经济实惠。',
    features: ['PP新料', '加厚设计', '全透明', '防磨损', '100张装'],
    specifications: {
      '材质': 'PP新料',
      '尺寸': '标准卡牌尺寸',
      '厚度': '加厚版',
      '数量': '100张/包',
      '适用': '各类标准尺寸集换式卡牌'
    },
    market: 'domestic',
    tags: ['卡套', 'PP新料', '加厚', '实惠'],
    isHot: true,
    isRecommend: true,
    createdAt: '2023-11-15',
    updatedAt: '2024-01-10'
  },
  {
    id: 'acc-006',
    name: '活页卡册收藏册（20页）',
    category: 'binder',
    material: 'leather',
    price: 79,
    originalPrice: 99,
    discount: 0.80,
    sales: 1230,
    rating: 4.5,
    stock: 456,
    images: [
      'https://picsum.photos/id/270/400/400',
      'https://picsum.photos/id/271/400/400',
      'https://picsum.photos/id/272/400/400'
    ],
    description: '真皮活页卡册，20页设计，可容纳400张卡。采用优质内袋，不伤卡面。适合长期收藏整理。',
    features: ['真皮封面', '活页设计', '20页大容量', '优质内袋', '长期收藏'],
    specifications: {
      '材质': '真皮封面+PP内袋',
      '尺寸': '28cm × 22cm × 4cm',
      '重量': '约0.9kg',
      '容量': '约400张卡（20页）',
      '颜色': '棕色/黑色'
    },
    market: 'domestic',
    tags: ['卡册', '真皮', '活页', '收藏'],
    isRecommend: true,
    createdAt: '2023-12-10',
    updatedAt: '2024-01-12'
  },
  {
    id: 'acc-007',
    name: 'DIY刻字定制卡盒（激光雕刻）',
    category: 'custom_box',
    material: 'metal',
    price: 399,
    originalPrice: 499,
    discount: 0.80,
    sales: 320,
    rating: 5.0,
    stock: 45,
    images: [
      'https://picsum.photos/id/290/400/400',
      'https://picsum.photos/id/291/400/400',
      'https://picsum.photos/id/292/400/400'
    ],
    description: '支持激光雕刻DIY定制，可在盒盖上刻入专属文字、图案或卡组LOGO。高端定制，彰显个性。',
    features: ['DIY刻字', '激光雕刻', '个性定制', '高端礼盒', '限量供应'],
    specifications: {
      '材质': '优质金属',
      '尺寸': '28cm × 18cm × 10cm',
      '重量': '约1.5kg',
      '容量': '约600张卡',
      '定制内容': '文字/图案/LOGO'
    },
    market: 'domestic',
    tags: ['定制', 'DIY', '刻字', '高端'],
    isNew: true,
    isRecommend: true,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-15'
  },
  {
    id: 'acc-008',
    name: '亚克力卡砖展示架',
    category: 'accessory_other',
    material: 'acrylic',
    price: 39,
    originalPrice: 59,
    discount: 0.66,
    sales: 1890,
    rating: 4.7,
    stock: 567,
    images: [
      'https://picsum.photos/id/310/400/400',
      'https://picsum.photos/id/311/400/400',
      'https://picsum.photos/id/312/400/400'
    ],
    description: '高透明亚克力卡砖，可将单张珍稀卡牌独立展示。配合展示架，桌面陈列更美观。',
    features: ['卡砖设计', '高透明', '独立展示', '搭配展示架', '保护收藏'],
    specifications: {
      '材质': '高透明亚克力',
      '尺寸': '10cm × 8cm × 2cm',
      '重量': '约0.2kg',
      '容量': '单张卡牌',
      '适用': 'PSA/BGS评级卡展示'
    },
    market: 'domestic',
    tags: ['卡砖', '展示', '透明', '评级卡'],
    createdAt: '2023-12-28',
    updatedAt: '2024-01-11'
  }
];

/**
 * Mock 弹幕数据
 */
export const mockDanmakuMessages: DanmakuMessage[] = [
  { id: 'dm-001', userId: 'user-001', userName: '皮卡丘收藏家', content: 'PSA10稳如老狗', timestamp: Date.now() - 5000, color: '#FFD93D', type: 'danmaku' },
  { id: 'dm-002', userId: 'user-002', userName: '卡牌猎人', content: '这张卡要起飞了', timestamp: Date.now() - 3000, color: '#00B42A', type: 'danmaku' },
  { id: 'dm-003', userId: 'user-003', userName: '投资大师', content: '建议现在入手', timestamp: Date.now() - 1000, color: '#165DFF', type: 'danmaku' },
  { id: 'dm-004', userId: 'user-004', userName: '庄家控盘', content: '等等党永远不亏', timestamp: Date.now() - 500, color: '#F53F3F', type: 'danmaku' },
  { id: 'dm-005', userId: 'user-005', userName: '小白玩家', content: '求问PSA10多少钱入合适', timestamp: Date.now() - 200, color: '#722ED1', type: 'danmaku' }
];

/**
 * Mock 评论数据
 */
export const mockComments: Comment[] = [
  {
    id: 'cmt-001',
    userId: 'user-101',
    userName: '资深收藏家',
    userAvatar: 'https://picsum.photos/id/1/100/100',
    cardId: 'pikachu-vmax-001',
    content: '近期热门比赛卡组带火了这张卡，建议尽早入手。从历史走势来看，每次大赛后价格都会有明显上涨，现在入手正是好时机。',
    tags: ['market_analysis', 'collection'],
    likes: 328,
    dislikes: 12,
    replies: 45,
    isTop: true,
    createdAt: '2024-01-14 10:30',
    updatedAt: '2024-01-14 10:30'
  },
  {
    id: 'cmt-002',
    userId: 'user-102',
    userName: '评级专家',
    userAvatar: 'https://picsum.photos/id/2/100/100',
    cardId: 'pikachu-vmax-001',
    content: 'PSA10和PSA9的价格差距越来越大，现在入PSA10的性价比更高。长期来看，满分卡的保值率远超其他评级。',
    tags: ['grade_discuss', 'market_analysis'],
    likes: 256,
    dislikes: 8,
    replies: 32,
    createdAt: '2024-01-13 15:45',
    updatedAt: '2024-01-13 15:45'
  },
  {
    id: 'cmt-003',
    userId: 'user-103',
    userName: '投资新手',
    userAvatar: 'https://picsum.photos/id/3/100/100',
    cardId: 'pikachu-vmax-001',
    content: '新手想问，现在入手会不会被套？',
    tags: ['question'],
    likes: 45,
    dislikes: 2,
    replies: 18,
    createdAt: '2024-01-12 20:15',
    updatedAt: '2024-01-12 20:15'
  },
  {
    id: 'cmt-004',
    userId: 'user-104',
    userName: '出卡老哥',
    userAvatar: 'https://picsum.photos/id/4/100/100',
    cardId: 'pikachu-vmax-001',
    content: '出两张PSA10，有兴趣的可以私信。',
    tags: ['sell'],
    likes: 12,
    dislikes: 1,
    replies: 5,
    createdAt: '2024-01-11 18:30',
    updatedAt: '2024-01-11 18:30'
  },
  {
    id: 'cmt-005',
    userId: 'user-105',
    userName: '卡牌分析师',
    userAvatar: 'https://picsum.photos/id/5/100/100',
    cardId: 'pikachu-vmax-001',
    content: '从技术面分析，这张卡近期可能会有一波回调，建议观望为主。但如果看好长期价值，现在分批建仓也是可以的。',
    tags: ['market_analysis'],
    likes: 189,
    dislikes: 15,
    replies: 28,
    isTop: true,
    createdAt: '2024-01-10 09:20',
    updatedAt: '2024-01-10 09:20'
  }
];
