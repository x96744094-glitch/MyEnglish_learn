const Vocabulary = require('../models/Vocabulary');
const Quiz = require('../models/Quiz');

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

exports.generate = async (req, res) => {
  try {
    const { level = 'A1', count = 10 } = req.body;
    const levelWords = await Vocabulary.find({ level }).lean();
    if (levelWords.length < 4) {
      return res.status(400).json({ error: 'Not enough words for this level' });
    }
    const allTranslations = await Vocabulary.find({}, 'translation').lean();
    const selected = shuffle(levelWords).slice(0, Math.min(parseInt(count), levelWords.length));
    const questions = selected.map(word => {
      const distractors = shuffle(
        allTranslations.filter(w => w._id.toString() !== word._id.toString()).map(w => w.translation)
      ).slice(0, 3);
      const options = shuffle([word.translation, ...distractors]);
      return {
        id: word._id,
        word: word.word,
        pronunciation: word.pronunciation,
        options,
        correctAnswer: word.translation,
      };
    });
    res.json({ quizId: `quiz_${Date.now()}`, level, questions });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.submit = async (req, res) => {
  try {
    const { userId, level, answers } = req.body;
    let correct = 0;
    const details = answers.map(a => {
      const isCorrect = a.userAnswer === a.correctAnswer;
      if (isCorrect) correct++;
      return { ...a, isCorrect };
    });
    const score = Math.round((correct / answers.length) * 100);
    await Quiz.create({ quizId: `quiz_${Date.now()}`, userId, level, score, correct, total: answers.length, details });

    let recommendation = null;
    const levels = ['A1', 'A2', 'B1', 'B2'];
    const idx = levels.indexOf(level);
    if (score >= 80 && idx < 3) recommendation = { message: `很棒！可以嘗試 ${levels[idx + 1]} 等級了！`, nextLevel: levels[idx + 1] };
    else if (score < 50) recommendation = { message: '繼續練習這個等級！', nextLevel: level };

    res.json({ score, correct, total: answers.length, details, recommendation });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Quiz.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(50).lean();
    res.json(history);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
