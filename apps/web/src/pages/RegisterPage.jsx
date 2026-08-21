import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await register({ username, email, password, confirmPassword });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#181A1B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Open Sans', Arial, sans-serif" }}>
      <div style={{ background: "#232526", padding: 40, borderRadius: 16, boxShadow: "0 6px 32px #0008", minWidth: 340, maxWidth: 400, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ textAlign: "center", marginBottom: 8, letterSpacing: 2, fontWeight: 900, color: "#fff", fontSize: 32, textShadow: "0 2px 8px #0007" }}>THE BOX</h1>
        <h2 style={{ textAlign: "center", marginBottom: 28, fontWeight: 400, color: "#b0b3b8", fontSize: 20 }}>Register</h2>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", marginBottom: 7, color: "#b0b3b8", fontWeight: 500 }}>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #333", background: "#181A1B", color: "#fff", fontSize: 16, outline: "none", boxShadow: "0 1px 2px #0004" }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", marginBottom: 7, color: "#b0b3b8", fontWeight: 500 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #333", background: "#181A1B", color: "#fff", fontSize: 16, outline: "none", boxShadow: "0 1px 2px #0004" }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", marginBottom: 7, color: "#b0b3b8", fontWeight: 500 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #333", background: "#181A1B", color: "#fff", fontSize: 16, outline: "none", boxShadow: "0 1px 2px #0004" }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", marginBottom: 7, color: "#b0b3b8", fontWeight: 500 }}>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #333", background: "#181A1B", color: "#fff", fontSize: 16, outline: "none", boxShadow: "0 1px 2px #0004" }} />
          </div>
          {error && <p style={{ color: "#ff4d4f", marginBottom: 14, textAlign: "center", fontWeight: 600 }}>{error}</p>}
          {success && <p style={{ color: "#27ae60", marginBottom: 14, textAlign: "center", fontWeight: 600 }}>{success}</p>}
          <button type="submit" style={{ width: "100%", background: "#111", color: "#fff", padding: 13, border: "none", borderRadius: 8, fontWeight: 800, fontSize: 17, cursor: "pointer", marginBottom: 14, letterSpacing: 1, boxShadow: "0 2px 8px #0007", transition: "background 0.2s" }}
            onMouseOver={e => e.currentTarget.style.background = '#222'}
            onMouseOut={e => e.currentTarget.style.background = '#111'}
          >Register</button>
        </form>
        <div style={{ textAlign: "center", marginTop: 10, width: "100%" }}>
          <a href="/login" style={{ color: "#b0b3b8", textDecoration: "none", fontWeight: 600, transition: "color 0.2s" }}
            onMouseOver={e => e.currentTarget.style.color = '#fff'}
            onMouseOut={e => e.currentTarget.style.color = '#b0b3b8'}
          >Back to login</a>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage; 