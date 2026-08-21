import React from "react";

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#232526', padding: 32, borderRadius: 16, minWidth: 320, boxShadow: '0 6px 32px #0008', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 22, marginBottom: 12 }}>{title || 'Confirm'}</h3>
        <p style={{ color: '#b0b3b8', marginBottom: 28, textAlign: 'center' }}>{message || 'Are you sure?'}</p>
        <div style={{ display: 'flex', gap: 18 }}>
          <button onClick={onCancel} style={{ background: '#181A1B', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0007', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#333'}
            onMouseOut={e => e.currentTarget.style.background = '#181A1B'}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0007', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#b71c1c'}
            onMouseOut={e => e.currentTarget.style.background = '#d32f2f'}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal; 