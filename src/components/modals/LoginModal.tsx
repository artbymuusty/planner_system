'use client';

import { useState } from 'react';
import type { User } from '@/types';

interface Props {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onLogin: (name: string) => void;
  onLogout: () => void;
}

export default function LoginModal({ open, user, onClose, onLogin, onLogout }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username.trim()) { alert('Kullanıcı adı girin'); return; }
    if (!password) { alert('Şifre girin'); return; }
    onLogin(username.trim());
    setUsername('');
    setPassword('');
  };

  if (!open) return null;

  return (
    <div className="modal-overlay active" id="loginModal" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ position: 'relative' }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>👤 Profil Girişi</h2>
        {user ? (
          <div id="loggedInView">
            <div className="user-badge">
              <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
              <span className="username">{user.name}</span>
            </div>
            <button className="modal-btn secondary" onClick={onLogout}>Çıkış Yap</button>
          </div>
        ) : (
          <div id="loginForm">
            <p className="login-info">Planlarınıza erişmek için giriş yapın</p>
            <div className="form-group">
              <label>Kullanıcı Adı</label>
              <input type="text" placeholder="Kullanıcı adınız" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Şifre</label>
              <input type="password" placeholder="Şifreniz" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <button className="modal-btn primary" onClick={handleLogin}>Giriş Yap</button>
          </div>
        )}
      </div>
    </div>
  );
}
