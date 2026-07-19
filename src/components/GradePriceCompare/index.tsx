import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { GradePriceData, GradeType, GRADE_LIST } from '@/types';

interface GradePriceCompareProps {
  gradePrices: Record<GradeType, GradePriceData>;
  onGradeSelect?: (grade: GradeType) => void;
}

const GradePriceCompare: React.FC<GradePriceCompareProps> = ({ 
  gradePrices,
  onGradeSelect 
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeType>('psa10');
  const canvasId = useRef(`grade-trend-${Date.now()}`);

  useEffect(() => {
    drawTrendLine(gradePrices[selectedGrade]?.trend || []);
  }, [selectedGrade, gradePrices]);

  const drawTrendLine = async (trendData: any[]) => {
    if (trendData.length === 0) return;

    try {
      const query = Taro.createSelectorQuery();
      query.select(`#${canvasId.current}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res[0]?.node) return;
          
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const width = res[0].width;
          const height = res[0].height;

          canvas.width = width * 2;
          canvas.height = height * 2;
          ctx.scale(2, 2);

          ctx.clearRect(0, 0, width, height);

          // 绘制趋势线
          const prices = trendData.map(d => d.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          const priceRange = maxPrice - minPrice || 1;

          const gradeInfo = GRADE_LIST.find(g => g.key === selectedGrade);
          ctx.strokeStyle = gradeInfo?.color || '#FFD93D';
          ctx.lineWidth = 2;
          ctx.beginPath();

          trendData.forEach((point, i) => {
            const x = (i / (trendData.length - 1)) * width;
            const y = height - ((point.price - minPrice) / priceRange) * (height - 10) - 5;
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });

          ctx.stroke();

          // 绘制渐变区域
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          
          const gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, `${gradeInfo?.color || '#FFD93D'}40`);
          gradient.addColorStop(1, `${gradeInfo?.color || '#FFD93D'}00`);
          ctx.fillStyle = gradient;
          ctx.fill();
        });
    } catch (error) {
      console.error('绘制趋势线失败:', error);
    }
  };

  const handleGradeClick = (grade: GradeType) => {
    setSelectedGrade(grade);
    onGradeSelect?.(grade);
  };

  // 计算价格比例
  const getPriceRatio = () => {
    const total = Object.values(gradePrices).reduce((sum, p) => sum + p.current, 0);
    return Object.entries(gradePrices).map(([key, data]) => ({
      key: key as GradeType,
      percent: Math.round((data.current / total) * 100)
    }));
  };

  const ratios = getPriceRatio();

  const formatPrice = (price: number) => `¥${price.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`;

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>评级价差对比</Text>
        <Text className={styles.hint}>点击查看详情</Text>
      </View>

      <View className={styles.gradeList}>
        {GRADE_LIST.map(grade => {
          const data = gradePrices[grade.key];
          if (!data) return null;

          return (
            <View 
              key={grade.key}
              className={`${styles.gradeItem} ${selectedGrade === grade.key ? styles.selected : ''}`}
              onClick={() => handleGradeClick(grade.key)}
            >
              <View className={`${styles.gradeBadge} ${styles[grade.key]}`}>
                {grade.label.split(' ')[0]}
              </View>
              <View className={styles.gradeInfo}>
                <View className={styles.gradeLabel}>
                  <Text>{grade.label}</Text>
                  {grade.key === 'psa10' && <Text style={{ fontSize: '20rpx', color: '#00B42A' }}>🏆 满分</Text>}
                </View>
                <Text className={styles.gradeDesc}>{grade.description}</Text>
              </View>
              <View className={styles.gradePrice}>
                <Text className={styles.currentPrice}>{formatPrice(data.current)}</Text>
                <Text className={`${styles.priceChange} ${data.change >= 0 ? styles.up : styles.down}`}>
                  {data.change >= 0 ? '↑' : '↓'} {Math.abs(data.change).toFixed(1)}%
                </Text>
                <Text className={styles.volume}>成交量: {data.volume}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* 价格比例可视化 */}
      <View className={styles.priceRatio}>
        <Text className={styles.ratioTitle}>价格占比分布</Text>
        <View className={styles.ratioBar}>
          {ratios.map(r => (
            <View 
              key={r.key}
              className={`${styles.ratioSegment} ${styles[r.key]}`}
              style={{ width: `${r.percent}%` }}
            >
              {r.percent > 5 && `${r.percent}%`}
            </View>
          ))}
        </View>
        <View className={styles.ratioLegend}>
          {GRADE_LIST.map(grade => (
            <View key={grade.key} className={styles.legendItem}>
              <View className={styles.legendDot} style={{ background: grade.color }} />
              <Text>{grade.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 趋势预览 */}
      <View className={styles.trendPreview}>
        <Canvas 
          id={canvasId.current}
          className={styles.trendLine}
          type='2d'
        />
      </View>
    </View>
  );
};

export default GradePriceCompare;