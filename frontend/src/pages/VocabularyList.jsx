import { useState, useEffect } from 'react';
import { vocabulary as vocabApi } from '../services/api';
import { LEVELS } from '../utils/constants';
import WordCard from '../components/WordCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const PAGE_SIZE = 12;

export default function VocabularyList({ userProgress }) {
  const [words, setWords] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [levelFilter, setLevelFilter] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [page, setPage] = useState(1);

  const { toggleNotebook, isInNotebook, toggleFav, isFavorite } = userProgress;

  const load = (lv, q, pg) => {
    setLoading(true);
    setError(null);
    const req = q
      ? vocabApi.search(q).then(data => { setWords(data); setTotal(data.length); })
      : vocabApi.getAll({ level: lv || undefined, page: pg, limit: PAGE_SIZE })
          .then(data => { setWords(data.data); setTotal(data.total); });
    req.catch(e => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { load(levelFilter, '', page); }, [levelFilter, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) load('', searchQ, 1);
    else load(levelFilter, '', 1);
  };

  const handleClearSearch = () => {
    setSearchQ('');
    load(levelFilter, '', 1);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📚 單字學習</h1>
        <p className="page-subtitle">共 {total} 個單字</p>
      </div>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="搜尋單字或中文翻譯..."
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">搜尋</button>
        {searchQ && <button type="button" className="btn btn-secondary" onClick={handleClearSearch}>清除</button>}
      </form>

      <div className="filter-bar">
        <button className={`filter-chip ${levelFilter === '' ? 'active' : ''}`} onClick={() => { setLevelFilter(''); setPage(1); }}>
          全部
        </button>
        {LEVELS.map(l => (
          <button key={l} className={`filter-chip ${levelFilter === l ? 'active' : ''}`} onClick={() => { setLevelFilter(l); setPage(1); }}>
            {l}
          </button>
        ))}
      </div>

      {error && <ErrorMessage message={error} onRetry={() => load(levelFilter, searchQ, page)} />}

      {loading ? (
        <LoadingSpinner />
      ) : words.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>沒有找到符合的單字</p>
        </div>
      ) : (
        <div className="card-grid">
          {words.map(word => (
            <WordCard
              key={word.id}
              word={word}
              onNotebook={toggleNotebook}
              onFavorite={toggleFav}
              inNotebook={isInNotebook(word.id)}
              isFav={isFavorite(word.id)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && !searchQ && (
        <div className="pagination">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
        </div>
      )}
    </div>
  );
}
