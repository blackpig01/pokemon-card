#!/bin/bash

echo "=== 双海卡牌 - 部署脚本 ==="

if [ -z "$VERCEL_TOKEN" ]; then
  echo "请先设置环境变量: export VERCEL_TOKEN=你的token"
  exit 1
fi

echo "1. 安装依赖..."
npm ci

echo "2. 构建 H5 版本..."
npm run build:h5

echo "3. 安装 Vercel CLI..."
npm install -g vercel

echo "4. 部署到 Vercel..."
vercel --prod --token $VERCEL_TOKEN

echo "部署完成！"