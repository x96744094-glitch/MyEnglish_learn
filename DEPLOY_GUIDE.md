# 🚀 部署指南 — 讓其他人可以使用

## 推薦方案：Vercel + Railway（完全免費）

---

## 第一步：準備後端（Railway）

### 1. 建立 GitHub Repository
```bash
cd english-learning-platform
git init
git add .
git commit -m "Initial commit"
# 到 github.com 建立新 repo，然後：
git remote add origin https://github.com/你的帳號/english-learning.git
git push -u origin main
```

### 2. 部署後端到 Railway
1. 前往 https://railway.app 用 GitHub 登入
2. 點「New Project」→「Deploy from GitHub repo」
3. 選你的 repository → 選 `backend` 資料夾
4. Railway 會自動偵測 Node.js，點「Deploy」
5. 部署完成後，到「Settings」→「Networking」→「Generate Domain」
6. 複製你的後端網址，例如：`https://english-api.up.railway.app`

---

## 第二步：更新前端設定

把 `frontend/src/services/api.js` 的 baseURL 改為你的 Railway 網址：

```js
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
});
```

在 `frontend/.env.production` 新增：
```
REACT_APP_API_URL=https://english-api.up.railway.app/api
```

---

## 第三步：部署前端到 Vercel

1. 前往 https://vercel.com 用 GitHub 登入
2. 點「New Project」→ 選你的 repository
3. 設定：
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. 在「Environment Variables」加入：
   - `REACT_APP_API_URL` = `https://你的railway網址/api`
5. 點「Deploy」！

完成後你會得到一個網址，例如：`https://english-learning.vercel.app`

---

## 其他方案比較

| 方案 | 前端 | 後端 | 費用 | 適合場景 |
|------|------|------|------|----------|
| **Vercel + Railway** | Vercel | Railway | 免費 | 推薦，最簡單 |
| **Netlify + Render** | Netlify | Render | 免費（後端冷啟動慢） | 備選 |
| **VPS 自架** | 同一台 | 同一台 | ~$5/月 | 完全控制 |
| **GitHub Pages** | GitHub Pages | Railway | 免費 | 靜態前端 |

---

## ⚠️ 多人使用注意事項

目前後端使用 **JSON 檔案** 存資料，多人同時寫入可能衝突。

### 升級到 MongoDB Atlas（免費雲端資料庫）

```bash
# 安裝 Mongoose
cd backend
npm install mongoose

# 在 Railway 設定環境變數
MONGODB_URI=mongodb+srv://你的連線字串
```

升級後可支援：
- ✅ 多人帳號系統
- ✅ 進度雲端同步
- ✅ 無限制用戶數

---

## 🎤 語音功能升級路徑

### 現在（Phase 1）✅
- **Web Speech API**（瀏覽器內建）
- 單字/例句朗讀
- 完全免費，不需 API Key

### 未來（Phase 2）
- **OpenAI TTS API** — 更自然的人聲
```js
// 示例
const response = await openai.audio.speech.create({
  model: "tts-1",
  voice: "alloy",
  input: "Hello, world!",
});
```

### 未來（Phase 3）— AI 口說練習
- **Web Speech Recognition API** — 錄音辨識
- **OpenAI Whisper** — 發音評分
- **GPT-4 對話** — 模擬英文對話

```js
// 口說練習示例架構
const recognition = new window.SpeechRecognition();
recognition.lang = 'en-US';
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  // 送給 GPT 評分或繼續對話
};
recognition.start();
```
