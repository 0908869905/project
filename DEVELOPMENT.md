# 開發指南 (Development Guide)

## 專案架構

```
sign-lang-ai/
├── apps/
│   ├── frontend/          # Next.js 前端
│   │   ├── app/           # Next.js App Router
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/    # React 元件
│   │   │   └── SignLanguageGenerator.tsx
│   │   ├── tests/         # E2E 測試
│   │   │   └── e2e.spec.ts
│   │   └── package.json
│   └── backend/           # NestJS 後端
│       ├── src/
│       │   ├── api/       # API 模組
│       │   │   ├── api.controller.ts
│       │   │   ├── api.service.ts
│       │   │   └── api.module.ts
│       │   ├── cache/     # 快取模組
│       │   │   ├── cache.service.ts
│       │   │   └── cache.module.ts
│       │   ├── app.module.ts
│       │   └── main.ts
│       └── package.json
├── index.html            # 簡易版 HTML demo
├── script.js             # 簡易版 JavaScript
├── styles.css            # 簡易版 CSS
└── package.json          # Monorepo 根配置
```

## 技術棧

### 前端
- **Next.js 15**: React 框架，使用 App Router
- **TypeScript**: 型別安全
- **Tailwind CSS**: 樣式框架
- **Playwright**: E2E 測試

### 後端
- **NestJS**: Node.js 框架
- **TypeScript**: 型別安全
- **OpenAI SDK**: AI 整合
- **Express**: HTTP 伺服器

## API 設計

### 工作流程

```
使用者輸入 → /api/translate → /api/generate → /api/postprocess → 顯示結果
```

### 端點詳細說明

#### POST /api/translate
將中文文字轉換為 TSL gloss。

**Request:**
```json
{
  "text": "你好世界"
}
```

**Response:**
```json
{
  "gloss": "IX-YOU HELLO WORLD",
  "originalText": "你好世界"
}
```

**實作細節:**
- 使用 GPT-4 進行語境分析
- 轉換為台灣手語標記法 (TSL gloss)
- 結果快取 24 小時

#### POST /api/generate
根據文字和 gloss 生成手語圖片。

**Request:**
```json
{
  "text": "你好",
  "gloss": "IX-YOU HELLO"
}
```

**Response:**
```json
{
  "images": [
    {
      "id": "1234567890",
      "url": "https://...",
      "gloss": "IX-YOU HELLO",
      "timestamp": 1234567890
    }
  ]
}
```

**實作細節:**
- 使用 DALL-E 3 生成圖片
- 優化的 prompt 確保清晰的手勢
- 結果快取 1 小時

#### POST /api/postprocess
後處理生成的圖片。

**Request:**
```json
{
  "images": [...],
  "gloss": "IX-YOU HELLO"
}
```

**Response:**
```json
{
  "images": [
    {
      "id": "1234567890",
      "url": "https://...",
      "gloss": "IX-YOU HELLO",
      "processed": true,
      "metadata": {
        "gloss": "IX-YOU HELLO",
        "processedAt": "2025-10-31T...",
        "version": "1.0"
      }
    }
  ]
}
```

#### POST /api/feedback
提交使用者回饋。

**Request:**
```json
{
  "imageId": "1234567890",
  "type": "thumbsUp" | "thumbsDown" | "warning"
}
```

**Response:**
```json
{
  "success": true
}
```

## 快取策略

### In-Memory Cache
目前使用簡單的 in-memory cache，適合開發和小規模部署。

**特性:**
- TTL (Time-To-Live) 支援
- 自動過期清理
- 快速存取

**限制:**
- 重啟後遺失
- 無法跨多個實例共享
- 記憶體限制

### 生產環境建議
考慮使用 Redis:
```typescript
// 替換 CacheService 使用 Redis
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);
```

## 測試

### 運行測試

```bash
# 前端單元測試
cd apps/frontend
npm test

# E2E 測試
npm run test:e2e

# 後端測試
cd apps/backend
npm test
```

### 測試覆蓋率

```bash
# 前端
cd apps/frontend
npm run test:cov

# 後端
cd apps/backend
npm run test:cov
```

## 開發工作流程

### 1. 建立新功能

```bash
# 建立新分支
git checkout -b feature/new-feature

# 進行開發
# ...

# 測試
npm test

# 提交
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### 2. 除錯

#### 前端除錯
```bash
# 啟動開發模式
cd apps/frontend
npm run dev

# 使用 React DevTools
# 在瀏覽器中按 F12
```

#### 後端除錯
```bash
# 啟動開發模式（帶監聽）
cd apps/backend
npm run start:dev

# 查看日誌
tail -f logs/app.log
```

### 3. 程式碼品質

```bash
# Lint 檢查
npm run lint

# 格式化程式碼
npm run format

# 型別檢查
npm run type-check
```

## 常見問題

### Q: 如何添加新的 API 端點？

1. 在 `apps/backend/src/api/api.controller.ts` 新增路由
2. 在 `apps/backend/src/api/api.service.ts` 實作邏輯
3. 更新前端 `SignLanguageGenerator.tsx` 呼叫新端點

### Q: 如何更改 UI 樣式？

編輯 `apps/frontend/app/globals.css` 或元件中的 Tailwind classes。

### Q: 如何更改 TSL gloss 轉換邏輯？

修改 `apps/backend/src/api/api.service.ts` 中的 `translateToGloss` 方法。

### Q: 如何處理大量請求？

1. 增加快取時間
2. 實作速率限制
3. 使用 Redis 共享快取
4. 部署多個後端實例

## 效能優化建議

### 前端
1. 使用 Next.js Image 組件
2. 實作虛擬滾動（大量圖片時）
3. 程式碼分割
4. 使用 React.memo 避免不必要的重新渲染

### 後端
1. 實作請求去重
2. 批次處理請求
3. 使用 Redis 快取
4. 實作速率限制

## 貢獻指南

1. Fork 專案
2. 建立功能分支
3. 遵循程式碼風格
4. 撰寫測試
5. 提交 Pull Request

## 相關資源

- [Next.js 文件](https://nextjs.org/docs)
- [NestJS 文件](https://docs.nestjs.com)
- [OpenAI API 文件](https://platform.openai.com/docs)
- [Tailwind CSS 文件](https://tailwindcss.com/docs)
- [TypeScript 文件](https://www.typescriptlang.org/docs)
