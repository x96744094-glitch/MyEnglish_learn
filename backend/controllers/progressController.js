const Progress = require('../models/Progress');
const Vocabulary = require('../models/Vocabulary');

exports.get = async (req, res) => {
  try {
    let user = await Progress.findOne({ userId: req.params.userId }).lean();
    if (!user) {
      user = await Progress.create({ userId: req.params.userId });
    }
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const user = await Progress.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addToNotebook = async (req, res) => {
  try {
    const { wordId } = req.body;
    const user = await Progress.findOneAndUpdate(
      { userId: req.params.userId },
      { $addToSet: { notebook: wordId } },
      { new: true, upsert: true }
    );
    res.json({ notebook: user.notebook });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getNotebook = async (req, res) => {
  try {
    const user = await Progress.findOne({ userId: req.params.userId }).lean();
    if (!user || !user.notebook.length) return res.json([]);
    const words = await Vocabulary.find({ _id: { $in: user.notebook } }).lean();
    res.json(words);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
