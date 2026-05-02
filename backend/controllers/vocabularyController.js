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
