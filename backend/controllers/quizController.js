const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, '../data/vocabulary.json');
const quizzesPath = path.join(__dirname, '../data/quizzes.json');

function readVocab() { return JSON.parse(fs.readFileSync(vocabPath, 'utf8')); }
function readQuizzes() { return JSON.parse(fs.readFileSync(quizzesPath, 'utf8')); }
function writeQuizzes(data) { fs.writeFileSync(quizzesPath, JSON.stringify(data, null, 2)); }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

exports.generate = (req, res) => {
  try {
    const { level = 'A1', count = 10 } = req.body;
    const vocab = readVocab();
    const levelWords = vocab.filter(w => w.level === level);
    const otherWords = vocab.filter(w => w.level !== level);

    if (levelWords.length < 4) {
      return res.status(400).json({ error: 'Not enough words for this level' });
    }

    const selected = shuffle(levelWords).slice(0, Math.min(count, levelWords.length));
    const questions = selected.map(word => {
      const distractors = shuffle(
        vocab.filter(w => w.id !== word.id).map(w => w.translation)
      ).slice(0, 3);
      const options = shuffle([word.translation, ...distractors]);
      return {
        id: word.id,
        word: word.word,
        pronunciation: word.pronunciation,
        options,
        correctAnswer: word.translation
      };
    });

    const quizId = `quiz_${Date.now()}`;
    res.json({ quizId, level, questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submit = (req, res) => {
  try {
    const { userId, quizId, level, answers } = req.body;
    let correct = 0;
    const details = answers.map(a => {
      const isCorrect = a.userAnswer === a.correctAnswer;
      if (isCorrect) correct++;
      return { ...a, isCorrect };
    });
    const score = Math.round((correct / answers.length) * 100);

    const quizzes = readQuizzes();
    const result = {
      quizId: quizId || `quiz_${Date.now()}`,
      userId,
      level,
      score,
      correct,
      total: answers.length,
      details,
      date: new Date().toISOString()
    };
    quizzes.push(result);
    writeQuizzes(quizzes);

    let recommendation = null;
    if (score >= 80 && level !== 'B2') {
      const levels = ['A1', 'A2', 'B1', 'B2'];
      const next = levels[levels.indexOf(level) + 1];
      recommendation = { message: `Great job! Consider trying ${next} level.`, nextLevel: next };
    } else if (score < 50) {
      recommendation = { message: 'Keep practicing at this level!', nextLevel: level };
    }

    res.json({ score, correct, total: answers.length, details, recommendation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHistory = (req, res) => {
  try {
    const quizzes = readQuizzes();
    const history = quizzes.filter(q => q.userId === req.params.userId);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
