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
// 清理環境變數（移除引號、空白，並修正注音符號誤植）
const MONGODB_URI = (process.env.MONGODB_URI || '')
  .trim()
  .replace(/^["']|["']$/g, '')
  .replace(/\s/g, '')
  .replace(/ㄦ/g, '-')   // 修正輸入法將 - 誤轉為 ㄦ
  .replace(/－/g, '-')   // 修正全形連字號
  .replace(/—/g, '-');   // 修正破折號
const VERSION = 'v7';

app.use(cors());
app.use(express.json());

// ---- 路由 ----
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'ok', version: VERSION, db: dbStatus, readyState: mongoose.connection.readyState, timestamp: new Date().toISOString() });
});

app.get('/api/debug', async (req, res) => {
  const Vocabulary = require('./models/Vocabulary');
  try {
    const count = await Vocabulary.countDocuments();
    res.json({
      version: VERSION,
      hasMongoUri: !!MONGODB_URI,
      uriPrefix: MONGODB_URI ? MONGODB_URI.substring(0, 35) + '...' : 'NOT SET',
      readyState: mongoose.connection.readyState,
      dbName: mongoose.connection.db?.databaseName || 'unknown',
      vocabularyCount: count,
    });
  } catch(err) {
    res.json({ version: VERSION, hasMongoUri: !!MONGODB_URI, readyState: mongoose.connection.readyState, error: err.message });
  }
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

// ---- 先綁定 port，背景連 MongoDB ----
app.listen(PORT, () => {
  console.log(`🚀 Server ${VERSION} running on port ${PORT}`);
});

if (!MONGODB_URI) {
  console.error('❌ 未設定 MONGODB_URI');
} else {
  console.log('⏳ 正在連線 MongoDB...');
  console.log('URI 前綴:', MONGODB_URI.substring(0, 20));

  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 60000,
    connectTimeoutMS: 60000,
    socketTimeoutMS: 60000,
  });

  mongoose.connection.on('connected', () => console.log('✅ MongoDB 連線成功'));
  mongoose.connection.on('error', err => console.error('❌ MongoDB 錯誤:', err.message));
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB 斷線，Mongoose 將自動重連...');
  });
}
