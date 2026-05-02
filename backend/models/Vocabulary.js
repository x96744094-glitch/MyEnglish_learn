const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  sentence: String,
  translation: String,
}, { _id: false });

const vocabularySchema = new mongoose.Schema({
  word: { type: String, required: true, index: true },
  pronunciation: String,
  partOfSpeech: String,
  translation: { type: String, required: true },
  explanation: String,
  examples: [exampleSchema],
  level: { type: String, enum: ['A1', 'A2', 'B1', 'B2'], index: true },
  tags: [String],
}, { timestamps: true });

vocabularySchema.index({ word: 'text', translation: 'text' });

module.exports = mongoose.model('Vocabulary', vocabularySchema);
