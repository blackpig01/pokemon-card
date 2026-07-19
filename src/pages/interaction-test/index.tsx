import React, { useState } from 'react';
import { View, Text, Input, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { 
  testDanmakuData, 
  testCommentData, 
  testSendDanmaku, 
  testPostComment,
  testLikeComment,
  testDislikeComment,
  testBatchDanmaku,
  testBatchComments,
  testSpamProtection,
  printTestSummary,
  TEST_CARD_ID 
} from '@/data/testData';
import { COMMENT_TAGS, DanmakuMessage, Comment } from '@/data/accessories';

const InteractionTestPage = () => {
  const [danmakuInput, setDanmakuInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [localDanmaku, setLocalDanmaku] = useState<DanmakuMessage[]>(testDanmakuData);
  const [localComments, setLocalComments] = useState<Comment[]>(testCommentData);
  const [isTesting, setIsTesting] = useState(false);

  // 发送弹幕
  const handleSendDanmaku = async () => {
    if (!danmakuInput.trim()) {
      Taro.showToast({ title: '请输入弹幕内容', icon: 'none' });
      return;
    }
    
    try {
      const newDanmaku = await testSendDanmaku(danmakuInput.trim());
      setLocalDanmaku(prev => [...prev, newDanmaku]);
      setDanmakuInput('');
    } catch (error) {
      console.error('发送失败:', error);
    }
  };

  // 发布评论
  const handlePostComment = async () => {
    if (!commentInput.trim()) {
      Taro.showToast({ title: '请输入评论内容', icon: 'none' });
      return;
    }
    
    try {
      const newComment = await testPostComment(commentInput.trim(), selectedTags);
      setLocalComments(prev => [newComment, ...prev]);
      setCommentInput('');
      setSelectedTags([]);
    } catch (error) {
      console.error('发布失败:', error);
    }
  };

  // 点赞
  const handleLike = async (commentId: string) => {
    try {
      await testLikeComment(commentId);
      setLocalComments(prev => prev.map(c => 
        c.id === commentId 
          ? { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked }
          : c
      ));
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  // 点踩
  const handleDislike = async (commentId: string) => {
    try {
      await testDislikeComment(commentId);
      setLocalComments(prev => prev.map(c => 
        c.id === commentId 
          ? { ...c, dislikes: c.isDisliked ? c.dislikes - 1 : c.dislikes + 1, isDisliked: !c.isDisliked }
          : c
      ));
    } catch (error) {
      console.error('点踩失败:', error);
    }
  };

  // 批量测试
  const handleBatchTest = async (type: 'danmaku' | 'comment' | 'spam') => {
    if (isTesting) return;
    
    setIsTesting(true);
    Taro.showLoading({ title: '测试中...' });
    
    try {
      if (type === 'danmaku') {
        await testBatchDanmaku(5);
      } else if (type === 'comment') {
        await testBatchComments(3);
      } else if (type === 'spam') {
        await testSpamProtection();
      }
      
      printTestSummary();
    } catch (error) {
      console.error('批量测试失败:', error);
    } finally {
      setIsTesting(false);
      Taro.hideLoading();
    }
  };

  // 切换标签
  const toggleTag = (tagKey: string) => {
    setSelectedTags(prev => 
      prev.includes(tagKey) 
        ? prev.filter(t => t !== tagKey)
        : [...prev, tagKey]
    );
  };

  // 获取标签信息
  const getTagInfo = (tagKey: string) => COMMENT_TAGS.find(t => t.key === tagKey);

  return (
    <View className={styles.container}>
      <ScrollView scrollY className={styles.content}>
        {/* 标题 */}
        <View className={styles.header}>
          <Text className={styles.title}>🎯 弹幕与评论交互测试</Text>
          <Text className={styles.subtitle}>测试卡片ID: {TEST_CARD_ID}</Text>
        </View>

        {/* 弹幕测试区 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>💬 弹幕测试</Text>
          
          <View className={styles.inputRow}>
            <Input
              className={styles.input}
              placeholder='输入弹幕内容...'
              value={danmakuInput}
              onInput={(e) => setDanmakuInput(e.detail.value)}
              maxlength={50}
            />
            <Button className={styles.sendBtn} onClick={handleSendDanmaku}>
              发送弹幕
            </Button>
          </View>

          {/* 弹幕展示 */}
          <View className={styles.danmakuList}>
            {localDanmaku.slice(-10).map((dm) => (
              <View 
                key={dm.id}
                className={styles.danmakuItem}
                style={{ color: dm.color }}
              >
                <Text className={styles.danmakuUser}>{dm.userName}: </Text>
                <Text className={styles.danmakuContent}>{dm.content}</Text>
              </View>
            ))}
          </View>

          {/* 测试按钮 */}
          <View className={styles.testButtons}>
            <Button 
              className={styles.testBtn} 
              onClick={() => handleBatchTest('danmaku')}
              disabled={isTesting}
            >
              📤 批量发送5条弹幕
            </Button>
            <Button 
              className={`${styles.testBtn} ${styles.danger}`} 
              onClick={() => handleBatchTest('spam')}
              disabled={isTesting}
            >
              ⚠️ 压力测试（触发防刷屏）
            </Button>
          </View>
        </View>

        {/* 评论测试区 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>💭 评论测试</Text>
          
          <View className={styles.inputArea}>
            <Input
              className={styles.textarea}
              placeholder='输入评论内容...'
              value={commentInput}
              onInput={(e) => setCommentInput(e.detail.value)}
              type='textarea'
              maxlength={500}
            />
          </View>

          {/* 标签选择 */}
          <View className={styles.tagSelect}>
            <Text className={styles.tagLabel}>选择标签：</Text>
            <View className={styles.tagList}>
              {COMMENT_TAGS.map(tag => (
                <View 
                  key={tag.key}
                  className={`${styles.tagItem} ${selectedTags.includes(tag.key) ? styles.selected : ''}`}
                  style={selectedTags.includes(tag.key) ? { background: tag.color, borderColor: tag.color } : {}}
                  onClick={() => toggleTag(tag.key)}
                >
                  {tag.label}
                </View>
              ))}
            </View>
          </View>

          <Button className={styles.postBtn} onClick={handlePostComment}>
            📝 发布评论
          </Button>

          {/* 评论列表 */}
          <View className={styles.commentList}>
            {localComments.map((comment) => (
              <View 
                key={comment.id}
                className={`${styles.commentItem} ${comment.isTop ? styles.top : ''}`}
              >
                {comment.isTop && <Text className={styles.topBadge}>🔥 置顶</Text>}
                
                <View className={styles.commentHeader}>
                  <Text className={styles.commentUser}>{comment.userName}</Text>
                  <Text className={styles.commentTime}>{comment.createdAt}</Text>
                </View>

                {/* 标签 */}
                {comment.tags.length > 0 && (
                  <View className={styles.commentTags}>
                    {comment.tags.map(tagKey => {
                      const tagInfo = getTagInfo(tagKey);
                      return tagInfo ? (
                        <View 
                          key={tagKey}
                          className={styles.commentTag}
                          style={{ background: `${tagInfo.color}20`, color: tagInfo.color }}
                        >
                          {tagInfo.label}
                        </View>
                      ) : null;
                    })}
                  </View>
                )}

                <Text className={styles.commentContent}>{comment.content}</Text>

                {/* 互动按钮 */}
                <View className={styles.commentActions}>
                  <View 
                    className={`${styles.actionBtn} ${comment.isLiked ? styles.liked : ''}`}
                    onClick={() => handleLike(comment.id)}
                  >
                    <Text>👍</Text>
                    <Text>{comment.likes}</Text>
                  </View>
                  <View 
                    className={`${styles.actionBtn} ${comment.isDisliked ? styles.disliked : ''}`}
                    onClick={() => handleDislike(comment.id)}
                  >
                    <Text>👎</Text>
                    <Text>{comment.dislikes}</Text>
                  </View>
                  <View className={styles.actionBtn}>
                    <Text>💬</Text>
                    <Text>{comment.replies}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Button 
            className={styles.testBtn}
            onClick={() => handleBatchTest('comment')}
            disabled={isTesting}
          >
            📤 批量发布3条评论
          </Button>
        </View>

        {/* 测试说明 */}
        <View className={styles.infoSection}>
          <Text className={styles.infoTitle}>📋 测试说明</Text>
          <Text className={styles.infoText}>
            1. 发送弹幕：输入内容后点击发送，弹幕会显示在上方列表
          </Text>
          <Text className={styles.infoText}>
            2. 发布评论：输入内容、选择标签后发布，评论会显示在列表顶部
          </Text>
          <Text className={styles.infoText}>
            3. 点赞点踩：点击按钮即可切换状态
          </Text>
          <Text className={styles.infoText}>
            4. 批量测试：模拟快速发送多条消息
          </Text>
          <Text className={styles.infoText}>
            5. 压力测试：短时间内发送10条弹幕，测试防刷屏机制
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default InteractionTestPage;