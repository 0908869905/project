# 文字轉手語網站 | Sign Language AI

基於 Next.js + NestJS 的文字轉台灣手語（TSL）AI 生成系統。

## 專案架構

這是一個 monorepo 專案，包含：
- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: NestJS + OpenAI API integration
- **Testing**: Jest (unit tests) + Playwright (E2E tests)
- **Deployment**: Vercel (frontend) + Render/Fly.io (backend)

## 功能特色

✅ 中文文字輸入
✅ 自動轉換為 TSL Gloss 格式
✅ 使用 OpenAI DALL-E 生成手語圖片
✅ 互動式回饋系統（👍👎⚠️）
✅ 快取機制提升效能
✅ 完整的 API 端點
✅ 響應式 UI 設計

## 快速開始

### 前置需求

- Node.js 18+ 
- npm 9+
- OpenAI API Key

### 安裝步驟

1. **Clone 專案**
```bash
git clone <repository-url>
cd project
```

2. **安裝依賴**
```bash
npm install
```

3. **設定環境變數**

Backend (.env):
```bash
cd apps/backend
cp .env.example .env
# 編輯 .env 並填入您的 OPENAI_API_KEY
```

Frontend (.env.local):
```bash
cd apps/frontend
cp .env.example .env.local
# 預設使用 http://localhost:3001
```

4. **啟動開發伺服器**

啟動所有服務：
```bash
npm run dev
```

或分別啟動：
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

5. **開啟瀏覽器**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API 端點

### Backend API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | 健康檢查 |
| `/api/translate` | POST | 中文轉 TSL Gloss |
| `/api/generate` | POST | 從 Gloss 生成圖片 |
| `/api/translate-complete` | POST | 完整流程（文字→Gloss→圖片）|
| `/api/postprocess` | POST | 處理使用者回饋 |
| `/api/stats` | GET | 取得回饋統計 |

### 範例請求

**完整翻譯流程**:
```bash
curl -X POST http://localhost:3001/api/translate-complete \
  -H "Content-Type: application/json" \
  -d '{"text": "我喜歡學習手語"}'
```

**回饋**:
```bash
curl -X POST http://localhost:3001/api/postprocess \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "...", "feedback": "like"}'
```

## 測試

### 單元測試 (Jest)

```bash
# 所有測試
npm run test

# 僅 Backend
npm run test:backend

# 僅 Frontend
npm run test:frontend
```

### E2E 測試 (Playwright)

```bash
cd apps/frontend
npm run test:e2e
```

## 建置

```bash
# 建置所有應用
npm run build

# 分別建置
npm run build:frontend
npm run build:backend
```

## 部署

### Frontend (Vercel)

1. 連接 GitHub repository 到 Vercel
2. 設定環境變數：
   - `NEXT_PUBLIC_API_URL`: 你的 backend URL
3. 部署設定會自動從 `vercel.json` 讀取

### Backend (Render)

1. 連接 GitHub repository 到 Render
2. 選擇 `render.yaml` 配置
3. 設定環境變數：
   - `OPENAI_API_KEY`: 你的 OpenAI API key
   - `FRONTEND_URL`: 你的 frontend URL

### Backend (Fly.io)

```bash
cd project
fly launch
fly secrets set OPENAI_API_KEY=your-key-here
fly deploy
```

## 專案結構

```
project/
├── apps/
│   ├── backend/              # NestJS 後端
│   │   ├── src/
│   │   │   ├── translation/  # 翻譯模組
│   │   │   │   ├── dto/
│   │   │   │   ├── translation.controller.ts
│   │   │   │   ├── translation.service.ts
│   │   │   │   └── openai.service.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── package.json
│   └── frontend/             # Next.js 前端
│       ├── src/
│       │   ├── app/          # App Router
│       │   │   ├── page.tsx
│       │   │   ├── layout.tsx
│       │   │   └── globals.css
│       │   └── components/   # React 元件
│       │       ├── TranslationForm.tsx
│       │       └── ResultDisplay.tsx
│       ├── e2e/              # Playwright 測試
│       └── package.json
├── package.json              # Monorepo 根設定
├── vercel.json               # Vercel 部署設定
├── render.yaml               # Render 部署設定
├── fly.toml                  # Fly.io 部署設定
└── README.md
```

## 技術棧

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest, Playwright

### Backend  
- **Framework**: NestJS
- **Language**: TypeScript
- **API Integration**: OpenAI (GPT-4, DALL-E 3)
- **Testing**: Jest
- **Validation**: class-validator

## 開發指南

### 新增功能

1. Backend: 在 `apps/backend/src/translation/` 新增功能
2. Frontend: 在 `apps/frontend/src/components/` 新增元件
3. 撰寫測試確保功能正常

### 代碼風格

- 使用 ESLint 檢查代碼
- 使用 Prettier 格式化代碼
- 遵循 TypeScript 嚴格模式

## 常見問題

### Q: 如何更換 OpenAI 模型？

A: 編輯 `apps/backend/src/translation/openai.service.ts`，修改 `model` 參數。

### Q: 如何增加快取時間？

A: OpenAI service 使用 Map 作為記憶體快取，可擴展為 Redis 等持久化方案。

### Q: 圖片無法顯示？

A: 確保 `next.config.js` 中的 `images.domains` 包含 DALL-E 的域名。

## 授權

MIT License

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 聯絡資訊

如有問題，請開 Issue 或聯繫專案維護者。
