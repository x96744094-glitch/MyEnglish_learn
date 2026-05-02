const mongoose = require('mongoose');

const phraseSchema = new mongoose.Schema({
  phrase: { type: String, required: true },
  translation: { type: String, required: true },
  type: { type: String, enum: ['idiom', 'phrasal_verb', 'colloquial', 'formal'] },
  usage: String,
  examples: [{ sentence: String, translation: String }],
  level: { type: String, enum: ['A1', 'A2', 'B1', 'B2'], index: true },
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Phrase', phraseSchema);
