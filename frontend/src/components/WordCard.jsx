import { Link } from 'react-router-dom';
import { PARTS_OF_SPEECH } from '../utils/constants';
import SpeakButton from './SpeakButton';

export default function WordCard({ word, onNotebook, onFavorite, inNotebook, isFav }) {
  return (
    <div className="word-card" style={{ position: 'relative' }}>
      <Link to={`/vocabulary/${word.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <span className="word-card-word">{word.word}</span>
          <span className={`level-chip level-${word.level}`}>{word.level}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="word-card-pronunciation">{word.pronunciation}</span>
          <SpeakButton text={word.word} size="sm" />
        </div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 4 }}>
          {PARTS_OF_SPEECH[word.partOfSpeech] || word.partOfSpeech}
        </div>
        <div className="word-card-translation">{word.translation}</div>
      </Link>
      <div className="word-card-footer">
        <div>
          {word.tags && word.tags.slice(0, 2).map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {onNotebook && (
            <button
              onClick={(e) => { e.preventDefault(); onNotebook(word.id); }}
              title={inNotebook ? '從筆記本移除' : '加入筆記本'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '2px 4px' }}
            >
              {inNotebook ? '📌' : '📍'}
            </button>
          )}
          {onFavorite && (
            <button
              onClick={(e) => { e.preventDefault(); onFavorite(word.id); }}
              title={isFav ? '取消收藏' : '收藏'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '2px 4px' }}
            >
              {isFav ? '⭐' : '☆'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
