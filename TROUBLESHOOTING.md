# 疑難排解指南 | Troubleshooting Guide

## 常見問題與解決方法

### 🔴 安裝問題

#### 問題 1: `npm install` 失敗

**症狀**:
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**解決方法**:
```bash
# 清除 npm 快取
npm cache clean --force

# 刪除 node_modules 和 lock 檔案
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules apps/*/package-lock.json

# 重新安裝
npm install
```

#### 問題 2: Node 版本不相容

**症狀**:
```
error: The engine "node" is incompatible with this module
```

**解決方法**:
```bash
# 檢查 Node 版本
node --version  # 需要 >= 18.0.0

# 使用 nvm 切換版本（如果已安裝）
nvm install 18
nvm use 18
```

---

### 🔴 後端問題

#### 問題 3: Backend 無法啟動

**症狀**:
```
Error: Cannot find module '@nestjs/common'
```

**解決方法**:
```bash
# 重新安裝後端依賴
cd apps/backend
npm install

# 或從根目錄
npm install --workspace=apps/backend
```

#### 問題 4: OpenAI API 錯誤

**症狀**:
```
Error: Failed to translate text to TSL gloss
OpenAI API error: 401 Unauthorized
```

**解決方法**:
1. 檢查 `.env` 檔案是否存在：
   ```bash
   cd apps/backend
   ls -la .env
   ```

2. 確認 API Key 格式正確：
   ```env
   # .env
   OPENAI_API_KEY=sk-proj-...your-key...
   ```

3. 驗證 API Key 是否有效：
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

4. 檢查 OpenAI 帳戶額度：
   - 登入 https://platform.openai.com/account/billing
   - 確認有可用額度

#### 問題 5: CORS 錯誤

**症狀**:
```
Access to fetch at 'http://localhost:3001/api/...' from origin 
'http://localhost:3000' has been blocked by CORS policy
```

**解決方法**:
1. 檢查 `apps/backend/src/main.ts` 的 CORS 設定
2. 確認環境變數：
   ```env
   # apps/backend/.env
   FRONTEND_URL=http://localhost:3000
   ```
3. 重啟後端服務

#### 問題 6: Port 已被佔用

**症狀**:
```
Error: listen EADDRINUSE: address already in use :::3001
```

**解決方法**:
```bash
# 找出佔用 port 的程序
lsof -i :3001

# 終止該程序
kill -9 <PID>

# 或更改 port
# apps/backend/.env
PORT=3002
```

---

### 🔴 前端問題

#### 問題 7: Frontend 無法啟動

**症狀**:
```
Error: Cannot find module 'next'
```

**解決方法**:
```bash
# 重新安裝前端依賴
cd apps/frontend
npm install

# 或從根目錄
npm install --workspace=apps/frontend
```

#### 問題 8: 無法連接到 Backend

**症狀**:
- 前端顯示錯誤訊息
- Console 顯示 `Failed to fetch`

**解決方法**:
1. 確認後端正在運行：
   ```bash
   curl http://localhost:3001/api/health
   ```

2. 檢查前端環境變數：
   ```env
   # apps/frontend/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. 清除 Next.js 快取：
   ```bash
   cd apps/frontend
   rm -rf .next
   npm run dev
   ```

#### 問題 9: Tailwind CSS 樣式不顯示

**症狀**:
- 頁面沒有樣式
- 按鈕和佈局看起來不正常

**解決方法**:
```bash
cd apps/frontend

# 確認 Tailwind 配置存在
ls tailwind.config.js postcss.config.js

# 重新建置
npm run build
npm run dev
```

#### 問題 10: 圖片無法顯示

**症狀**:
```
Error: Invalid src prop on `next/image`
```

**解決方法**:
1. 檢查 `next.config.js` 的 images 設定：
   ```javascript
   images: {
     domains: ['oaidalleapiprodscus.blob.core.windows.net'],
   }
   ```

2. 如果 OpenAI 使用新域名，需要新增到 domains 列表

---

### 🔴 測試問題

#### 問題 11: Jest 測試失敗

**症狀**:
```
Cannot find module '@nestjs/testing'
```

**解決方法**:
```bash
cd apps/backend
npm install --save-dev @nestjs/testing

# 執行測試
npm run test
```

#### 問題 12: Playwright 無法執行

**症狀**:
```
Error: browserType.launch: Executable doesn't exist
```

**解決方法**:
```bash
cd apps/frontend

# 安裝 Playwright browsers
npx playwright install

# 執行 E2E 測試
npm run test:e2e
```

---

### 🔴 建置與部署問題

#### 問題 13: 建置失敗

**症狀**:
```
Error: Build failed
```

**解決方法**:
```bash
# 清除所有建置產物
npm run clean  # 如果有此腳本
rm -rf apps/*/dist apps/*/.next

# 重新安裝並建置
npm install
npm run build
```

#### 問題 14: Vercel 部署失敗

**症狀**:
- Vercel 建置失敗
- 找不到檔案

**解決方法**:
1. 確認 Vercel 設定：
   - Root Directory: `apps/frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

2. 確認環境變數已設定：
   - `NEXT_PUBLIC_API_URL`

3. 檢查 `vercel.json` 配置

#### 問題 15: Render/Fly.io 部署失敗

**症狀**:
- Backend 部署失敗
- 無法啟動

**解決方法**:
1. 確認環境變數：
   - `OPENAI_API_KEY`
   - `PORT`
   - `NODE_ENV=production`

2. 檢查建置命令：
   ```bash
   npm run build:backend
   ```

3. 檢查啟動命令：
   ```bash
   npm run start:prod --workspace=apps/backend
   ```

---

### 🔴 效能問題

#### 問題 16: 圖片生成太慢

**症狀**:
- 等待時間超過 1 分鐘
- 請求超時

**原因**:
- OpenAI DALL-E API 本身需要時間
- 網路延遲
- API 配額限制

**解決方法**:
1. 這是正常現象，DALL-E 生成通常需要 10-30 秒
2. 使用快取機制（已實作）
3. 考慮使用更快的圖片生成服務
4. 顯示載入動畫讓使用者知道正在處理中

#### 問題 17: 記憶體使用過高

**症狀**:
- 應用程式變慢
- 記憶體不足錯誤

**解決方法**:
1. 清除快取：
   ```bash
   # 重啟服務會清除記憶體快取
   # 未來可實作 Redis 持久化快取
   ```

2. 監控記憶體使用：
   ```bash
   # 在 Node.js 中
   console.log(process.memoryUsage())
   ```

---

### 🔴 開發工具問題

#### 問題 18: ESLint 錯誤

**症狀**:
```
Parsing error: Cannot find module '@typescript-eslint/parser'
```

**解決方法**:
```bash
# 重新安裝 ESLint 相關套件
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# 執行 lint
npm run lint
```

#### 問題 19: TypeScript 類型錯誤

**症狀**:
```
Property 'xxx' does not exist on type 'yyy'
```

**解決方法**:
```bash
# 重新生成類型定義
npm run build

# 清除 TypeScript 快取
rm -rf apps/*/*.tsbuildinfo

# 重啟 TypeScript 伺服器（VS Code）
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

---

### 🔴 環境變數問題

#### 問題 20: 環境變數未載入

**症狀**:
- `process.env.OPENAI_API_KEY` 是 `undefined`
- 配置無法讀取

**解決方法**:
1. 確認 `.env` 檔案位置：
   ```bash
   # Backend
   apps/backend/.env

   # Frontend (開發環境)
   apps/frontend/.env.local
   ```

2. 確認檔案格式：
   ```env
   # 正確
   OPENAI_API_KEY=sk-proj-xxx

   # 錯誤（不要有空格）
   OPENAI_API_KEY = sk-proj-xxx
   ```

3. 重啟開發伺服器讓環境變數生效

---

## 除錯技巧

### 查看日誌

**Backend**:
```bash
# 開發環境
npm run dev:backend

# 日誌會顯示在 console
```

**Frontend**:
```bash
# 開發環境
npm run dev:frontend

# 開啟瀏覽器 DevTools -> Console
```

### 使用 Debug 模式

**Backend**:
```bash
cd apps/backend
npm run start:debug

# 使用 Chrome DevTools 連接 ws://127.0.0.1:9229
# 或使用 VS Code debugger
```

### 檢查網路請求

使用瀏覽器 DevTools:
1. 開啟 Network tab
2. 執行翻譯
3. 檢查 API 請求和回應
4. 查看錯誤訊息

---

## 取得協助

如果以上方法都無法解決問題：

1. **查看日誌**: 完整的錯誤訊息通常包含解決線索
2. **搜尋 Issues**: 在 GitHub repository 搜尋類似問題
3. **開新 Issue**: 提供詳細資訊：
   - 作業系統和版本
   - Node.js 版本
   - 完整錯誤訊息
   - 重現步驟
4. **社群討論**: 在 Discussion 區發問

---

## 預防措施

### 開發最佳實踐

1. **定期更新依賴**:
   ```bash
   npm outdated
   npm update
   ```

2. **使用版本控制**:
   ```bash
   git commit -m "描述性的提交訊息"
   ```

3. **測試後再提交**:
   ```bash
   npm run test
   npm run build
   ```

4. **定期備份 .env 檔案**（但不要提交到 Git）

5. **監控 OpenAI 使用額度**

---

## 效能監控

建議設置：
- **Sentry**: 錯誤追蹤
- **New Relic** 或 **Datadog**: 效能監控
- **CloudWatch** 或 **Grafana**: 日誌分析

---

## 更新紀錄

- v1.0.0: 初始版本疑難排解指南

如有新問題或解決方案，歡迎貢獻到此文件！
