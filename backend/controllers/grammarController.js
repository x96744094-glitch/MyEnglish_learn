const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/grammar.json');

function readData() { return JSON.parse(fs.readFileSync(dataPath, 'utf8')); }
function writeData(data) { fs.writeFileSync(dataPath, JSON.stringify(data, null, 2)); }

exports.getAll = (req, res) => {
  try {
    let items = readData();
    const { level } = req.query;
    if (level) items = items.filter(i => i.level === level);
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getById = (req, res) => {
  try {
    const items = readData();
    const item = items.find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = (req, res) => {
  try {
    const items = readData();
    const newItem = { id: `grammar_${Date.now()}`, ...req.body };
    items.push(newItem);
    writeData(items);
    res.status(201).json(newItem);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = (req, res) => {
  try {
    const items = readData();
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Not found' });
    items[index] = { ...items[index], ...req.body };
    writeData(items);
    res.json(items[index]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
