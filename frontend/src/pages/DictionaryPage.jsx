import { useState, useEffect } from 'react';
import { dictionary as dictionaryApi } from '../services/api';
import SpeakButton from '../components/SpeakButton';

const HISTORY_KEY = 'dictionary_search_history';

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(word) {
  const prev = getHistory().filter(w => w.toLowerCase() !== word.toLowerCase());
  const updated = [word, ...prev].slice(0, 10);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export default function DictionaryPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState(getHistory);

  const handleSearch = async (word) => {
    const trimmed = (word || query).trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await dictionaryApi.lookup(trimmed);
      setResult(data);
      setHistory(saveHistory(trimmed));
      setQuery(trimmed);
    } catch (err) {
      setError(err.message || `找不到「${trimmed}」的定義`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') handleSearch();
  };

  const exampleSentence = result?.examples?.[0]?.sentence || '';

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 8, color: '#1e293b' }}>📖 字典查詢</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>輸入英文單字，即時查詢定義與例句</p>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="輸入英文單字..."
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: 10,
            fontSize: '1.1rem',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#4F46E5'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          autoFocus
        />
        <button
          onClick={() => handleSearch()}
          disabled={loading || !query.trim()}
          style={{
            padding: '12px 20px',
            background: '#4F46E5',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: '1.2rem',
            cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !query.trim() ? 0.6 : 1,
            transition: 'opacity 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          🔍
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
          <p>查詢中...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px 20px', borderRadius: 10, marginBottom: 24 }}>
          {error}
        </div>
      )}

      {/* Result card */}
      {!loading && result && (
        <div className="card" style={{ marginBottom: 24 }}>
          {/* Source badge */}
          <div style={{ marginBottom: 16 }}>
            {result.source === 'database' ? (
              <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600 }}>
                📚 資料庫
              </span>
            ) : (
              <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 12px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600 }}>
                🌐 即時查詢
              </span>
            )}
          </div>

          {/* Word + pronunciation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{result.word}</h2>
            <SpeakButton text={result.word} size="lg" />
          </div>

          {result.pronunciation && (
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: 12, fontStyle: 'italic' }}>
              {result.pronunciation}
            </p>
          )}

          {/* Part of speech */}
          {result.partOfSpeech && (
            <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: 6, fontSize: '0.85rem', fontWeight: 500, display: 'inline-block', marginBottom: 12 }}>
              {result.partOfSpeech}
            </span>
          )}

          {/* Translation / definition */}
          {(result.translation || result.explanation) && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>定義 / 翻譯</p>
              <p style={{ fontSize: '1.1rem', color: '#1e293b' }}>{result.translation || result.explanation}</p>
            </div>
          )}

          {/* Example sentence */}
          {exampleSentence && (
            <div style={{ background: '#f8fafc', borderLeft: '4px solid #4F46E5', padding: '12px 16px', borderRadius: '0 8px 8px 0' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>例句</p>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <p style={{ fontSize: '1rem', color: '#334155', margin: 0, flex: 1, fontStyle: 'italic' }}>{exampleSentence}</p>
                <SpeakButton text={exampleSentence} size="sm" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search history */}
      {history.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b', marginBottom: 10 }}>最近查詢</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {history.map((w, i) => (
              <button
                key={i}
                onClick={() => { setQuery(w); handleSearch(w); }}
                style={{
                  padding: '5px 14px',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: 20,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#475569',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ff'; e.currentTarget.style.color = '#4F46E5'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
