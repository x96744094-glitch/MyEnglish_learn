import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getScoreClass, getScoreEmoji } from '../utils/helpers';

export default function QuizResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.result) {
    return (
      <div className="empty-state">
        <p>沒有測驗結果</p>
        <Link to="/quiz" className="btn btn-primary" style={{ marginTop: 16 }}>去測驗</Link>
      </div>
    );
  }

  const { result, level } = state;
  const scoreClass = getScoreClass(result.score);
  const emoji = getScoreEmoji(result.score);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1 className="page-title">測驗結果</h1>
      </div>

      <div className="card" style={{ textAlign: 'center', marginBottom: 20 }}>
        <div className={`score-circle ${scoreClass}`} style={{ marginBottom: 16 }}>
          <div className="score-number">{result.score}%</div>
          <div className="score-label">得分</div>
        </div>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>{emoji}</div>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>
          {result.correct} / {result.total} 題答對
        </p>
        <span className={`level-chip level-${level}`}>{level} 等級</span>

        {result.recommendation && (
          <div className="alert alert-info" style={{ marginTop: 16, textAlign: 'left' }}>
            💡 {result.recommendation.message}
          </div>
        )}
      </div>

      {result.details && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>答題詳情</h3>
          {result.details.map((d, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
              borderBottom: i < result.details.length - 1 ? '1px solid #f1f5f9' : 'none'
            }}>
              <span style={{ fontSize: '1.1rem' }}>{d.isCorrect ? '✅' : '❌'}</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>{d.word}</span>
                {!d.isCorrect && (
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>
                    你的答案：<span style={{ color: '#EF4444' }}>{d.userAnswer}</span>
                    　正確：<span style={{ color: '#10B981' }}>{d.correctAnswer}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/quiz')}>
          再測一次
        </button>
        <Link to="/" className="btn btn-secondary" style={{ flex: 1 }}>
          回首頁
        </Link>
      </div>
    </div>
  );
}
