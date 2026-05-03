const Vocabulary = require('../models/Vocabulary');

exports.getAll = async (req, res) => {
  try {
    const { level, tag, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (level) filter.level = level;
    if (tag) filter.tags = tag;
    const skip = (page - 1) * parseInt(limit);
    const [data, total] = await Promise.all([
      Vocabulary.find(filter).skip(skip).limit(parseInt(limit)).lean(),
      Vocabulary.countDocuments(filter),
    ]);
    res.json({ total, page: parseInt(page), data });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const word = await Vocabulary.findById(req.params.id).lean();
    if (!word) return res.status(404).json({ error: 'Word not found' });
    res.json(word);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const results = await Vocabulary.find({
      $or: [
        { word: { $regex: q, $options: 'i' } },
        { translation: { $regex: q, $options: 'i' } },
      ]
    }).limit(30).lean();
    res.json(results);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Vocabulary.countDocuments();
    const byLevelData = await Vocabulary.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);
    const byLevel = byLevelData.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
    res.json({ total, byLevel });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const word = await Vocabulary.create(req.body);
    res.status(201).json(word);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const word = await Vocabulary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!word) return res.status(404).json({ error: 'Word not found' });
    res.json(word);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.lookup = async (req, res) => {
  try {
    const { word } = req.params;
    if (!word) return res.status(400).json({ error: 'Word is required' });

    // Search DB first (case-insensitive)
    const existing = await Vocabulary.findOne({ word: { $regex: `^${word}$`, $options: 'i' } }).lean();
    if (existing) {
      return res.json({ source: 'database', ...existing });
    }

    // Fetch from dictionary API
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    let apiData;
    try {
      const response = await fetch(apiUrl, { signal: AbortSignal.timeout(10000) });
      if (!response.ok) {
        return res.status(404).json({ error: `Word "${word}" not found` });
      }
      apiData = await response.json();
    } catch (fetchErr) {
      return res.status(404).json({ error: `Word "${word}" not found and external lookup failed` });
    }

    // Parse API response
    const entry = Array.isArray(apiData) ? apiData[0] : apiData;
    const phonetic = entry.phonetic || (entry.phonetics && entry.phonetics.find(p => p.text)?.text) || '';
    const meanings = entry.meanings || [];
    const firstMeaning = meanings[0] || {};
    const partOfSpeech = firstMeaning.partOfSpeech || '';
    const definitions = firstMeaning.definitions || [];
    const firstDef = definitions[0] || {};
    const definition = firstDef.definition || '';
    const example = firstDef.example || '';

    // Save to MongoDB
    const newWord = await Vocabulary.create({
      word: entry.word || word,
      pronunciation: phonetic,
      partOfSpeech,
      translation: definition,
      explanation: definition,
      examples: example ? [{ sentence: example, translation: '' }] : [],
      level: 'B1',
      tags: ['auto-added'],
    });

    return res.json({ source: 'web', ...newWord.toObject() });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
