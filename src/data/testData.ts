/**
 * 弹幕和评论功能测试工具
 * 用于验证弹幕发送、评论发布、点赞点踩等交互逻辑
 */

import Taro from '@tarojs/taro';
import { DanmakuMessage, Comment, COMMENT_TAGS } from '../data/accessories';

/**
 * 测试卡片ID
 */
export const TEST_CARD_ID = 'pikachu-vmax-001';

/**
 * 测试弹幕数据
 */
export const testDanmakuData: DanmakuMessage[] = [
  {
    id: 'dm-test-001',
    userId: 'test-user-001',
    userName: '测试用户A',
    content: 'PSA10稳如老狗，这波行情很稳',
    timestamp: Date.now() - 60000,
    color: '#FFD93D',
    type: 'danmaku'
  },
  {
    id: 'dm-test-002',
    userId: 'test-user-002',
    userName: '测试用户B',
    content: '抄底啦抄底啦！',
    timestamp: Date.now() - 45000,
    color: '#00B42A',
    type: 'danmaku'
  },
  {
    id: 'dm-test-003',
    userId: 'test-user-003',
    userName: '投资大师',
    content: '建议长期持有，收益可观',
    timestamp: Date.now() - 30000,
    color: '#165DFF',
    type: 'danmaku'
  },
  {
    id: 'dm-test-004',
    userId: 'test-user-004',
    userName: '卡牌新手',
    content: '请问PSA10和PSA9差多少？',
    timestamp: Date.now() - 15000,
    color: '#722ED1',
    type: 'danmaku'
  },
  {
    id: 'dm-test-005',
    userId: 'test-user-005',
    userName: '庄家',
    content: '等等党永远不亏',
    timestamp: Date.now() - 5000,
    color: '#F53F3F',
    type: 'danmaku'
  }
];

/**
 * 测试评论数据
 */
export const testCommentData: Comment[] = [
  {
    id: 'cmt-test-001',
    userId: 'test-user-101',
    userName: '资深收藏家',
    userAvatar: 'https://picsum.photos/id/64/100/100',
    cardId: TEST_CARD_ID,
    content: '这张皮卡丘VMAX是近期最值得投资的卡牌之一。从历史走势来看，每次大赛后价格都会有明显上涨，现在入手正是好时机。建议入手PSA10版本，长期保值率更高。',
    tags: ['market_analysis', 'collection'],
    likes: 328,
    dislikes: 12,
    replies: 45,
    isTop: true,
    createdAt: '2024-01-14 10:30',
    updatedAt: '2024-01-14 10:30'
  },
  {
    id: 'cmt-test-002',
    userId: 'test-user-102',
    userName: '评级专家',
    userAvatar: 'https://picsum.photos/id/91/100/100',
    cardId: TEST_CARD_ID,
    content: 'PSA10和PSA9的价格差距越来越大，现在入PSA10的性价比更高。从市场数据来看，满分卡的保值率远超其他评级，未来升值空间更大。',
    tags: ['grade_discuss', 'market_analysis'],
    likes: 256,
    dislikes: 8,
    replies: 32,
    createdAt: '2024-01-13 15:45',
    updatedAt: '2024-01-13 15:45'
  },
  {
    id: 'cmt-test-003',
    userId: 'test-user-103',
    userName: '投资新手',
    userAvatar: 'https://picsum.photos/id/177/100/100',
    cardId: TEST_CARD_ID,
    content: '新手想问，现在入手会不会被套？看到很多人在讨论这张卡，有点心动但又怕亏损。',
    tags: ['question'],
    likes: 89,
    dislikes: 3,
    replies: 28,
    createdAt: '2024-01-12 20:15',
    updatedAt: '2024-01-12 20:15'
  },
  {
    id: 'cmt-test-004',
    userId: 'test-user-104',
    userName: '出卡老哥',
    userAvatar: 'https://picsum.photos/id/237/100/100',
    cardId: TEST_CARD_ID,
    content: '出两张PSA10，有兴趣的可以私信。卡品完好，包装专业，顺丰包邮。',
    tags: ['sell'],
    likes: 45,
    dislikes: 2,
    replies: 12,
    createdAt: '2024-01-11 18:30',
    updatedAt: '2024-01-11 18:30'
  },
  {
    id: 'cmt-test-005',
    userId: 'test-user-105',
    userName: '卡牌分析师',
    userAvatar: 'https://picsum.photos/id/338/100/100',
    cardId: TEST_CARD_ID,
    content: '从技术面分析，这张卡近期可能会有一波回调，建议观望为主。但如果看好长期价值，现在分批建仓也是可以的。建议设置10%的止损位。',
    tags: ['market_analysis'],
    likes: 189,
    dislikes: 15,
    replies: 38,
    isTop: true,
    createdAt: '2024-01-10 09:20',
    updatedAt: '2024-01-10 09:20'
  },
  {
    id: 'cmt-test-006',
    userId: 'test-user-106',
    userName: '评级讨论爱好者',
    userAvatar: 'https://picsum.photos/id/659/100/100',
    cardId: TEST_CARD_ID,
    content: '最近PSA和BGS的评级标准好像有变化，大家觉得哪个机构的评级更权威？',
    tags: ['grade_discuss', 'question'],
    likes: 67,
    dislikes: 5,
    replies: 19,
    createdAt: '2024-01-09 14:20',
    updatedAt: '2024-01-09 14:20'
  },
  {
    id: 'cmt-test-007',
    userId: 'test-user-107',
    userName: '收藏心得分享',
    userAvatar: 'https://picsum.photos/id/1027/100/100',
    cardId: TEST_CARD_ID,
    content: '收藏卡牌最重要的是品相和保存方式。建议大家入手后使用防潮箱保存，定期检查卡片状态。好的收藏习惯能让卡牌保值增值。',
    tags: ['collection'],
    likes: 156,
    dislikes: 4,
    replies: 23,
    createdAt: '2024-01-08 11:15',
    updatedAt: '2024-01-08 11:15'
  },
  {
    id: 'cmt-test-008',
    userId: 'test-user-108',
    userName: '求购信息',
    userAvatar: 'https://picsum.photos/id/1/100/100',
    cardId: TEST_CARD_ID,
    content: '长期求购皮卡丘VMAX PSA10，要求卡品完好，预算1500以内，有出的麻烦私信。',
    tags: ['buy_request'],
    likes: 23,
    dislikes: 1,
    replies: 8,
    createdAt: '2024-01-07 16:45',
    updatedAt: '2024-01-07 16:45'
  }
];

/**
 * 测试发送弹幕
 */
export const testSendDanmaku = async (content: string): Promise<DanmakuMessage> => {
  console.log('📤 测试发送弹幕:', content);
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newDanmaku: DanmakuMessage = {
    id: `dm-test-${Date.now()}`,
    userId: 'current-user',
    userName: '当前用户',
    content,
    timestamp: Date.now(),
    color: getRandomColor(),
    type: 'danmaku'
  };
  
  console.log('✅ 弹幕发送成功:', newDanmaku);
  Taro.showToast({
    title: '弹幕发送成功',
    icon: 'success'
  });
  
  return newDanmaku;
};

/**
 * 测试发布评论
 */
export const testPostComment = async (
  content: string,
  tags: string[] = []
): Promise<Comment> => {
  console.log('📤 测试发布评论:', { content, tags });
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newComment: Comment = {
    id: `cmt-test-${Date.now()}`,
    userId: 'current-user',
    userName: '当前用户',
    userAvatar: 'https://picsum.photos/id/64/100/100',
    cardId: TEST_CARD_ID,
    content,
    tags,
    likes: 0,
    dislikes: 0,
    replies: 0,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  };
  
  console.log('✅ 评论发布成功:', newComment);
  Taro.showToast({
    title: '评论发布成功',
    icon: 'success'
  });
  
  return newComment;
};

/**
 * 测试点赞评论
 */
export const testLikeComment = async (commentId: string): Promise<boolean> => {
  console.log('👍 测试点赞评论:', commentId);
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200));
  
  console.log('✅ 点赞成功');
  Taro.showToast({
    title: '点赞成功',
    icon: 'success'
  });
  
  return true;
};

/**
 * 测试点踩评论
 */
export const testDislikeComment = async (commentId: string): Promise<boolean> => {
  console.log('👎 测试点踩评论:', commentId);
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200));
  
  console.log('✅ 点踩成功');
  Taro.showToast({
    title: '点踩成功',
    icon: 'success'
  });
  
  return true;
};

/**
 * 批量测试弹幕发送（测试防刷屏机制）
 */
export const testBatchDanmaku = async (count: number = 5): Promise<void> => {
  console.log(`📤 开始批量发送 ${count} 条弹幕测试...`);
  
  for (let i = 0; i < count; i++) {
    await testSendDanmaku(`批量测试弹幕 ${i + 1}`);
    // 每条间隔1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('✅ 批量发送完成');
};

/**
 * 批量测试评论发布
 */
export const testBatchComments = async (count: number = 3): Promise<void> => {
  console.log(`📤 开始批量发布 ${count} 条评论测试...`);
  
  const testContents = [
    { content: '这是一条测试评论1，测试评论发布功能是否正常。', tags: ['question'] },
    { content: '这是第二条测试评论，主要测试评论的标签功能。', tags: ['market_analysis'] },
    { content: '第三条测试评论，用于验证长文本评论的显示效果。', tags: ['collection'] }
  ];
  
  for (let i = 0; i < Math.min(count, testContents.length); i++) {
    await testPostComment(testContents[i].content, testContents[i].tags);
    // 每条间隔2秒
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('✅ 批量发布完成');
};

/**
 * 压力测试：短时间内发送大量弹幕（测试防刷屏机制）
 */
export const testSpamProtection = async (): Promise<void> => {
  console.log('⚠️ 开始压力测试：短时间内发送10条弹幕（应触发防刷屏）...');
  
  for (let i = 0; i < 10; i++) {
    try {
      await testSendDanmaku(`压力测试弹幕 ${i + 1}`);
    } catch (error) {
      console.error('❌ 发送失败（预期行为）:', error);
      Taro.showToast({
        title: '发送过于频繁，请稍后再试',
        icon: 'none'
      });
    }
    // 每200ms发送一条，模拟快速发送
    await new Promise(resolve => setTimeout(resolve, 200));
  }
};

/**
 * 获取随机颜色
 */
const getRandomColor = (): string => {
  const colors = [
    '#FFD93D', // 黄色
    '#00B42A', // 绿色
    '#165DFF', // 蓝色
    '#F53F3F', // 红色
    '#722ED1', // 紫色
    '#FF9F1C', // 橙色
    '#0FC6C2', // 青色
    '#EB0AA4', // 粉色
    '#FFFFFF', // 白色
    '#7F7F7F'  // 灰色
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * 打印测试数据摘要
 */
export const printTestSummary = (): void => {
  console.log('='.repeat(50));
  console.log('📊 弹幕和评论测试数据摘要');
  console.log('='.repeat(50));
  
  console.log('\n📌 测试卡片ID:', TEST_CARD_ID);
  
  console.log('\n💬 弹幕数据:');
  console.log(`   - 预设弹幕数量: ${testDanmakuData.length}`);
  testDanmakuData.forEach((dm, i) => {
    console.log(`   ${i + 1}. [${dm.userName}]: ${dm.content.substring(0, 20)}...`);
  });
  
  console.log('\n💭 评论数据:');
  console.log(`   - 预设评论数量: ${testCommentData.length}`);
  testCommentData.forEach((cm, i) => {
    console.log(`   ${i + 1}. [${cm.userName}]: ${cm.content.substring(0, 30)}...`);
    console.log(`      标签: ${cm.tags.map(t => COMMENT_TAGS.find(tag => tag.key === t)?.label || t).join(', ')}`);
    console.log(`      点赞: ${cm.likes} | 点踩: ${cm.dislikes} | 回复: ${cm.replies}`);
  });
  
  console.log('\n🧪 可用的测试函数:');
  console.log('   - testSendDanmaku(content) - 发送单条弹幕');
  console.log('   - testPostComment(content, tags) - 发布评论');
  console.log('   - testLikeComment(commentId) - 点赞评论');
  console.log('   - testDislikeComment(commentId) - 点踩评论');
  console.log('   - testBatchDanmaku(count) - 批量发送弹幕');
  console.log('   - testBatchComments(count) - 批量发布评论');
  console.log('   - testSpamProtection() - 压力测试（触发防刷屏）');
  console.log('   - printTestSummary() - 打印测试摘要');
  
  console.log('\n' + '='.repeat(50));
};
