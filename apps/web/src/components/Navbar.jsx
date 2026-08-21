import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#181a1b",
        color: "#fff",
        minHeight: 64,
        width: "100%",
        boxShadow: "0 2px 8px 0 #0006",
        position: "relative",
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        padding: '0',
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: 64,
      }}>
        <div style={{ fontWeight: "bold", fontSize: 22, letterSpacing: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
          <Link
            to="/dashboard"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: 22,
              letterSpacing: 2,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            THE BOX
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32, height: '100%' }}>
          <Link to="/products" style={{ color: "#fff", textDecoration: "none", fontWeight: 500, fontSize: 16, display: 'flex', alignItems: 'center', height: '100%' }}>Products</Link>
          <Link to="/join" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', height: '100%', textShadow: '0 0 8px #fff8' }}>BOX CLUB</Link>
          {isLoggedIn && (
            <Link to="/profile" style={{ color: "#fff", textDecoration: "none", fontWeight: 500, fontSize: 16, display: 'flex', alignItems: 'center', height: '100%' }}>Profile</Link>
          )}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                padding: 0,
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" style={{ color: "#fff", display: 'flex', alignItems: 'center', height: '100%' }}>Login</Link>
              <Link to="/register" style={{ color: "#fff", display: 'flex', alignItems: 'center', height: '100%' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 