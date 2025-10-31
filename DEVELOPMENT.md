# 開發指南 | Development Guide

## 開發環境設定

### 1. 安裝依賴

```bash
# 在專案根目錄
npm install
```

這會安裝所有 workspace 的依賴。

### 2. 環境變數設定

**Backend** (`apps/backend/.env`):
```env
OPENAI_API_KEY=sk-...your-key...
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`apps/frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. 開發流程

#### 同時啟動前後端
```bash
npm run dev
```

#### 分別啟動
```bash
# Terminal 1: Backend
cd apps/backend
npm run dev

# Terminal 2: Frontend  
cd apps/frontend
npm run dev
```

## 架構說明

### Backend 架構 (NestJS)

```
apps/backend/src/
├── translation/
│   ├── dto/                    # 資料傳輸物件
│   │   └── translation.dto.ts
│   ├── translation.controller.ts  # API 路由控制器
│   ├── translation.service.ts     # 業務邏輯
│   ├── openai.service.ts          # OpenAI 整合
│   └── translation.module.ts      # 模組定義
├── app.module.ts               # 應用程式根模組
└── main.ts                     # 應用程式入口
```

### Frontend 架構 (Next.js)

```
apps/frontend/src/
├── app/
│   ├── page.tsx          # 首頁（主要功能）
│   ├── layout.tsx        # 根 Layout
│   └── globals.css       # 全域樣式
└── components/
    ├── TranslationForm.tsx    # 翻譯表單元件
    └── ResultDisplay.tsx      # 結果顯示元件
```

## API 設計

### 1. 翻譯中文到 Gloss

**端點**: `POST /api/translate`

**請求**:
```json
{
  "text": "我喜歡學習手語"
}
```

**回應**:
```json
{
  "gloss": "INDEX-1 LIKE LEARN SIGN-LANGUAGE"
}
```

### 2. 生成手語圖片

**端點**: `POST /api/generate`

**請求**:
```json
{
  "gloss": "INDEX-1 LIKE LEARN SIGN-LANGUAGE"
}
```

**回應**:
```json
{
  "imageUrl": "https://..."
}
```

### 3. 完整翻譯流程

**端點**: `POST /api/translate-complete`

**請求**:
```json
{
  "text": "我喜歡學習手語"
}
```

**回應**:
```json
{
  "originalText": "我喜歡學習手語",
  "gloss": "INDEX-1 LIKE LEARN SIGN-LANGUAGE",
  "imageUrl": "https://...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 4. 處理回饋

**端點**: `POST /api/postprocess`

**請求**:
```json
{
  "imageUrl": "https://...",
  "feedback": "like"  // "like" | "dislike" | "report"
}
```

**回應**:
```json
{
  "success": true,
  "message": "Thank you for your positive feedback!"
}
```

## 測試策略

### Backend 測試

```bash
cd apps/backend
npm run test           # 執行所有測試
npm run test:watch     # 監看模式
npm run test:cov       # 測試覆蓋率
```

**測試範例**:
```typescript
describe('TranslationService', () => {
  it('should translate text to gloss', async () => {
    const result = await service.translate({ text: '你好' });
    expect(result).toHaveProperty('gloss');
  });
});
```

### Frontend 測試

**單元測試 (Jest)**:
```bash
cd apps/frontend
npm run test
```

**E2E 測試 (Playwright)**:
```bash
cd apps/frontend
npm run test:e2e
```

## 快取機制

Backend 使用 Map 實作簡單的記憶體快取：

```typescript
// 快取鍵格式
translate:${text}     // 翻譯快取
image:${gloss}        // 圖片快取
```

### 清除快取

可透過 OpenAIService 的 `clearCache()` 方法清除。

## 部署檢查清單

### Vercel (Frontend)

- [ ] 連接 GitHub repository
- [ ] 設定 Root Directory: `apps/frontend`
- [ ] 環境變數: `NEXT_PUBLIC_API_URL`
- [ ] 確認 Build Command: `cd ../.. && npm run build:frontend`

### Render (Backend)

- [ ] 連接 GitHub repository
- [ ] 使用 `render.yaml` 配置
- [ ] 環境變數:
  - `OPENAI_API_KEY`
  - `FRONTEND_URL`
  - `PORT=3001`
  - `NODE_ENV=production`

### Fly.io (Backend)

```bash
# 首次部署
fly launch
fly secrets set OPENAI_API_KEY=sk-...

# 後續部署
fly deploy
```

## 常見開發任務

### 新增 API 端點

1. 在 `translation.dto.ts` 定義 DTO
2. 在 `translation.service.ts` 實作邏輯
3. 在 `translation.controller.ts` 新增路由
4. 撰寫測試

### 新增 UI 元件

1. 在 `apps/frontend/src/components/` 建立元件
2. 使用 TypeScript + Tailwind CSS
3. 在 `page.tsx` 引入使用

### 除錯技巧

**Backend**:
```bash
npm run start:debug
# 使用 Chrome DevTools 或 VSCode 附加除錯器
```

**Frontend**:
- 使用 React DevTools
- 檢查 Network tab 查看 API 呼叫
- 使用 `console.log` 或 Chrome debugger

## 效能優化

### Backend
- ✅ 實作快取機制
- ✅ 使用環境變數管理設定
- 🔄 可升級為 Redis 快取
- 🔄 可新增 Rate Limiting

### Frontend
- ✅ 使用 Next.js Image 最佳化
- ✅ 實作載入狀態
- 🔄 可新增 SWR 資料獲取
- 🔄 可新增漸進式圖片載入

## 安全性考量

- ✅ API Key 使用環境變數
- ✅ CORS 設定
- ✅ 輸入驗證 (class-validator)
- 🔄 建議新增 Rate Limiting
- 🔄 建議新增 Authentication

## 監控與日誌

Backend 使用 NestJS Logger:
```typescript
this.logger.log('訊息');
this.logger.error('錯誤', error);
this.logger.warn('警告');
```

可升級為:
- Winston (進階日誌)
- Sentry (錯誤追蹤)
- Prometheus (監控)

## 貢獻指南

1. Fork 專案
2. 建立功能分支: `git checkout -b feature/amazing-feature`
3. 提交變更: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 開啟 Pull Request

## 代碼規範

- 遵循 ESLint 規則
- 使用 Prettier 格式化
- 撰寫有意義的 commit message
- 新增功能必須包含測試
- 更新相關文件
