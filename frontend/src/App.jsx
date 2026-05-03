import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import VocabularyList from './pages/VocabularyList';
import WordDetail from './pages/WordDetail';
import GrammarLessons from './pages/GrammarLessons';
import PhrasesPage from './pages/PhrasesPage';
import NotebookPage from './pages/NotebookPage';
import QuizPage from './pages/QuizPage';
import QuizResult from './pages/QuizResult';
import DictionaryPage from './pages/DictionaryPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { useUserProgress } from './hooks/useUserProgress';
import { checkHealth } from './services/api';

export default function App() {
  const [apiOnline, setApiOnline] = useState(false);
  const userProgress = useUserProgress();

  useEffect(() => {
    checkHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navigation
            level={userProgress.level}
            onLevelChange={userProgress.changeLevel}
            apiOnline={apiOnline}
          />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard userProgress={userProgress} />} />
              <Route path="/vocabulary" element={<VocabularyList userProgress={userProgress} />} />
              <Route path="/vocabulary/:id" element={<WordDetail userProgress={userProgress} />} />
              <Route path="/grammar" element={<GrammarLessons />} />
              <Route path="/phrases" element={<PhrasesPage />} />
              <Route path="/notebook" element={<NotebookPage userProgress={userProgress} />} />
              <Route path="/quiz" element={<QuizPage userProgress={userProgress} />} />
              <Route path="/quiz/result" element={<QuizResult />} />
              <Route path="/dictionary" element={<DictionaryPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={
                <div className="empty-state">
                  <div className="empty-icon">404</div>
                  <p>頁面不存在</p>
                </div>
              } />
            </Routes>
          </main>
          <footer style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '0.8rem', borderTop: '1px solid #e2e8f0' }}>
            英文學習平台 v1.0.0
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
