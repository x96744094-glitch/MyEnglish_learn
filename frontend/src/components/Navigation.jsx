import { NavLink } from 'react-router-dom';
import { LEVEL_LABELS } from '../utils/constants';

export default function Navigation({ level, onLevelChange, apiOnline }) {
  const levels = ['A1', 'A2', 'B1', 'B2'];

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        📚 英文學習平台
      </NavLink>

      <ul className="navbar-links">
        <li><NavLink to="/" end>首頁</NavLink></li>
        <li><NavLink to="/vocabulary">單字</NavLink></li>
        <li><NavLink to="/grammar">文法</NavLink></li>
        <li><NavLink to="/phrases">片語</NavLink></li>
        <li><NavLink to="/notebook">筆記本</NavLink></li>
        <li><NavLink to="/quiz">測驗</NavLink></li>
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="api-status">
          <div className={`status-dot ${apiOnline ? 'online' : 'offline'}`} />
          {apiOnline ? 'API 連線' : 'API 離線'}
        </div>
        <select
          value={level}
          onChange={e => onLevelChange(e.target.value)}
          className="level-badge"
          style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}
        >
          {levels.map(l => (
            <option key={l} value={l} style={{ background: '#4F46E5', color: 'white' }}>
              {LEVEL_LABELS[l]}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}
