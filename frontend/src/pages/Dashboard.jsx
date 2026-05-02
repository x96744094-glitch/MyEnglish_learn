import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vocabulary as vocabApi } from '../services/api';
import { LEVEL_LABELS } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard({ userProgress }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vocabApi.getStats()
      .then(setStats)
      .catch(() => setStats({ total: 0, byLevel: {} }))
      .finally(() => setLoading(false));
  }, []);

  const { level, learnedWords, quizHistory } = userProgress;
  const avgScore = quizHistory.length
    ? Math.round(quizHistory.reduce((s, q) => s + q.score, 0) / quizHistory.length)
    : 0;

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">學習儀表板 👋</h1>
        <p className="page-subtitle">目前等級：<strong>{LEVEL_LABELS[level]}</strong></p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{learnedWords.length}</div>
          <div className="stat-label">已學單字</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{quizHistory.length}</div>
          <div className="stat-label">測驗次數</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{avgScore > 0 ? avgScore + '%' : '--'}</div>
          <div className="stat-label">平均分數</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.total || 0}</div>
          <div className="stat-label">題庫總單字</div>
        </div>
      </div>

      <div className="card-grid" style={{ marginBottom: 32 }}>
        <Link to="/vocabulary" className="card" style={{ textDecoration: 'none', color: 'inherit', borderTop: '3px solid #4F46E5' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📚</div>
          <h3 style={{ fontWeight: 700, marginBottom: 6 }}>單字學習</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>瀏覽 {stats?.total || 0} 個單字，依等級分類學習</p>
        </Link>
        <Link to="/quiz" className="card" style={{ textDecoration: 'none', color: 'inherit', borderTop: '3px solid #7C3AED' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
          <h3 style={{ fontWeight: 700, marginBottom: 6 }}>開始測驗</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>自適應難度測驗，測試你的學習成果</p>
        </Link>
        <Link to="/grammar" className="card" style={{ textDecoration: 'none', color: 'inherit', borderTop: '3px solid #059669' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📖</div>
          <h3 style={{ fontWeight: 700, marginBottom: 6 }}>文法課程</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>系統化學習英文文法知識</p>
        </Link>
        <Link to="/phrases" className="card" style={{ textDecoration: 'none', color: 'inherit', borderTop: '3px solid #DC2626' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎭</div>
          <h3 style={{ fontWeight: 700, marginBottom: 6 }}>常用片語</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>學習日常英文慣用語和片語</p>
        </Link>
        <Link to="/notebook" className="card" style={{ textDecoration: 'none', color: 'inherit', borderTop: '3px solid #D97706' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📝</div>
          <h3 style={{ fontWeight: 700, marginBottom: 6 }}>我的筆記本</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>查看已儲存的單字，複習重點內容</p>
        </Link>
      </div>

      {quizHistory.length > 0 && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>最近測驗記錄</h3>
          {quizHistory.slice(0, 5).map((q, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none' }}>
              <div>
                <span className={`level-chip level-${q.level}`} style={{ marginRight: 8 }}>{q.level}</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{formatDate(q.date)}</span>
              </div>
              <div style={{ fontWeight: 700, color: q.score >= 80 ? '#10B981' : q.score >= 60 ? '#4F46E5' : '#EF4444' }}>
                {q.score}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
