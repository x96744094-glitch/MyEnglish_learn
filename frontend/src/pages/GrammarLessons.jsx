import { useState, useEffect } from 'react';
import { grammar as grammarApi } from '../services/api';
import { LEVELS } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function GrammarLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [levelFilter, setLevelFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    grammarApi.getAll(levelFilter ? { level: levelFilter } : {})
      .then(setLessons)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [levelFilter]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📖 文法課程</h1>
        <p className="page-subtitle">系統化學習英文文法</p>
      </div>

      <div className="filter-bar">
        <button className={`filter-chip ${levelFilter === '' ? 'active' : ''}`} onClick={() => setLevelFilter('')}>全部</button>
        {LEVELS.map(l => (
          <button key={l} className={`filter-chip ${levelFilter === l ? 'active' : ''}`} onClick={() => setLevelFilter(l)}>{l}</button>
        ))}
      </div>

      {error && <ErrorMessage message={error} />}
      {loading ? <LoadingSpinner /> : (
        lessons.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📖</div><p>沒有文法課程</p></div>
        ) : (
          lessons.map(lesson => (
            <div key={lesson.id} className="grammar-card">
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === lesson.id ? null : lesson.id)}
              >
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <h3 className="grammar-title" style={{ margin: 0 }}>{lesson.title}</h3>
                    <span className={`level-chip level-${lesson.level}`}>{lesson.level}</span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{lesson.description}</p>
                </div>
                <span style={{ color: '#4F46E5', fontSize: '1.2rem', flexShrink: 0, marginLeft: 16 }}>
                  {expanded === lesson.id ? '▲' : '▼'}
                </span>
              </div>

              {expanded === lesson.id && (
                <div style={{ marginTop: 20, borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
                  <div className="grammar-content" style={{ marginBottom: 20 }}>{lesson.content}</div>

                  {lesson.examples && (
                    <div style={{ marginBottom: 20 }}>
                      <h4 style={{ fontWeight: 600, marginBottom: 12 }}>例句</h4>
                      {lesson.examples.map((ex, i) => (
                        <div key={i} style={{ marginBottom: 12, paddingLeft: 16, borderLeft: '3px solid #4F46E5' }}>
                          <p style={{ fontWeight: 500, marginBottom: 2 }}>{ex.sentence}</p>
                          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 2 }}>{ex.translation}</p>
                          {ex.note && <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>※ {ex.note}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {lesson.exercises && lesson.exercises.length > 0 && (
                    <div>
                      <h4 style={{ fontWeight: 600, marginBottom: 12 }}>練習題</h4>
                      {lesson.exercises.map((ex, i) => (
                        <div key={i} className="card" style={{ marginBottom: 10, padding: '16px' }}>
                          <p style={{ fontWeight: 500, marginBottom: 8 }}>{i + 1}. {ex.question}</p>
                          <p style={{ color: '#10B981', fontWeight: 600, marginBottom: 4 }}>答案：{ex.answer}</p>
                          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>說明：{ex.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )
      )}
    </div>
  );
}
