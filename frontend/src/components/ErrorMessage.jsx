export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box">
      <strong>發生錯誤：</strong> {message}
      {onRetry && (
        <button onClick={onRetry} className="btn btn-sm btn-secondary" style={{ marginLeft: 12 }}>
          重試
        </button>
      )}
    </div>
  );
}
