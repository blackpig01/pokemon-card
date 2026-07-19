import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { DanmakuMessage } from '@/data/accessories';
import { getDanmakuMessages, sendDanmaku } from '@/services/accessoryApi';

interface DanmakuProps {
  cardId: string;
  cardName?: string;
}

const Danmaku: React.FC<DanmakuProps> = ({ cardId, cardName }) => {
  const [messages, setMessages] = useState<DanmakuMessage[]>([]);
  const [visible, setVisible] = useState(true);
  const [inputText, setInputText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [opacity, setOpacity] = useState(0.8);
  const [speed, setSpeed] = useState(1);
  const containerRef = useRef<View>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 预定义弹幕颜色
  const colors = ['#FFD93D', '#00B42A', '#165DFF', '#F53F3F', '#722ED1', '#FF9F1C', '#0FC6C2', '#EB0AA4'];

  useEffect(() => {
    loadMessages();
    
    // 启动定时器，模拟新弹幕（使用 Taro 的 setInterval）
    timerRef.current = setInterval(() => {
      simulateNewMessage();
    }, 3000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [cardId]);

  const loadMessages = async () => {
    try {
      const data = await getDanmakuMessages(cardId);
      setMessages(data);
    } catch (error) {
      console.error('加载弹幕失败:', error);
    }
  };

  const simulateNewMessage = () => {
    const presets = [
      { userName: '皮卡丘爱好者', content: '这张卡太稳了' },
      { userName: '投资达人', content: '建议现在入手' },
      { userName: '卡牌收藏家', content: 'PSA10永远的神' },
      { userName: '市场分析师', content: '这波行情可以' },
      { userName: '等等党', content: '再等等可能更低' },
      { userName: '刚需玩家', content: '早买早享受' },
      { userName: '新手玩家', content: '请问PSA10是什么' },
      { userName: '老玩家', content: '涨了涨了！' }
    ];
    
    const randomMsg = presets[Math.floor(Math.random() * presets.length)];
    const newMessage: DanmakuMessage = {
      id: `dm-sim-${Date.now()}`,
      userId: `user-sim-${Date.now()}`,
      userName: randomMsg.userName,
      content: randomMsg.content,
      timestamp: Date.now(),
      color: colors[Math.floor(Math.random() * colors.length)],
      type: 'danmaku'
    };
    
    setMessages(prev => [...prev.slice(-20), newMessage]);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    try {
      const newMessage = await sendDanmaku(cardId, inputText.trim());
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setShowInput(false);
    } catch (error) {
      console.error('发送弹幕失败:', error);
    }
  };

  const toggleVisible = () => {
    setVisible(!visible);
  };

  return (
    <View className={styles.container}>
      {/* 控制栏 */}
      <View className={styles.controlBar}>
        <View className={styles.title}>
          <Text>💬 实时弹幕</Text>
        </View>
        <View className={styles.controls}>
          <View 
            className={`${styles.toggleBtn} ${!visible ? styles.off : ''}`}
            onClick={toggleVisible}
          >
            {visible ? '🔔' : '🔕'}
          </View>
          <View 
            className={styles.sendBtn}
            onClick={() => setShowInput(!showInput)}
          >
            ✏️ 发弹幕
          </View>
        </View>
      </View>

      {/* 输入框 */}
      {showInput && (
        <View className={styles.inputArea}>
          <Input
            className={styles.input}
            placeholder='说点什么...'
            value={inputText}
            onInput={(e) => setInputText(e.detail.value)}
            onConfirm={handleSend}
            maxlength={50}
          />
          <View className={styles.sendConfirm} onClick={handleSend}>
            发送
          </View>
        </View>
      )}

      {/* 弹幕区域 */}
      {visible && (
        <View className={styles.danmakuArea} ref={containerRef}>
          {messages.slice(-10).map((msg) => (
            <View 
              key={msg.id}
              className={styles.danmakuItem}
              style={{ 
                color: msg.color || '#FFFFFF',
                opacity: opacity
              }}
            >
              <Text className={styles.userName}>{msg.userName}: </Text>
              <Text className={styles.content}>{msg.content}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 弹幕提示 */}
      <View className={styles.tips}>
        <Text>💡 弹幕可在设置中调节透明度和速度</Text>
      </View>
    </View>
  );
};

export default Danmaku;