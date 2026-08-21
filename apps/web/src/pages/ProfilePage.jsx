import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage({ user }) {
  const navigate = useNavigate();
  const [showEditMsg, setShowEditMsg] = useState(false);
  console.log('ProfilePage user:', user);

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", background: "#181A1B", fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}>
      <div style={{ background: "#232526", padding: 40, borderRadius: 20, boxShadow: "0 6px 32px #0008", minWidth: 340, maxWidth: 600, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 28, marginBottom: 40 }}>Profile</h2>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 48, marginBottom: 40, justifyContent: 'center' }}>
          {/* Info user */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28, justifyContent: 'center' }}>
            <div style={{ color: "#b0b3b8", fontSize: 24, marginBottom: 0 }}><b>Username</b><br /><span style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>{user?.username || "-"}</span></div>
            <div style={{ color: "#b0b3b8", fontSize: 24, marginBottom: 0 }}><b>Email</b><br /><span style={{ color: '#fff', fontWeight: 700, fontSize: 24 }}>{user?.email || "-"}</span></div>
          </div>
          {/* Foto user */}
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: '#181a1b',
              border: '2.5px solid #444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 12px #0004',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 0 6px #fff2'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px #0004'}
            title="Select photo (not implemented)"
          />
        </div>
        {/* Botones */}
        <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'flex-start', marginTop: 8 }}>
          <button
            style={{ background: '#232526', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #0003', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#333'}
            onMouseOut={e => e.currentTarget.style.background = '#232526'}
          >
            Edit
          </button>
          <button
            style={{ background: '#232526', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #0003', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#333'}
            onMouseOut={e => e.currentTarget.style.background = '#232526'}
          >
            Change Password
          </button>
        </div>
        {showEditMsg && (
          <div style={{ marginTop: 18, color: '#ffd700', fontWeight: 600, textAlign: 'left', fontSize: 16 }}>
            Edit profile coming soon...
            <button onClick={() => setShowEditMsg(false)} style={{ marginLeft: 16, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 15 }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage; 