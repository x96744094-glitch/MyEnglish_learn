const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  quizId: String,
  userId: { type: String, index: true },
  level: String,
  score: Number,
  correct: Number,
  total: Number,
  details: [{ word: String, userAnswer: String, correctAnswer: String, isCorrect: Boolean }],
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
