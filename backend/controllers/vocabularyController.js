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

    // 1. 先從 DB 查
    const existing = await Vocabulary.findOne({ word: { $regex: `^${word}$`, $options: 'i' } }).lean();
    if (existing) return res.json({ source: 'database', ...existing });

    // 2. 從英文字典 API 抓定義
    const dictUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    let apiData;
    try {
      const r = await fetch(dictUrl, { signal: AbortSignal.timeout(10000) });
      if (!r.ok) return res.status(404).json({ error: `找不到單字 "${word}"` });
      apiData = await r.json();
    } catch (e) {
      return res.status(404).json({ error: `找不到單字 "${word}"` });
    }

    const entry = Array.isArray(apiData) ? apiData[0] : apiData;
    const phonetic = entry.phonetic || entry.phonetics?.find(p => p.text)?.text || '';
    const meanings = entry.meanings || [];

    // 從所有 meanings 找詞性、定義、例句
    const firstMeaning = meanings[0] || {};
    const partOfSpeech = firstMeaning.partOfSpeech || '';
    const allDefs = meanings.flatMap(m => (m.definitions || []).map(d => ({ ...d, pos: m.partOfSpeech })));
    const firstDef = allDefs[0] || {};
    const definition = firstDef.definition || '';

    // 找例句（從所有 meanings/definitions 收集，最多 2 句）
    const examples = [];
    for (const m of meanings) {
      for (const d of (m.definitions || [])) {
        if (d.example && examples.length < 2) {
          examples.push({ sentence: d.example, translation: '' });
        }
      }
      if (examples.length >= 2) break;
    }

    // 3. 用 MyMemory 免費 API 翻譯成中文
    let chineseTranslation = definition;
    try {
      const transUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(definition)}&langpair=en|zh-TW`;
      const tr = await fetch(transUrl, { signal: AbortSignal.timeout(8000) });
      const trData = await tr.json();
      const translated = trData?.responseData?.translatedText;
      if (translated && !translated.includes('PLEASE SELECT')) {
        chineseTranslation = translated;
      }
    } catch (_) { /* 翻譯失敗就用英文定義 */ }

    // 4. 存入 DB
    const newWord = await Vocabulary.create({
      word: entry.word || word,
      pronunciation: phonetic,
      partOfSpeech,
      translation: chineseTranslation,
      explanation: definition,
      examples,
      level: 'B1',
      tags: ['auto-added'],
    });

    return res.json({ source: 'web', ...newWord.toObject() });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
