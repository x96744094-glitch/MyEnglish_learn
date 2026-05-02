import SpeakButton from './SpeakButton';

export default function QuizQuestion({ question, onAnswer, answered }) {
  return (
    <div>
      <div className="card" style={{ marginBottom: 24, textAlign: 'center', padding: '32px 24px' }}>
        {/* 單字 + 朗讀按鈕 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>
            {question.word}
          </div>
          <SpeakButton text={question.word} size="md" />
        </div>
        {question.pronunciation && (
          <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: 8 }}>
            {question.pronunciation}
          </div>
        )}
        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
          請選擇正確的中文翻譯：
        </div>
      </div>

      <div>
        {question.options.map((opt, i) => {
          let cls = 'quiz-option';
          if (answered) {
            if (opt === question.correctAnswer) cls += ' correct';
            else if (opt === answered && opt !== question.correctAnswer) cls += ' wrong';
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => !answered && onAnswer(opt)}
              disabled={!!answered}
            >
              <span style={{ marginRight: 10, color: '#94a3b8', fontWeight: 600 }}>
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`alert ${answered === question.correctAnswer ? 'alert-success' : 'alert-warning'}`} style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>
            {answered === question.correctAnswer
              ? '✅ 正確！'
              : `❌ 正確答案是：${question.correctAnswer}`}
          </span>
          {/* 答完後自動顯示朗讀按鈕 */}
          <SpeakButton text={question.word} size="sm" showLabel={false} />
        </div>
      )}
    </div>
  );
}
