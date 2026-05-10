'use client';

interface Props {
  open: boolean;
  user?: { name: string } | null;
  onClose: () => void;
}

const TEST_USER_NAME = 'Test Kullanıcı';

export default function LoginModal({ open, user, onClose }: Props) {
  if (!open) return null;

  const displayName = user?.name || TEST_USER_NAME;

  return (
    <div className="modal-overlay active" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 360, textAlign: 'center', padding: 40, borderRadius: 24 }}>
        <div
          style={{
            width: 80,
            height: 80,
            background: '#eef2ff',
            color: '#4f46e5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontWeight: 900,
            fontSize: '2rem',
          }}
        >
          {displayName[0].toUpperCase()}
        </div>
        <h2 style={{ margin: 0 }}>Merhaba, {displayName}</h2>
        <p style={{ color: '#64748b', marginBottom: 30 }}>Planner Pro oturumunuz açık.</p>
        <div className="confirm-btns">
          <button className="m-btn secondary" onClick={onClose} style={{ width: '100%' }}>Kapat</button>
        </div>
      </div>
    </div>
  );
}
