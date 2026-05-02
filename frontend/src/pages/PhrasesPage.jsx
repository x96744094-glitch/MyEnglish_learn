import { useState, useEffect } from 'react';
import { phrases as phrasesApi } from '../services/api';
import { LEVELS } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SpeakButton from '../components/SpeakButton';

const TYPE_LABELS = { idiom: '慣用語', phrasal_verb: '片語動詞', colloquial: '口語', formal: '正式用語' };
const TYPE_COLORS = { idiom: '#7C3AED', phrasal_verb: '#0891B2', colloquial: '#D97706', formal: '#059669' };

export default function PhrasesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [levelFilter, setLevelFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    const params = {};
    if (levelFilter) params.level = levelFilter;
    if (typeFilter) params.type = typeFilter;
    phrasesApi.getAll(params)
      .then(setItems)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [levelFilter, typeFilter]);

  const filtered = searchQ
    ? items.filter(p =>
        p.phrase.toLowerCase().includes(searchQ.toLowerCase()) ||
        p.translation.includes(searchQ)
      )
    : items;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🎭 常用片語</h1>
        <p className="page-subtitle">共 {filtered.length} 個片語 — 點 🔈 收聽發音</p>
      </div>

      <div className="search-bar">
        <input
          className="search-input"
          placeholder="搜尋片語或中文..."
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
        />
        {searchQ && <button className="btn btn-secondary" onClick={() => setSearchQ('')}>清除</button>}
      </div>

      {/* 等級篩選 */}
      <div className="filter-bar">
        <button className={`filter-chip ${levelFilter === '' ? 'active' : ''}`} onClick={() => setLevelFilter('')}>全部等級</button>
        {LEVELS.map(l => (
          <button key={l} className={`filter-chip ${levelFilter === l ? 'active' : ''}`} onClick={() => setLevelFilter(l)}>{l}</button>
        ))}
      </div>

      {/* 類型篩選 */}
      <div className="filter-bar" style={{ marginTop: -8 }}>
        <button className={`filter-chip ${typeFilter === '' ? 'active' : ''}`} onClick={() => setTypeFilter('')}>全部類型</button>
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <button key={key} className={`filter-chip ${typeFilter === key ? 'active' : ''}`} onClick={() => setTypeFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? <LoadingSpinner /> : (
        filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🎭</div><p>沒有找到片語</p></div>
        ) : (
          <div className="card-grid">
            {filtered.map(p => (
              <div key={p._id || p.id} className="phrase-card">
                {/* 片語標題 + 語音按鈕 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: 1 }}>
                    <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', margin: 0 }}>{p.phrase}</h3>
                    <SpeakButton text={p.phrase} size="sm" />
                  </div>
                  <span className={`level-chip level-${p.level}`} style={{ flexShrink: 0, marginLeft: 8 }}>{p.level}</span>
                </div>

                <p style={{ color: '#4F46E5', fontWeight: 600, marginBottom: 6 }}>{p.translation}</p>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 12 }}>{p.usage}</p>

                {/* 例句 + 語音 */}
                {p.examples && p.examples[0] && (
                  <div style={{ borderLeft: `3px solid ${TYPE_COLORS[p.type] || '#7C3AED'}`, paddingLeft: 12, marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <p style={{ fontSize: '0.875rem', fontStyle: 'italic', margin: 0, flex: 1 }}>
                        "{p.examples[0].sentence}"
                      </p>
                      <SpeakButton text={p.examples[0].sentence} size="sm" rate={0.85} />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.examples[0].translation}</p>
                  </div>
                )}

                {/* 標籤 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 4,
                    fontSize: '0.75rem', fontWeight: 600,
                    background: TYPE_COLORS[p.type] + '20',
                    color: TYPE_COLORS[p.type] || '#7C3AED',
                  }}>
                    {TYPE_LABELS[p.type] || p.type}
                  </span>
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
