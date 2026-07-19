import React, { useState, useEffect } from 'react';
import { View, Text, Image, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { Comment, COMMENT_TAGS } from '@/data/accessories';
import { getCardComments, postComment, likeComment, dislikeComment } from '@/services/accessoryApi';

interface CommentSectionProps {
  cardId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ cardId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [cardId, filterTag]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getCardComments(cardId, {
        tag: filterTag || undefined,
        sortBy: 'likes'
      });
      setComments(data);
    } catch (error) {
      console.error('加载评论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await likeComment(commentId);
      // 重新加载评论
      loadComments();
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleDislike = async (commentId: string) => {
    try {
      await dislikeComment(commentId);
      loadComments();
    } catch (error) {
      console.error('点踩失败:', error);
    }
  };

  const toggleTag = (tagKey: string) => {
    setSelectedTags(prev => 
      prev.includes(tagKey) 
        ? prev.filter(t => t !== tagKey)
        : [...prev, tagKey]
    );
  };

  const handlePost = async () => {
    if (!inputText.trim()) {
      Taro.showToast({
        title: '请输入评论内容',
        icon: 'none'
      });
      return;
    }

    try {
      await postComment(cardId, inputText.trim(), '当前用户', selectedTags);
      setInputText('');
      setSelectedTags([]);
      setShowInput(false);
      Taro.showToast({
        title: '发布成功',
        icon: 'success'
      });
      loadComments();
    } catch (error) {
      console.error('发布评论失败:', error);
    }
  };

  const getTagInfo = (tagKey: string) => {
    return COMMENT_TAGS.find(t => t.key === tagKey);
  };

  return (
    <View className={styles.container}>
      {/* 标题栏 */}
      <View className={styles.header}>
        <View className={styles.titleRow}>
          <Text className={styles.title}>💬 讨论区</Text>
          <View 
            className={styles.postBtn}
            onClick={() => setShowInput(!showInput)}
          >
            {showInput ? '收起' : '发布评论'}
          </View>
        </View>
        
        {/* 标签筛选 */}
        <ScrollView className={styles.tagFilter} scrollX>
          <View 
            className={`${styles.filterTag} ${!filterTag ? styles.active : ''}`}
            onClick={() => setFilterTag(null)}
          >
            全部
          </View>
          {COMMENT_TAGS.map(tag => (
            <View 
              key={tag.key}
              className={`${styles.filterTag} ${filterTag === tag.key ? styles.active : ''}`}
              style={filterTag === tag.key ? { background: tag.color } : {}}
              onClick={() => setFilterTag(tag.key)}
            >
              {tag.label}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 发布评论 */}
      {showInput && (
        <View className={styles.postArea}>
          <Input
            className={styles.postInput}
            placeholder='写下你的看法...'
            value={inputText}
            onInput={(e) => setInputText(e.detail.value)}
            type='textarea'
            maxlength={500}
          />
          
          <View className={styles.tagSelect}>
            <Text className={styles.tagLabel}>选择标签：</Text>
            <ScrollView className={styles.tagList} scrollX>
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
            </ScrollView>
          </View>
          
          <View className={styles.postActions}>
            <Text className={styles.charCount}>{inputText.length}/500</Text>
            <View className={styles.submitBtn} onClick={handlePost}>
              发布
            </View>
          </View>
        </View>
      )}

      {/* 评论列表 */}
      <View className={styles.commentList}>
        {loading ? (
          <View className={styles.loading}>
            <Text>加载中...</Text>
          </View>
        ) : comments.length === 0 ? (
          <View className={styles.empty}>
            <Text>暂无评论，快来抢沙发~</Text>
          </View>
        ) : (
          comments.map(comment => (
            <View 
              key={comment.id}
              className={`${styles.commentItem} ${comment.isTop ? styles.topComment : ''}`}
            >
              {/* 置顶标识 */}
              {comment.isTop && (
                <View className={styles.topBadge}>置顶</View>
              )}
              
              {/* 用户信息 */}
              <View className={styles.userInfo}>
                <Image 
                  className={styles.avatar}
                  src={comment.userAvatar || 'https://picsum.photos/id/1/100/100'}
                  mode='aspectFill'
                />
                <View className={styles.userDetail}>
                  <Text className={styles.userName}>{comment.userName}</Text>
                  <Text className={styles.commentTime}>{comment.createdAt}</Text>
                </View>
              </View>
              
              {/* 评论内容 */}
              <View className={styles.commentContent}>
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
                
                <Text className={styles.contentText}>{comment.content}</Text>
              </View>
              
              {/* 互动按钮 */}
              <View className={styles.actions}>
                <View 
                  className={`${styles.actionItem} ${comment.isLiked ? styles.liked : ''}`}
                  onClick={() => handleLike(comment.id)}
                >
                  <Text>{comment.isLiked ? '👍' : '👍'}</Text>
                  <Text className={styles.actionCount}>{comment.likes}</Text>
                </View>
                <View 
                  className={`${styles.actionItem} ${comment.isDisliked ? styles.disliked : ''}`}
                  onClick={() => handleDislike(comment.id)}
                >
                  <Text>{comment.isDisliked ? '👎' : '👎'}</Text>
                  <Text className={styles.actionCount}>{comment.dislikes}</Text>
                </View>
                <View className={styles.actionItem}>
                  <Text>💬</Text>
                  <Text className={styles.actionCount}>{comment.replies}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

export default CommentSection;