'use client';

interface Props {
  open: boolean;
  eventName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ open, eventName, onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="modal-overlay active" id="deleteModal">
      <div className="modal" style={{ position: 'relative' }}>
        <h2>⚠️ Etkinliği Sil</h2>
        <p className="confirm-text">
          Bu etkinliği silmek istediğinize emin misiniz?<br />
          <strong>{eventName}</strong>
        </p>
        <div className="confirm-btns">
          <button className="modal-btn danger" onClick={onConfirm}>Evet, Sil</button>
          <button className="modal-btn secondary" onClick={onCancel}>İptal</button>
        </div>
      </div>
    </div>
  );
}
