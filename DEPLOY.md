# 双海卡牌 - 自动化部署指南

## 环境要求

- Node.js >= 22
- Git
- Vercel 账号（已注册）

## 一、准备工作

### 1. 安装 Git

**Windows**:
```bash
# 下载安装 Git for Windows
# https://git-scm.com/download/win
```

**macOS**:
```bash
brew install git
```

**Linux**:
```bash
sudo apt-get install git
```

### 2. 初始化 Git 仓库

```bash
cd pokemon-tracker
git init
git add .
git commit -m "Initial commit"
```

### 3. 创建 GitHub 仓库

1. 打开 https://github.com/new
2. 创建一个新仓库（建议设为私有）
3. 将本地仓库关联到远程仓库：

```bash
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

## 二、配置 Vercel

### 1. 获取 Vercel Token

1. 打开 https://vercel.com/account/tokens
2. 点击 **"Create Token"**
3. 设置 Token 名称（如 `github-action-token`）
4. 复制生成的 Token（只会显示一次，务必保存）

### 2. 配置 GitHub Secret

1. 打开你的 GitHub 仓库
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **"New repository secret"**
4. 设置：
   - Name: `VERCEL_TOKEN`
   - Value: 你的 Vercel Token

## 三、自动化部署

### 触发条件

每次推送到 `main` 或 `master` 分支时，GitHub Actions 会自动执行：

1. ✅ 拉取代码
2. ✅ 安装依赖
3. ✅ 构建 H5 版本
4. ✅ 部署到 Vercel

### 查看部署状态

1. 打开你的 GitHub 仓库
2. 点击 **Actions** 标签页
3. 查看最新的部署 workflow 状态

## 四、手动部署（备选方案）

### 使用部署脚本

```bash
# 设置 Vercel Token
export VERCEL_TOKEN=你的token

# 运行部署脚本
bash deploy.sh
```

### 手动执行

```bash
# 1. 安装依赖
npm ci

# 2. 构建
npm run build:h5

# 3. 安装 Vercel CLI
npm install -g vercel

# 4. 部署
vercel --prod --token 你的token
```

## 五、部署配置

### vercel.json

```json
{
  "buildCommand": "npm run build:h5",
  "outputDirectory": "dist",
  "framework": null,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 项目结构

```
pokemon-tracker/
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions 配置
├── dist/                   # 构建产物（自动生成）
├── src/                    # 源代码
├── vercel.json             # Vercel 配置
├── deploy.sh               # 手动部署脚本
└── DEPLOY.md               # 部署指南
```

## 六、常见问题

### Q1: 部署失败，提示找不到 VERCEL_TOKEN

A: 请检查 GitHub Secrets 是否正确配置，确保 `VERCEL_TOKEN` 名称完全一致。

### Q2: 构建失败，提示依赖问题

A: 确保使用 `npm ci` 而不是 `npm install`，以保证依赖版本一致。

### Q3: 部署成功但页面空白

A: 检查 `vercel.json` 中的 `rewrites` 配置是否正确，确保 SPA 路由正常工作。

### Q4: 如何自定义域名

A: 在 Vercel 项目设置中添加自定义域名，并在域名服务商处配置 DNS 解析。

## 七、联系方式

如有问题，请联系项目维护者。