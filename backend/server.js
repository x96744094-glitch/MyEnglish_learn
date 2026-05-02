const express = require('express');
const cors = require('cors');
const vocabularyRoutes = require('./routes/vocabulary');
const grammarRoutes = require('./routes/grammar');
const phrasesRoutes = require('./routes/phrases');
const quizRoutes = require('./routes/quiz');
const progressRoutes = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'English Learning API is running', timestamp: new Date().toISOString() });
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
