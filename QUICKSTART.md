# 快速開始指南 | Quick Start Guide

## 🎯 專案概述

這是一個完整的 **文字轉手語網站** (Text to Sign Language)，使用 AI 技術將中文文字轉換為台灣手語（TSL）圖片。

### 技術特色
- ✅ **前端**: Next.js 14 + TypeScript + Tailwind CSS
- ✅ **後端**: NestJS + OpenAI API
- ✅ **測試**: Jest 單元測試 + Playwright E2E 測試
- ✅ **部署**: Vercel (前端) + Render/Fly.io (後端)

---

## 📦 安裝與執行

### 前置需求

確保已安裝：
- **Node.js** 18.0.0 或以上
- **npm** 9.0.0 或以上
- **OpenAI API Key** ([取得方式](https://platform.openai.com/api-keys))

### 步驟 1: Clone 專案

```bash
git clone https://github.com/0908869905/project.git
cd project
```

### 步驟 2: 安裝依賴

```bash
npm install
```

這會自動安裝所有前後端依賴（monorepo 架構）。

### 步驟 3: 設定環境變數

#### Backend 環境變數

```bash
cd apps/backend
cp .env.example .env
```

編輯 `apps/backend/.env`：

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

> **重要**: 請將 `sk-your-openai-api-key-here` 替換為你的真實 OpenAI API Key

#### Frontend 環境變數

```bash
cd ../frontend
cp .env.example .env.local
```

`apps/frontend/.env.local` 內容（預設值即可）：

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 步驟 4: 啟動開發服務

#### 選項 A: 同時啟動前後端（推薦）

```bash
# 在專案根目錄
npm run dev
```

#### 選項 B: 分別啟動

```bash
# Terminal 1: 啟動後端
npm run dev:backend

# Terminal 2: 啟動前端
npm run dev:frontend
```

### 步驟 5: 開啟瀏覽器

前往 **http://localhost:3000** 即可使用！

---

## 🎮 使用方式

### 基本流程

1. **輸入中文文字**
   - 在文字框中輸入想轉換的中文句子
   - 例如：「我喜歡學習手語」

2. **點擊「生成手語圖片」按鈕**
   - 系統會自動將文字轉換為 TSL Gloss
   - 使用 OpenAI DALL-E 生成手語圖片

3. **查看結果**
   - 顯示原始文字
   - 顯示 TSL Gloss（手語標記）
   - 顯示 AI 生成的手語圖片

4. **提供回饋**
   - 👍 很好：圖片準確
   - 👎 不好：圖片不準確
   - ⚠️ 回報問題：有錯誤需要修正

---

## 🧪 測試

### 執行所有測試

```bash
npm run test
```

### 僅測試後端

```bash
npm run test:backend
```

### 僅測試前端（單元測試）

```bash
npm run test:frontend
```

### E2E 測試（Playwright）

```bash
cd apps/frontend
npm run test:e2e
```

---

## 🏗️ 建置

### 建置所有專案

```bash
npm run build
```

### 分別建置

```bash
# 建置後端
npm run build:backend

# 建置前端
npm run build:frontend
```

### 生產環境執行

```bash
# 後端
cd apps/backend
npm run start:prod

# 前端
cd apps/frontend
npm run start
```

---

## 📡 API 端點

### Health Check
```bash
GET http://localhost:3001/api/health
```

### 完整翻譯（推薦）
```bash
POST http://localhost:3001/api/translate-complete
Content-Type: application/json

{
  "text": "我喜歡學習手語"
}
```

### 單獨翻譯為 Gloss
```bash
POST http://localhost:3001/api/translate
Content-Type: application/json

{
  "text": "我喜歡學習手語"
}
```

### 從 Gloss 生成圖片
```bash
POST http://localhost:3001/api/generate
Content-Type: application/json

{
  "gloss": "INDEX-1 LIKE LEARN SIGN-LANGUAGE"
}
```

### 提交回饋
```bash
POST http://localhost:3001/api/postprocess
Content-Type: application/json

{
  "imageUrl": "https://...",
  "feedback": "like"
}
```

---

## 📂 專案結構

```
project/
├── apps/
│   ├── backend/              # NestJS 後端
│   │   ├── src/
│   │   │   ├── translation/  # 翻譯功能模組
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── package.json
│   └── frontend/             # Next.js 前端
│       ├── src/
│       │   ├── app/          # App Router 頁面
│       │   └── components/   # React 元件
│       └── package.json
├── package.json              # Monorepo 根設定
├── README.md                 # 專案說明
├── DEVELOPMENT.md            # 開發指南
└── QUICKSTART.md             # 快速開始（本文件）
```

---

## 🚀 部署

### 前端部署到 Vercel

1. 連接 GitHub repository 到 [Vercel](https://vercel.com)
2. 設定：
   - **Root Directory**: `apps/frontend`
   - **Build Command**: 保持預設
   - **Output Directory**: 保持預設
3. 環境變數：
   - `NEXT_PUBLIC_API_URL`: 你的後端 API URL

### 後端部署到 Render

1. 連接 GitHub repository 到 [Render](https://render.com)
2. 使用 `render.yaml` 自動配置
3. 環境變數：
   - `OPENAI_API_KEY`: 你的 OpenAI API Key
   - `FRONTEND_URL`: 你的前端 URL

### 後端部署到 Fly.io

```bash
# 安裝 Fly CLI
curl -L https://fly.io/install.sh | sh

# 登入
fly auth login

# 首次部署
fly launch

# 設定 secrets
fly secrets set OPENAI_API_KEY=sk-your-key-here

# 部署
fly deploy
```

---

## 🔧 常見問題

### Q1: 無法連接到 OpenAI API

**A**: 確認：
- `.env` 檔案中的 `OPENAI_API_KEY` 是否正確
- API Key 是否有效且有額度
- 網路連線是否正常

### Q2: Frontend 無法連接 Backend

**A**: 確認：
- Backend 是否已啟動（http://localhost:3001）
- `.env.local` 中的 `NEXT_PUBLIC_API_URL` 是否正確
- CORS 設定是否正確

### Q3: 圖片生成很慢

**A**: DALL-E 圖片生成通常需要 10-30 秒，這是正常的。已實作快取機制，相同請求會更快。

### Q4: 測試失敗

**A**: 
- 確保所有依賴已安裝：`npm install`
- 清除快取：`npm run clean` (如果有的話)
- 重新建置：`npm run build`

---

## 📝 下一步

- 📖 閱讀 [DEVELOPMENT.md](./DEVELOPMENT.md) 瞭解詳細開發指南
- 🔨 自訂 TSL Gloss 轉換規則
- 🎨 美化 UI/UX 設計
- 📊 新增分析與監控
- 🔐 新增使用者認證系統

---

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

## 📧 聯絡

如有問題，請在 GitHub 開 Issue。

---

## 📄 授權

MIT License
