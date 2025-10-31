# 部署指南 (Deployment Guide)

## 前端部署到 Vercel

### 方式一：透過 Vercel Dashboard

1. 登入 [Vercel](https://vercel.com)
2. 點擊「New Project」
3. 導入您的 GitHub repository
4. 配置專案設定：
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. 設定環境變數：
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

6. 點擊「Deploy」

### 方式二：使用 Vercel CLI

```bash
cd apps/frontend
npm install -g vercel
vercel login
vercel
```

## 後端部署到 Render

### 設定步驟

1. 登入 [Render](https://render.com)
2. 點擊「New +」→「Web Service」
3. 連接您的 GitHub repository
4. 配置服務：
   - **Name**: sign-lang-ai-backend
   - **Root Directory**: `apps/backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

5. 設定環境變數：
   ```
   OPENAI_API_KEY=your-openai-api-key
   PORT=10000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

6. 點擊「Create Web Service」

## 後端部署到 Fly.io

### 設定步驟

1. 安裝 Fly CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. 登入 Fly.io:
   ```bash
   fly auth login
   ```

3. 啟動專案:
   ```bash
   cd apps/backend
   fly launch
   ```

4. 設定環境變數:
   ```bash
   fly secrets set OPENAI_API_KEY=your-openai-api-key
   fly secrets set NODE_ENV=production
   fly secrets set FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. 部署:
   ```bash
   fly deploy
   ```

## 環境變數說明

### 前端 (Frontend)

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `NEXT_PUBLIC_API_URL` | 後端 API 網址 | `https://api.example.com` |

### 後端 (Backend)

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `OPENAI_API_KEY` | OpenAI API 金鑰 | `sk-...` |
| `PORT` | 伺服器埠號 | `3001` |
| `NODE_ENV` | 運行環境 | `production` |
| `FRONTEND_URL` | 前端網址 (用於 CORS) | `https://your-app.vercel.app` |

## 取得 OpenAI API Key

1. 前往 [OpenAI Platform](https://platform.openai.com)
2. 登入或註冊帳號
3. 前往「API Keys」頁面
4. 點擊「Create new secret key」
5. 複製並安全保存 API key

## 驗證部署

### 檢查前端
訪問您的前端網址，應該可以看到手語圖片生成器介面。

### 檢查後端
```bash
curl https://your-backend-url.com/api/translate \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"text":"你好"}'
```

應該返回 JSON 回應包含 TSL gloss。

## 故障排除

### 前端無法連接到後端
- 檢查 `NEXT_PUBLIC_API_URL` 是否正確設定
- 確認後端已啟動且可訪問
- 檢查後端的 CORS 設定

### 後端錯誤
- 檢查 `OPENAI_API_KEY` 是否正確設定
- 查看後端日誌: `fly logs` (Fly.io) 或在 Render dashboard
- 確認 OpenAI API 額度是否充足

### 圖片無法生成
- 確認 OpenAI API key 有效且有額度
- 檢查是否已啟用 DALL-E 3 API 權限
- 查看後端錯誤日誌

## 成本估算

### Vercel (前端)
- Hobby 方案：免費
- Pro 方案：$20/月

### Render (後端)
- Free tier：$0 (有限制)
- Starter：$7/月

### Fly.io (後端)
- Free tier：$0 (有限制)
- 付費：約 $5-10/月

### OpenAI API
- GPT-4：$0.03/1K tokens (input), $0.06/1K tokens (output)
- DALL-E 3：$0.040/image (1024x1024, standard)

預估每次完整請求成本：約 $0.05-0.10

## 監控與維護

### 日誌監控
```bash
# Vercel
vercel logs

# Render
在 Dashboard 查看日誌

# Fly.io
fly logs
```

### 效能監控
- 使用 Vercel Analytics
- 設定 Sentry 錯誤追蹤
- 使用 New Relic 或 Datadog

## 擴展建議

1. **資料庫整合**: 加入 PostgreSQL 儲存使用者回饋
2. **Redis 快取**: 替換 in-memory cache 以提升效能
3. **CDN**: 使用 Cloudflare 或 CloudFront
4. **監控**: 整合 Sentry 錯誤追蹤
5. **分析**: 加入 Google Analytics
