// Web Speech API 語音工具
// 未來升級路徑：speechSynthesis → OpenAI TTS → AI 對話練習

const ENGLISH_VOICE_PREF = ['en-US', 'en-GB', 'en-AU', 'en'];

/**
 * 取得最佳英文語音
 */
function getBestVoice() {
  const voices = window.speechSynthesis.getVoices();
  // 優先找高品質英文聲音
  for (const lang of ENGLISH_VOICE_PREF) {
    const match = voices.find(v => v.lang.startsWith(lang) && v.localService);
    if (match) return match;
  }
  // 次選線上聲音
  for (const lang of ENGLISH_VOICE_PREF) {
    const match = voices.find(v => v.lang.startsWith(lang));
    if (match) return match;
  }
  return null;
}

/**
 * 朗讀英文文字
 * @param {string} text - 要朗讀的文字
 * @param {object} options - 選項
 * @param {number} options.rate - 語速 (0.5~2, 預設 0.85)
 * @param {number} options.pitch - 音調 (0~2, 預設 1)
 * @param {function} options.onStart - 開始回調
 * @param {function} options.onEnd - 結束回調
 */
export function speak(text, options = {}) {
  if (!window.speechSynthesis) {
    console.warn('此瀏覽器不支援語音功能');
    return;
  }

  // 取消目前正在播放的語音
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = options.rate || 0.85;
  utterance.pitch = options.pitch || 1;
  utterance.volume = 1;

  // 設定語音（等待聲音列表載入）
  const setVoiceAndSpeak = () => {
    const voice = getBestVoice();
    if (voice) utterance.voice = voice;
    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    utterance.onerror = (e) => console.warn('語音播放錯誤:', e.error);
    window.speechSynthesis.speak(utterance);
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    setVoiceAndSpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      setVoiceAndSpeak();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }
}

/**
 * 停止播放
 */
export function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * 是否支援語音
 */
export function isSpeechSupported() {
  return 'speechSynthesis' in window;
}
