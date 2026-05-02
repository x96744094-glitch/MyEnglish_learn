export const getScoreClass = (score) => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'average';
  return 'poor';
};

export const getScoreEmoji = (score) => {
  if (score >= 80) return '🎉';
  if (score >= 60) return '👍';
  if (score >= 40) return '📚';
  return '💪';
};

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('zh-TW', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

export const truncate = (str, n = 50) =>
  str && str.length > n ? str.slice(0, n) + '...' : str;
