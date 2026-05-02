const Phrase = require('../models/Phrase');

exports.getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.level) filter.level = req.query.level;
    if (req.query.type) filter.type = req.query.type;
    const items = await Phrase.find(filter).lean();
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const item = await Phrase.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const item = await Phrase.create(req.body);
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const item = await Phrase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
