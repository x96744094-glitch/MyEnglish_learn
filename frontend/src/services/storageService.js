const KEYS = {
  USER_ID: 'english_user_id',
  USER_LEVEL: 'english_user_level',
  PROGRESS: 'english_user_progress',
  LEARNED_WORDS: 'english_learned_words',
  NOTEBOOK: 'english_notebook',
  FAVORITES: 'english_favorites',
  QUIZ_HISTORY: 'english_quiz_history',
};

const get = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch { return fallback; }
};

const set = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

export const getUserId = () => {
  let id = get(KEYS.USER_ID);
  if (!id) {
    id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    set(KEYS.USER_ID, id);
  }
  return id;
};

export const getLevel = () => get(KEYS.USER_LEVEL, 'A1');
export const setLevel = (level) => set(KEYS.USER_LEVEL, level);

export const getProgress = () => get(KEYS.PROGRESS, { totalWordsLearned: 0, quizzesTaken: 0, avgScore: 0 });
export const setProgress = (p) => set(KEYS.PROGRESS, p);

export const getLearnedWords = () => get(KEYS.LEARNED_WORDS, []);
export const addLearnedWord = (wordId) => {
  const words = getLearnedWords();
  if (!words.includes(wordId)) { words.push(wordId); set(KEYS.LEARNED_WORDS, words); }
};

export const getNotebook = () => get(KEYS.NOTEBOOK, []);
export const addToNotebook = (wordId) => {
  const nb = getNotebook();
  if (!nb.includes(wordId)) { nb.push(wordId); set(KEYS.NOTEBOOK, nb); }
};
export const removeFromNotebook = (wordId) => {
  const nb = getNotebook().filter(id => id !== wordId);
  set(KEYS.NOTEBOOK, nb);
};

export const getFavorites = () => get(KEYS.FAVORITES, []);
export const toggleFavorite = (wordId) => {
  const favs = getFavorites();
  const idx = favs.indexOf(wordId);
  if (idx === -1) favs.push(wordId); else favs.splice(idx, 1);
  set(KEYS.FAVORITES, favs);
  return !favs.includes(wordId);
};
export const isFavorite = (wordId) => getFavorites().includes(wordId);

export const getQuizHistory = () => get(KEYS.QUIZ_HISTORY, []);
export const addQuizResult = (result) => {
  const history = getQuizHistory();
  history.unshift({ ...result, date: new Date().toISOString() });
  set(KEYS.QUIZ_HISTORY, history.slice(0, 50));
};

export const exportData = () => {
  const data = {};
  Object.values(KEYS).forEach(k => { data[k] = get(k); });
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonStr) => {
  try {
    const data = JSON.parse(jsonStr);
    Object.entries(data).forEach(([k, v]) => { if (v !== null) set(k, v); });
    return true;
  } catch { return false; }
};

export const clearAll = () => {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
};
