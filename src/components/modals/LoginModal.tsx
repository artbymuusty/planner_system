'use client';

import { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  open: boolean;
  user: { name: string } | null;
  onClose: () => void;
  onLogin: (userName: string) => void;
  onLogout: () => void;
}

export default function LoginModal({ open, user, onClose, onLogin, onLogout }: Props) {
  const [userInp, setUserInp] = useState('');
  const [pass, setPass] = useState('');

  if (!open) return null;

  if (user) {
    return (
      <div className="modal-overlay active">
        <div className="modal" style={{ maxWidth: 360, textAlign: 'center', padding: 40, borderRadius: 24 }}>
           <div style={{ width: 80, height: 80, background: '#eef2ff', color: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontWeight: 900, fontSize: '2rem' }}>
              {user.name[0].toUpperCase()}
           </div>
           <h2 style={{ margin: 0 }}>Merhaba, {user.name}</h2>
           <p style={{ color: '#64748b', marginBottom: 30 }}>Planner Pro oturumunuz açık.</p>
           <div className="confirm-btns">
              <button className="m-btn danger" onClick={() => { onLogout(); onClose(); }} style={{ width: '100%' }}>Çıkış Yap</button>
              <button className="m-btn secondary" onClick={onClose} style={{ width: '100%' }}>Kapat</button>
           </div>
        </div>
      </div>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.trim() || !pass.trim()) {
      alert('Lütfen kullanıcı adı ve şifre girin.');
      return;
    }
    onLogin(userInp);
    onClose();
  };

  return (
    <div className="modal-overlay active">
      <div className="modal login-modal" style={{ maxWidth: 400, padding: 0, borderRadius: 24, overflow: 'hidden', border: 'none' }}>
        <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', padding: '40px 30px', textAlign: 'center', color: 'white' }}>
           <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <ShieldCheck size={32} />
           </div>
           <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>Hoş Geldiniz</h2>
           <p style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: 8 }}>Planner System ile verimliliğini artır.</p>
        </div>
        
        <form onSubmit={handleLogin} style={{ padding: '30px 40px' }}>
           <div className="m-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontWeight: 800 }}>
                 <User size={16} /> Kullanıcı Adı
              </label>
              <input 
                type="text" 
                placeholder="Kullanıcı adınız..." 
                value={userInp} 
                onChange={e => setUserInp(e.target.value)}
                style={{ height: 48, borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', padding: '0 16px', fontSize: '1rem' }}
              />
           </div>
           
           <div className="m-form-group" style={{ marginTop: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontWeight: 800 }}>
                 <Lock size={16} /> Şifre
              </label>
              <input 
                type="password" 
                placeholder="Şifreniz..." 
                value={pass} 
                onChange={e => setPass(e.target.value)}
                style={{ height: 48, borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', padding: '0 16px', fontSize: '1rem' }}
              />
           </div>

           <button 
             type="submit" 
             className="m-btn primary" 
             style={{ width: '100%', height: 52, borderRadius: 14, marginTop: 30, background: '#4f46e5', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: '1.1rem' }}
           >
              GİRİŞ YAP <ArrowRight size={20} />
           </button>
           
           <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: '#94a3b8' }}>
              Planner Pro v1.0 • Tüm Hakları Saklıdır
           </div>
        </form>
      </div>
    </div>
  );
}
