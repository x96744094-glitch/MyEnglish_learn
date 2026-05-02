import { useState, useEffect, useCallback } from 'react';
import * as storage from '../services/storageService';
import { progress as progressApi } from '../services/api';

export function useUserProgress() {
  const userId = storage.getUserId();
  const [level, setLevelState] = useState(storage.getLevel());
  const [learnedWords, setLearnedWords] = useState(storage.getLearnedWords());
  const [notebook, setNotebook] = useState(storage.getNotebook());
  const [favorites, setFavorites] = useState(storage.getFavorites());
  const [quizHistory, setQuizHistory] = useState(storage.getQuizHistory());

  const changeLevel = useCallback((newLevel) => {
    storage.setLevel(newLevel);
    setLevelState(newLevel);
  }, []);

  const markLearned = useCallback((wordId) => {
    storage.addLearnedWord(wordId);
    setLearnedWords(storage.getLearnedWords());
  }, []);

  const toggleNotebook = useCallback((wordId) => {
    if (notebook.includes(wordId)) {
      storage.removeFromNotebook(wordId);
    } else {
      storage.addToNotebook(wordId);
      progressApi.addToNotebook(userId, wordId).catch(() => {});
    }
    setNotebook(storage.getNotebook());
  }, [notebook, userId]);

  const toggleFav = useCallback((wordId) => {
    storage.toggleFavorite(wordId);
    setFavorites(storage.getFavorites());
  }, []);

  const saveQuizResult = useCallback((result) => {
    storage.addQuizResult(result);
    setQuizHistory(storage.getQuizHistory());
  }, []);

  return {
    userId,
    level,
    changeLevel,
    learnedWords,
    markLearned,
    notebook,
    toggleNotebook,
    isInNotebook: (id) => notebook.includes(id),
    favorites,
    toggleFav,
    isFavorite: (id) => favorites.includes(id),
    quizHistory,
    saveQuizResult,
  };
}
