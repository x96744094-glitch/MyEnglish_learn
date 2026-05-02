const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/progress.json');
const vocabPath = path.join(__dirname, '../data/vocabulary.json');

function readData() { return JSON.parse(fs.readFileSync(dataPath, 'utf8')); }
function writeData(data) { fs.writeFileSync(dataPath, JSON.stringify(data, null, 2)); }

function getOrCreate(userId) {
  const all = readData();
  let user = all.find(u => u.userId === userId);
  if (!user) {
    user = {
      userId,
      level: 'A1',
      totalWordsLearned: 0,
      learnedWords: [],
      notebook: [],
      favorites: [],
      lastUpdated: new Date().toISOString()
    };
    all.push(user);
    writeData(all);
  }
  return user;
}

exports.get = (req, res) => {
  try {
    const user = getOrCreate(req.params.userId);
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = (req, res) => {
  try {
    const all = readData();
    const index = all.findIndex(u => u.userId === req.params.userId);
    if (index === -1) {
      const user = { userId: req.params.userId, ...req.body, lastUpdated: new Date().toISOString() };
      all.push(user);
      writeData(all);
      return res.json(user);
    }
    all[index] = { ...all[index], ...req.body, lastUpdated: new Date().toISOString() };
    writeData(all);
    res.json(all[index]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addToNotebook = (req, res) => {
  try {
    const { wordId } = req.body;
    const all = readData();
    let user = all.find(u => u.userId === req.params.userId);
    if (!user) {
      user = { userId: req.params.userId, level: 'A1', totalWordsLearned: 0, learnedWords: [], notebook: [], favorites: [] };
      all.push(user);
    }
    if (!user.notebook.includes(wordId)) {
      user.notebook.push(wordId);
    }
    user.lastUpdated = new Date().toISOString();
    writeData(all);
    res.json({ notebook: user.notebook });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getNotebook = (req, res) => {
  try {
    const user = getOrCreate(req.params.userId);
    const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
    const notebookWords = vocab.filter(w => user.notebook.includes(w.id));
    res.json(notebookWords);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
