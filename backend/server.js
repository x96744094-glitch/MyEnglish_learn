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

// 讓 Mongoose 的 buffer 等待最多 60 秒
mongoose.set('bufferTimeoutMS', 60000);

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

// ---- 先綁定 port（Railway 需要），背景連 MongoDB ----
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

if (!MONGODB_URI) {
  console.error('❌ 未設定 MONGODB_URI');
} else {
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    bufferCommands: true,
    // 查詢最多等 60 秒讓 MongoDB 連線完成
  });

  mongoose.connection.on('connected', () => console.log('✅ MongoDB 連線成功'));
  mongoose.connection.on('error', err => console.error('❌ MongoDB 錯誤:', err.message));
  mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB 斷線，嘗試重連...'));
}
