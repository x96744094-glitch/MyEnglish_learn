const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/vocabulary.json');

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

exports.getAll = (req, res) => {
  try {
    let words = readData();
    const { level, tag, page = 1, limit = 20 } = req.query;
    if (level) words = words.filter(w => w.level === level);
    if (tag) words = words.filter(w => w.tags && w.tags.includes(tag));
    const start = (page - 1) * limit;
    const paginated = words.slice(start, start + parseInt(limit));
    res.json({ total: words.length, page: parseInt(page), data: paginated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = (req, res) => {
  try {
    const words = readData();
    const word = words.find(w => w.id === req.params.id);
    if (!word) return res.status(404).json({ error: 'Word not found' });
    res.json(word);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.search = (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const words = readData();
    const results = words.filter(w =>
      w.word.toLowerCase().includes(q.toLowerCase()) ||
      w.translation.includes(q)
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = (req, res) => {
  try {
    const words = readData();
    const byLevel = words.reduce((acc, w) => {
      acc[w.level] = (acc[w.level] || 0) + 1;
      return acc;
    }, {});
    res.json({ total: words.length, byLevel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = (req, res) => {
  try {
    const words = readData();
    const newWord = { id: `word_${Date.now()}`, ...req.body };
    words.push(newWord);
    writeData(words);
    res.status(201).json(newWord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = (req, res) => {
  try {
    const words = readData();
    const index = words.findIndex(w => w.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Word not found' });
    words[index] = { ...words[index], ...req.body };
    writeData(words);
    res.json(words[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
