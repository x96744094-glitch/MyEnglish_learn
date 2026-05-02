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
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

// ---- 路由 ----
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'ok', db: dbStatus, timestamp: new Date().toISOString() });
});

app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/grammar', grammarRoutes);
app.use('/api/phrases', phrasesRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ---- 啟動：先連 MongoDB，再開 HTTP ----
async function main() {
  if (!MONGODB_URI) {
    console.error('❌ 未設定 MONGODB_URI，請在 Railway Variables 新增此環境變數');
    process.exit(1);
  }

  console.log('⏳ 正在連線 MongoDB...');
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  });
  console.log('✅ MongoDB 連線成功');

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

main().catch(err => {
  console.error('❌ 啟動失敗:', err.message);
  process.exit(1);
});
