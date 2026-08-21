import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ user }) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#181A1B" }}>
      <div style={{ textAlign: "left", maxWidth: 1200, width: "100%", padding: "0 32px" }}>
        <h1 style={{ color: "#fff", fontSize: 64, fontWeight: 900, marginBottom: 18, letterSpacing: 1, lineHeight: 1.1 }}>
          Hi, {user?.username || "User"}!
        </h1>
        <p style={{ color: "#b0b3b8", fontSize: 28, marginBottom: 18, fontWeight: 400, lineHeight: 1.3 }}>
          Welcome to THE BOX.<br />
          Explore the best hardware products.
        </p>
        <p style={{ color: "#fff", fontSize: 22, marginBottom: 48, fontWeight: 600, lineHeight: 1.3, textShadow: '0 0 8px #fff2' }}>
          Discover the best mechanical keyboards and accessories.
        </p>
        <button
          onClick={() => navigate("/products")}
          style={{
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 32,
            padding: "22px 64px",
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: 1,
            cursor: "pointer",
            boxShadow: "0 2px 8px #0007",
            transition: "background 0.2s"
          }}
          onMouseOver={e => e.currentTarget.style.background = '#222'}
          onMouseOut={e => e.currentTarget.style.background = '#111'}
        >
          Explore
        </button>
      </div>
    </div>
  );
}

export default Dashboard; 