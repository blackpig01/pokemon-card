import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { KlinePoint } from '@/types';

interface KlineChartProps {
  data: KlinePoint[];
  title?: string;
  showVolume?: boolean;
}

type Period = 'daily' | 'weekly' | 'monthly';

const KlineChart: React.FC<KlineChartProps> = ({ 
  data, 
  title = '价格走势',
  showVolume = true 
}) => {
  const [period, setPeriod] = useState<Period>('daily');
  const [currentData, setCurrentData] = useState<KlinePoint[]>(data);
  const canvasId = useRef(`kline-${Date.now()}`);

  useEffect(() => {
    // 根据周期筛选数据
    let filteredData = data;
    if (period === 'weekly') {
      filteredData = data.filter((_, i) => i % 7 === 0);
    } else if (period === 'monthly') {
      filteredData = data.filter((_, i) => i % 30 === 0);
    }
    setCurrentData(filteredData);
    drawChart(filteredData);
  }, [period, data]);

  const drawChart = async (chartData: KlinePoint[]) => {
    if (chartData.length === 0) return;

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

          // 设置画布尺寸
          canvas.width = width * 2;
          canvas.height = height * 2;
          ctx.scale(2, 2);

          // 清空画布
          ctx.clearRect(0, 0, width, height);

          // 绘制背景网格
          drawGrid(ctx, width, height);

          // 绘制K线
          drawKline(ctx, chartData, width, height);

          // 绘制成交量
          if (showVolume) {
            drawVolume(ctx, chartData, width, height);
          }
        });
    } catch (error) {
      console.error('绘制图表失败:', error);
    }
  };

  const drawGrid = (ctx: any, width: number, height: number) => {
    ctx.strokeStyle = '#E5E6EB';
    ctx.lineWidth = 0.5;

    // 横线
    for (let i = 0; i < 5; i++) {
      const y = height * 0.1 + (height * 0.6) * i / 4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 纵线
    for (let i = 0; i < 6; i++) {
      const x = width * i / 5;
      ctx.beginPath();
      ctx.moveTo(x, height * 0.1);
      ctx.lineTo(x, height * 0.7);
      ctx.stroke();
    }
  };

  const drawKline = (ctx: any, chartData: KlinePoint[], width: number, height: number) => {
    if (chartData.length === 0) return;

    const chartWidth = width - 20;
    const chartHeight = height * 0.55;
    const chartTop = height * 0.12;

    // 计算价格范围
    const prices = chartData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const candleWidth = Math.max(chartWidth / chartData.length - 4, 4);

    chartData.forEach((point, i) => {
      const x = 10 + i * (chartWidth / chartData.length);
      
      // 计算Y坐标
      const openY = chartTop + chartHeight - ((point.open - minPrice) / priceRange) * chartHeight;
      const closeY = chartTop + chartHeight - ((point.close - minPrice) / priceRange) * chartHeight;
      const highY = chartTop + chartHeight - ((point.high - minPrice) / priceRange) * chartHeight;
      const lowY = chartTop + chartHeight - ((point.low - minPrice) / priceRange) * chartHeight;

      // 判断涨跌
      const isUp = point.close >= point.open;
      ctx.strokeStyle = isUp ? '#00B42A' : '#F53F3F';
      ctx.fillStyle = isUp ? '#00B42A' : '#F53F3F';

      // 绘制影线
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      // 绘制实体
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY) || 2;
      ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);
    });
  };

  const drawVolume = (ctx: any, chartData: KlinePoint[], width: number, height: number) => {
    if (chartData.length === 0) return;

    const chartWidth = width - 20;
    const chartHeight = height * 0.15;
    const chartTop = height * 0.75;

    const maxVolume = Math.max(...chartData.map(d => d.volume));
    const barWidth = Math.max(chartWidth / chartData.length - 2, 2);

    chartData.forEach((point, i) => {
      const x = 10 + i * (chartWidth / chartData.length);
      const barHeight = (point.volume / maxVolume) * chartHeight;
      
      const isUp = point.close >= point.open;
      ctx.fillStyle = isUp ? 'rgba(0, 180, 42, 0.5)' : 'rgba(245, 63, 63, 0.5)';
      
      ctx.fillRect(x, chartTop + chartHeight - barHeight, barWidth, barHeight);
    });
  };

  // 计算统计数据
  const getStats = () => {
    if (currentData.length === 0) return { open: 0, close: 0, high: 0, low: 0, change: 0 };
    
    const first = currentData[0];
    const last = currentData[currentData.length - 1];
    const high = Math.max(...currentData.map(d => d.high));
    const low = Math.min(...currentData.map(d => d.low));
    const change = ((last.close - first.open) / first.open) * 100;
    
    return { open: first.open, close: last.close, high, low, change };
  };

  const stats = getStats();

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>{title}</Text>
        <View className={styles.periodTabs}>
          <View 
            className={`${styles.periodTab} ${period === 'daily' ? styles.active : ''}`}
            onClick={() => setPeriod('daily')}
          >
            日K
          </View>
          <View 
            className={`${styles.periodTab} ${period === 'weekly' ? styles.active : ''}`}
            onClick={() => setPeriod('weekly')}
          >
            周K
          </View>
          <View 
            className={`${styles.periodTab} ${period === 'monthly' ? styles.active : ''}`}
            onClick={() => setPeriod('monthly')}
          >
            月K
          </View>
        </View>
      </View>

      <View className={styles.chartContainer}>
        <Canvas 
          id={canvasId.current}
          className={styles.chartCanvas}
          type='2d'
        />
      </View>

      <View className={styles.legend}>
        <View className={styles.legendItem}>
          <View className={`${styles.legendColor} ${styles.up}`} />
          <Text>上涨</Text>
        </View>
        <View className={styles.legendItem}>
          <View className={`${styles.legendColor} ${styles.down}`} />
          <Text>下跌</Text>
        </View>
      </View>

      <View className={styles.stats}>
        <View className={styles.statItem}>
          <Text className={styles.statLabel}>开盘</Text>
          <Text className={styles.statValue}>¥{stats.open.toFixed(0)}</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statLabel}>收盘</Text>
          <Text className={styles.statValue}>¥{stats.close.toFixed(0)}</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statLabel}>最高</Text>
          <Text className={styles.statValue}>¥{stats.high.toFixed(0)}</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statLabel}>最低</Text>
          <Text className={styles.statValue}>¥{stats.low.toFixed(0)}</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statLabel}>涨跌</Text>
          <Text className={`${styles.statValue} ${styles.statChange} ${stats.change >= 0 ? styles.up : styles.down}`}>
            {stats.change >= 0 ? '+' : ''}{stats.change.toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

export default KlineChart;