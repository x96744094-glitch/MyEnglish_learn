import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { progress as progressApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import SpeakButton from '../components/SpeakButton';

export default function NotebookPage({ userProgress }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userId, notebook, toggleNotebook } = userProgress;

  useEffect(() => {
    progressApi.getNotebook(userId)
      .then(setWords)
      .catch(() => setWords([]))
      .finally(() => setLoading(false));
  }, [userId, notebook.length]);

  const handleExport = () => {
    const text = words.map(w => `${w.word} - ${w.translation}\n  ${w.explanation}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'notebook.txt';
    a.click();
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">📝 我的筆記本</h1>
          <p className="page-subtitle">已儲存 {words.length} 個單字</p>
        </div>
        {words.length > 0 && (
          <button className="btn btn-secondary" onClick={handleExport}>⬇️ 匯出筆記</button>
        )}
      </div>

      {loading ? <LoadingSpinner /> : (
        words.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p style={{ marginBottom: 16 }}>筆記本還是空的</p>
            <Link to="/vocabulary" className="btn btn-primary">去加入單字</Link>
          </div>
        ) : (
          <div>
            {words.map(word => (
              <div key={word.id} className="notebook-item">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <Link to={`/vocabulary/${word.id}`} style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', textDecoration: 'none' }}>
                      {word.word}
                    </Link>
                    <SpeakButton text={word.word} size="sm" />
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>{word.pronunciation}</span>
                    <span className={`level-chip level-${word.level}`}>{word.level}</span>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.875rem' }}>{word.translation}</p>
                </div>
                <button
                  onClick={() => toggleNotebook(word.id)}
                  className="btn btn-danger btn-sm"
                  style={{ flexShrink: 0 }}
                >
                  移除
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
