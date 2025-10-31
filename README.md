# Sign-Lang-AI - 手語圖片生成器

一個使用 AI 技術將文字轉換為台灣手語(TSL)圖片的全端應用程式。

## 🌟 功能特色

- 🤟 **文字轉手語**：輸入中文文字，自動生成對應的手語圖片
- 🧠 **語境分析**：使用 GPT-4 進行語境分析並轉換為 TSL gloss
- 🎨 **AI 圖片生成**：使用 DALL-E 3 生成專業的手語手勢圖片
- 💾 **智能快取**：自動快取翻譯和圖片結果，提升效能
- 👍👎⚠️ **回饋系統**：使用者可以對生成的圖片提供回饋
- 📱 **響應式設計**：完美支援手機和桌面裝置

## 🏗️ 技術架構

### Frontend (前端)
- **框架**: Next.js 15 with App Router
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **部署**: Vercel

### Backend (後端)
- **框架**: NestJS
- **語言**: TypeScript
- **AI 整合**: OpenAI API (GPT-4 + DALL-E 3)
- **快取**: In-memory cache with TTL
- **部署**: Render / Fly.io

## 📁 專案結構

```
sign-lang-ai/
├── apps/
│   ├── frontend/          # Next.js 前端應用
│   │   ├── app/           # App Router 頁面
│   │   ├── components/    # React 元件
│   │   └── package.json
│   └── backend/           # NestJS 後端應用
│       ├── src/
│       │   ├── api/       # API 路由與服務
│       │   ├── cache/     # 快取模組
│       │   └── main.ts
│       └── package.json
├── index.html            # 簡易版 HTML (demo)
├── script.js             # 簡易版 JS (demo)
├── styles.css            # 簡易版 CSS (demo)
└── package.json          # Monorepo 根目錄配置
```

## 🚀 快速開始

### 前置需求

- Node.js 18+ 
- npm 或 yarn
- OpenAI API Key

### 安裝步驟

1. **Clone 專案**
```bash
git clone https://github.com/0908869905/project.git
cd project
```

2. **安裝依賴**
```bash
npm install
```

3. **設定環境變數**

Backend (apps/backend/.env):
```bash
cp apps/backend/.env.example apps/backend/.env
# 編輯 .env 並填入你的 OPENAI_API_KEY
```

Frontend (apps/frontend/.env.local):
```bash
cp apps/frontend/.env.local.example apps/frontend/.env.local
```

4. **啟動開發伺服器**

同時啟動前後端:
```bash
npm run dev
```

或分別啟動:
```bash
# 啟動後端 (Port 3001)
npm run backend

# 啟動前端 (Port 3000)
npm run frontend
```

5. **開啟瀏覽器**
```
http://localhost:3000
```

## 📡 API 端點

### POST /api/translate
將中文文字轉換為 TSL gloss 表示法
```json
Request: { "text": "你好" }
Response: { "gloss": "IX-YOU HELLO", "originalText": "你好" }
```

### POST /api/generate
根據文字和 gloss 生成手語圖片
```json
Request: { "text": "你好", "gloss": "IX-YOU HELLO" }
Response: { "images": [{ "id": "...", "url": "...", "gloss": "..." }] }
```

### POST /api/postprocess
後處理生成的圖片（添加 metadata 等）
```json
Request: { "images": [...], "gloss": "..." }
Response: { "images": [...] }
```

### POST /api/feedback
提交使用者回饋
```json
Request: { "imageId": "123", "type": "thumbsUp" }
Response: { "success": true }
```

## 🧪 測試

```bash
# 運行所有測試
npm test

# 前端測試
npm test --workspace=apps/frontend

# 後端測試
npm test --workspace=apps/backend
```

## 📦 部署

### Frontend (Vercel)

1. 連接 GitHub repository 到 Vercel
2. 設定專案根目錄為 `apps/frontend`
3. 設定環境變數 `NEXT_PUBLIC_API_URL`
4. 部署

### Backend (Render / Fly.io)

**Render:**
```bash
# 在 Render dashboard 中:
# 1. 選擇 "New Web Service"
# 2. 連接 repository
# 3. 設定 Root Directory: apps/backend
# 4. Build Command: npm install && npm run build
# 5. Start Command: npm run start:prod
# 6. 添加環境變數 OPENAI_API_KEY
```

**Fly.io:**
```bash
cd apps/backend
fly launch
fly deploy
```

## 🎨 使用方式

1. 在首頁的文字框中輸入想要轉換的中文文字
2. 點擊「生成手語圖片」按鈕
3. 系統會顯示 TSL gloss 轉換結果
4. AI 生成的手語圖片會顯示在下方
5. 對每張圖片提供回饋（👍正確 / 👎不正確 / ⚠️需改進）

## 💡 簡易版本

專案也包含一個純 HTML/CSS/JavaScript 的簡易版本：
- 開啟 `index.html` 即可使用
- 不需要安裝任何依賴
- 使用 Canvas API 生成簡單的手語視覺化

## 🔧 開發技術細節

### TSL Gloss 轉換
使用 GPT-4 將中文文字轉換為台灣手語標記法 (Taiwan Sign Language Gloss)。Gloss 使用大寫英文詞彙表示手語符號，並包含語言學標記如 IX (指示)、CL (分類詞) 等。

### 圖片生成
使用 DALL-E 3 生成清晰、專業的手語手勢圖片。提示詞經過優化，確保生成教育性質、清晰可見的手語手勢。

### 快取機制
- 翻譯結果快取 24 小時
- 圖片快取 1 小時
- 使用 in-memory cache 提升效能

## 📄 授權

MIT License

## 👥 貢獻

歡迎提交 Pull Request 或開啟 Issue！

---

© 2025 手語圖片生成器 - 讓溝通更無障礙
