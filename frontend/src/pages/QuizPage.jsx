import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quiz as quizApi } from '../services/api';
import { LEVELS, LEVEL_LABELS } from '../utils/constants';
import QuizQuestion from '../components/QuizQuestion';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function QuizPage({ userProgress }) {
  const navigate = useNavigate();
  const { level, saveQuizResult, userId } = userProgress;

  const [stage, setStage] = useState('setup'); // setup | playing | done
  const [selectedLevel, setSelectedLevel] = useState(level);
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answeredCurrent, setAnsweredCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const startQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await quizApi.generate({ level: selectedLevel, count });
      setQuestions(data.questions);
      setAnswers([]);
      setCurrent(0);
      setAnsweredCurrent(null);
      setStage('playing');
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (opt) => {
    setAnsweredCurrent(opt);
  };

  const handleNext = async () => {
    const q = questions[current];
    const newAnswers = [...answers, { word: q.word, userAnswer: answeredCurrent, correctAnswer: q.correctAnswer }];
    setAnswers(newAnswers);

    if (current + 1 >= questions.length) {
      setLoading(true);
      try {
        const res = await quizApi.submit({ userId, level: selectedLevel, answers: newAnswers });
        saveQuizResult({ score: res.score, level: selectedLevel, correct: res.correct, total: res.total });
        setResult(res);
        setStage('done');
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    } else {
      setCurrent(current + 1);
      setAnsweredCurrent(null);
    }
  };

  if (stage === 'setup') return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">✅ 開始測驗</h1>
        <p className="page-subtitle">測試你的英文單字能力</p>
      </div>
      {error && <ErrorMessage message={error} />}
      <div className="card">
        <div className="form-group">
          <label className="form-label">選擇等級</label>
          <select className="form-select" value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}>
            {LEVELS.map(l => <option key={l} value={l}>{LEVEL_LABELS[l]}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">題目數量：{count} 題</label>
          <input
            type="range" min="5" max="20" step="5" value={count}
            onChange={e => setCount(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#4F46E5' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
            <span>5</span><span>10</span><span>15</span><span>20</span>
          </div>
        </div>
        <button className="btn btn-primary btn-lg" onClick={startQuiz} disabled={loading} style={{ width: '100%' }}>
          {loading ? '生成中...' : '🚀 開始測驗'}
        </button>
      </div>
    </div>
  );

  if (loading) return <LoadingSpinner text="計算結果..." />;

  if (stage === 'playing') {
    const q = questions[current];
    const progress = ((current) / questions.length) * 100;
    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="quiz-progress">
          <span style={{ fontSize: '0.875rem', color: '#64748b', whiteSpace: 'nowrap' }}>
            {current + 1} / {questions.length}
          </span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className={`level-chip level-${selectedLevel}`}>{selectedLevel}</span>
        </div>

        <QuizQuestion question={q} onAnswer={handleAnswer} answered={answeredCurrent} />

        {answeredCurrent && (
          <button className="btn btn-primary btn-lg" onClick={handleNext} style={{ width: '100%', marginTop: 16 }}>
            {current + 1 >= questions.length ? '查看結果 →' : '下一題 →'}
          </button>
        )}
      </div>
    );
  }

  if (stage === 'done' && result) {
    navigate('/quiz/result', { state: { result, level: selectedLevel } });
    return null;
  }

  return null;
}
