import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth as authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let result;
      if (tab === 'login') {
        result = await authApi.login({ email: form.email, password: form.password });
      } else {
        result = await authApi.register({ username: form.username, email: form.email, password: form.password });
      }
      login(result.user, result.token);
      navigate('/');
    } catch (err) {
      setError(err.message || '操作失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 440, margin: '60px auto', padding: '0 16px' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: 24, fontSize: '1.5rem', fontWeight: 700 }}>
          {tab === 'login' ? '🔐 登入' : '📝 註冊'}
        </h2>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: 24 }}>
          {['login', 'register'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); setForm({ username: '', email: '', password: '' }); }}
              style={{
                flex: 1,
                padding: '10px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: tab === t ? 700 : 400,
                color: tab === t ? '#4F46E5' : '#64748b',
                borderBottom: tab === t ? '2px solid #4F46E5' : '2px solid transparent',
                marginBottom: -2,
                fontSize: '1rem',
              }}
            >
              {t === 'login' ? '登入' : '註冊'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {tab === 'register' && (
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#374151' }}>使用者名稱</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="請輸入使用者名稱"
                required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#374151' }}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="請輸入 Email"
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#374151' }}>密碼</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={tab === 'register' ? '至少 6 個字元' : '請輸入密碼'}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '12px', fontSize: '1rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '處理中...' : (tab === 'login' ? '登入' : '註冊')}
          </button>
        </form>
      </div>
    </div>
  );
}
