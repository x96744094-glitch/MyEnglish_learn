import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vocabulary as vocabApi } from '../services/api';
import { PARTS_OF_SPEECH } from '../utils/constants';
import { speak } from '../utils/speech';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SpeakButton from '../components/SpeakButton';

export default function WordDetail({ userProgress }) {
  const { id } = useParams();
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { toggleNotebook, isInNotebook, toggleFav, isFavorite, markLearned, learnedWords } = userProgress;

  useEffect(() => {
    vocabApi.getById(id)
      .then(setWord)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!word) return null;

  const learned = learnedWords.includes(word._id || word.id);
  const inNb = isInNotebook(word._id || word.id);
  const fav = isFavorite(word._id || word.id);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/vocabulary" className="btn btn-secondary btn-sm">← 返回單字列表</Link>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            {/* 單字標題 + 大型語音按鈕 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{word.word}</h1>
              <SpeakButton text={word.word} size="lg" showLabel={true} />
            </div>
            <div style={{ color: '#94a3b8', fontSize: '1rem', fontStyle: 'italic', marginBottom: 8 }}>{word.pronunciation}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className={`level-chip level-${word.level}`}>{word.level}</span>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                {PARTS_OF_SPEECH[word.partOfSpeech] || word.partOfSpeech}
              </span>
              {/* 慢速朗讀按鈕 */}
              <SpeakButton text={word.word} size="sm" rate={0.5} showLabel={false} />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>慢速</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => toggleFav(word._id || word.id)} className="btn btn-secondary btn-sm">
              {fav ? '⭐ 已收藏' : '☆ 收藏'}
            </button>
            <button onClick={() => toggleNotebook(word._id || word.id)} className="btn btn-secondary btn-sm">
              {inNb ? '📌 已加入筆記' : '📍 加入筆記'}
            </button>
            {!learned && (
              <button onClick={() => markLearned(word._id || word.id)} className="btn btn-success btn-sm">
                ✅ 標記已學
              </button>
            )}
            {learned && <span style={{ color: '#10B981', fontSize: '0.85rem', alignSelf: 'center' }}>✅ 已學習</span>}
          </div>
        </div>

        <hr className="divider" />

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: 6 }}>中文翻譯</h3>
          <p style={{ fontSize: '1.2rem', color: '#1e293b', fontWeight: 500 }}>{word.translation}</p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: 6 }}>英文解釋</h3>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <p style={{ color: '#475569', lineHeight: 1.7, flex: 1 }}>{word.explanation}</p>
            <SpeakButton text={word.explanation} size="sm" rate={0.9} />
          </div>
        </div>

        {word.tags && word.tags.length > 0 && (
          <div>
            <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: 6 }}>標籤</h3>
            <div>{word.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
          </div>
        )}
      </div>

      {word.examples && word.examples.length > 0 && (
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: 16 }}>例句</h2>
          {word.examples.map((ex, i) => (
            <div key={i} style={{ marginBottom: 16, paddingLeft: 16, borderLeft: '3px solid #4F46E5' }}>
              {/* 例句 + 朗讀按鈕 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <p style={{ fontSize: '1rem', color: '#0f172a', margin: 0, flex: 1 }}>{ex.sentence}</p>
                <SpeakButton text={ex.sentence} size="sm" />
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{ex.translation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
