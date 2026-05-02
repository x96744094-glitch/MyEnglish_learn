import { useState, useEffect } from 'react';
import { phrases as phrasesApi } from '../services/api';
import { LEVELS } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const TYPE_LABELS = { idiom: '慣用語', phrasal_verb: '片語動詞', colloquial: '口語' };

export default function PhrasesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [levelFilter, setLevelFilter] = useState('');
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    phrasesApi.getAll(levelFilter ? { level: levelFilter } : {})
      .then(setItems)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [levelFilter]);

  const filtered = searchQ
    ? items.filter(p => p.phrase.toLowerCase().includes(searchQ.toLowerCase()) || p.translation.includes(searchQ))
    : items;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🎭 常用片語</h1>
        <p className="page-subtitle">學習英文慣用語和日常片語</p>
      </div>

      <div className="search-bar">
        <input
          className="search-input"
          placeholder="搜尋片語..."
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
        />
        {searchQ && (
          <button className="btn btn-secondary" onClick={() => setSearchQ('')}>清除</button>
        )}
      </div>

      <div className="filter-bar">
        <button className={`filter-chip ${levelFilter === '' ? 'active' : ''}`} onClick={() => setLevelFilter('')}>全部</button>
        {LEVELS.map(l => (
          <button key={l} className={`filter-chip ${levelFilter === l ? 'active' : ''}`} onClick={() => setLevelFilter(l)}>{l}</button>
        ))}
      </div>

      {error && <ErrorMessage message={error} />}
      {loading ? <LoadingSpinner /> : (
        filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🎭</div><p>沒有找到片語</p></div>
        ) : (
          <div className="card-grid">
            {filtered.map(p => (
              <div key={p.id} className="phrase-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>{p.phrase}</h3>
                  <span className={`level-chip level-${p.level}`}>{p.level}</span>
                </div>
                <p style={{ color: '#4F46E5', fontWeight: 600, marginBottom: 8 }}>{p.translation}</p>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 12 }}>{p.usage}</p>
                {p.examples && p.examples[0] && (
                  <div style={{ borderLeft: '3px solid #7C3AED', paddingLeft: 12 }}>
                    <p style={{ fontSize: '0.875rem', fontStyle: 'italic', marginBottom: 2 }}>"{p.examples[0].sentence}"</p>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.examples[0].translation}</p>
                  </div>
                )}
                <div style={{ marginTop: 10 }}>
                  <span className="tag">{TYPE_LABELS[p.type] || p.type}</span>
                  {p.tags && p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
