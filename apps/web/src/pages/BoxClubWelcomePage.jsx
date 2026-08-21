import React from "react";
import Navbar from "../components/Navbar";

function BoxClubWelcomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#181a1b', color: '#fff', fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}>
      <Navbar />
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#232526', padding: 48, borderRadius: 20, boxShadow: '0 6px 32px #0008', minWidth: 340, maxWidth: 420, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: 2, marginBottom: 18, textAlign: 'center', color: '#fff' }}>Welcome to THE BOX CLUB!</h1>
          <p style={{ fontSize: 20, color: '#b0b3b8', marginBottom: 32, textAlign: 'center', fontWeight: 500 }}>
            You are now part of the exclusive club.
          </p>
          <button onClick={() => window.location.href = "/dashboard"} style={{ background: '#111', color: '#fff', padding: '12px 32px', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 17, cursor: 'pointer', marginTop: 10, letterSpacing: 1, boxShadow: '0 2px 8px #0007', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#222'}
            onMouseOut={e => e.currentTarget.style.background = '#111'}>
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoxClubWelcomePage; 