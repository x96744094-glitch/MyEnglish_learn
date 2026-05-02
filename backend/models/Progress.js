const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  level: { type: String, default: 'A1' },
  totalWordsLearned: { type: Number, default: 0 },
  learnedWords: [String],
  notebook: [String],
  favorites: [String],
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
