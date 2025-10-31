# 🚀 Quick Reference | 快速參考

## 常用命令

### 開發
```bash
npm run dev              # 啟動所有服務
npm run dev:backend      # 僅後端
npm run dev:frontend     # 僅前端
```

### 測試
```bash
npm run test             # 所有測試
npm run test:backend     # 後端測試
npm run test:frontend    # 前端測試
npm run test:e2e         # E2E 測試
```

### 建置
```bash
npm run build            # 建置所有
npm run build:backend    # 建置後端
npm run build:frontend   # 建置前端
```

### 生產環境
```bash
# Backend
cd apps/backend && npm run start:prod

# Frontend
cd apps/frontend && npm run start
```

---

## 環境變數

### Backend (.env)
```env
OPENAI_API_KEY=sk-proj-your-key-here
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## API 快速參考

| 端點 | 方法 | 說明 |
|------|------|------|
| `/api/health` | GET | 健康檢查 |
| `/api/translate` | POST | 文字→Gloss |
| `/api/generate` | POST | Gloss→圖片 |
| `/api/translate-complete` | POST | 完整流程 |
| `/api/postprocess` | POST | 回饋處理 |
| `/api/stats` | GET | 統計資料 |

### 常用請求
```bash
# 健康檢查
curl http://localhost:3001/api/health

# 完整翻譯
curl -X POST http://localhost:3001/api/translate-complete \
  -H "Content-Type: application/json" \
  -d '{"text": "你好"}'

# 回饋
curl -X POST http://localhost:3001/api/postprocess \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "...", "feedback": "like"}'
```

---

## 常見問題速查

| 問題 | 解決方法 |
|------|----------|
| Port 被佔用 | `lsof -i :3001` → `kill -9 <PID>` |
| 依賴問題 | `rm -rf node_modules && npm install` |
| 快取問題 | `rm -rf .next dist` |
| TypeScript 錯誤 | `npm run build` |
| API Key 無效 | 檢查 `.env` 檔案 |

---

## 檔案結構速查

```
apps/
├── backend/src/
│   ├── translation/
│   │   ├── translation.controller.ts  # API 端點
│   │   ├── translation.service.ts     # 業務邏輯
│   │   └── openai.service.ts          # OpenAI 整合
│   └── main.ts                        # 入口
│
└── frontend/src/
    ├── app/
    │   └── page.tsx                   # 主頁面
    └── components/
        ├── TranslationForm.tsx        # 輸入表單
        └── ResultDisplay.tsx          # 結果顯示
```

---

## 除錯技巧

### Backend 除錯
```bash
# 啟用 debug 模式
npm run start:debug

# 檢查日誌
console.log(process.env.OPENAI_API_KEY)
```

### Frontend 除錯
- 開啟 Chrome DevTools
- 檢查 Network tab
- 查看 Console 錯誤

---

## Git 工作流程

```bash
# 開始新功能
git checkout -b feature/new-feature

# 提交變更
git add .
git commit -m "Add new feature"

# 推送
git push origin feature/new-feature

# 建立 PR
# 在 GitHub 上開啟 Pull Request
```

---

## 部署檢查清單

### Vercel (Frontend)
- [ ] 連接 GitHub
- [ ] 設定 Root Directory: `apps/frontend`
- [ ] 設定環境變數: `NEXT_PUBLIC_API_URL`
- [ ] 測試部署

### Render/Fly.io (Backend)
- [ ] 連接 GitHub
- [ ] 設定環境變數: `OPENAI_API_KEY`
- [ ] 設定環境變數: `FRONTEND_URL`
- [ ] 測試 API 端點

---

## 效能優化檢查

- [ ] 啟用快取
- [ ] 壓縮圖片
- [ ] 最小化 API 呼叫
- [ ] 使用 CDN
- [ ] 監控錯誤

---

## 安全檢查

- [ ] API Key 不在程式碼中
- [ ] CORS 正確設定
- [ ] 輸入驗證啟用
- [ ] Rate Limiting (建議)
- [ ] HTTPS 啟用（生產環境）

---

## 文件連結

- [README](./README.md) - 專案概述
- [QUICKSTART](./QUICKSTART.md) - 快速開始
- [DEVELOPMENT](./DEVELOPMENT.md) - 開發指南
- [API](./API.md) - API 文件
- [TROUBLESHOOTING](./TROUBLESHOOTING.md) - 疑難排解
- [UI-PREVIEW](./UI-PREVIEW.md) - UI 預覽
- [PROJECT-SUMMARY](./PROJECT-SUMMARY.md) - 專案總結

---

## 版本資訊

**當前版本**: 1.0.0 (MVP)

**更新日誌**:
- v1.0.0: 初始 MVP 發布

---

## 聯絡資訊

- GitHub Issues: 回報問題
- GitHub Discussions: 討論與問答

---

**提示**: 將此文件加入書籤，方便快速查閱！
