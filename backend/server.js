const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const vocabularyRoutes = require('./routes/vocabulary');
const grammarRoutes = require('./routes/grammar');
const phrasesRoutes = require('./routes/phrases');
const quizRoutes = require('./routes/quiz');
const progressRoutes = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// MongoDB 連線後才啟動 server
const MONGODB_URI = process.env.MONGODB_URI;

async function startServer() {
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
      console.log('✅ MongoDB 連線成功');
    } catch (err) {
      console.error('❌ MongoDB 連線失敗:', err.message);
      // 連線失敗仍啟動，但 DB 相關路由會回傳 503
    }
  } else {
    console.warn('⚠️  未設定 MONGODB_URI 環境變數');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'ok', message: 'English Learning API is running', db: dbStatus, timestamp: new Date().toISOString() });
});

// 檢查 DB 連線狀態的 middleware
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: '資料庫未連線，請稍後再試。', db: 'disconnected' });
  }
  next();
});

app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/grammar', grammarRoutes);
app.use('/api/phrases', phrasesRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

startServer();
