export default function LoadingSpinner({ text = '載入中...' }) {
  return (
    <div className="loading-spinner">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" />
        <p style={{ marginTop: 12, color: '#94a3b8', fontSize: '0.9rem' }}>{text}</p>
      </div>
    </div>
  );
}
