import { useState } from 'react';
import { speak, stopSpeech, isSpeechSupported } from '../utils/speech';

/**
 * 語音播放按鈕
 * @param {string} text - 要朗讀的英文文字
 * @param {'sm'|'md'|'lg'} size - 按鈕大小
 * @param {number} rate - 語速 (0.5~2)
 * @param {boolean} showLabel - 是否顯示文字標籤
 */
export default function SpeakButton({ text, size = 'md', rate = 0.85, showLabel = false }) {
  const [playing, setPlaying] = useState(false);

  if (!isSpeechSupported()) return null;

  const sizes = {
    sm: { fontSize: '0.9rem', padding: '3px 7px', iconSize: '0.85rem' },
    md: { fontSize: '1rem', padding: '5px 10px', iconSize: '1rem' },
    lg: { fontSize: '1.2rem', padding: '8px 14px', iconSize: '1.1rem' },
  };
  const s = sizes[size];

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (playing) {
      stopSpeech();
      setPlaying(false);
      return;
    }
    speak(text, {
      rate,
      onStart: () => setPlaying(true),
      onEnd: () => setPlaying(false),
    });
  };

  return (
    <button
      onClick={handleClick}
      title={playing ? '停止播放' : `朗讀：${text}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: s.padding,
        background: playing ? '#EEF2FF' : 'transparent',
        border: `1.5px solid ${playing ? '#4F46E5' : '#e2e8f0'}`,
        borderRadius: 6,
        cursor: 'pointer',
        color: playing ? '#4F46E5' : '#64748b',
        fontSize: s.iconSize,
        transition: 'all 0.2s',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        if (!playing) {
          e.currentTarget.style.borderColor = '#4F46E5';
          e.currentTarget.style.color = '#4F46E5';
        }
      }}
      onMouseLeave={e => {
        if (!playing) {
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.color = '#64748b';
        }
      }}
    >
      {playing ? (
        <>
          <span style={{ animation: 'pulse 0.8s infinite' }}>🔊</span>
          {showLabel && <span style={{ fontSize: s.fontSize }}>播放中...</span>}
        </>
      ) : (
        <>
          <span>🔈</span>
          {showLabel && <span style={{ fontSize: s.fontSize }}>朗讀</span>}
        </>
      )}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </button>
  );
}
