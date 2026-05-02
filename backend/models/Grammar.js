const mongoose = require('mongoose');

const grammarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  level: { type: String, enum: ['A1', 'A2', 'B1', 'B2'], index: true },
  description: String,
  content: String,
  examples: [{ sentence: String, translation: String, note: String }],
  exercises: [{ question: String, answer: String, explanation: String }],
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Grammar', grammarSchema);
