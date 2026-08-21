import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!token) {
      setError("Invalid or missing token.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword, confirmPassword })
      });
      if (!response.ok) throw new Error("Reset failed");
      setSuccess("Password reset successfully. You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("Reset failed. Try again or request a new link.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#181A1B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}>
      <div style={{ background: '#232526', padding: 40, borderRadius: 18, boxShadow: '0 6px 32px #0008', minWidth: 340, maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 28, marginBottom: 24, letterSpacing: 1 }}>Reset Password</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 7, color: '#b0b3b8', fontWeight: 500 }}>New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', background: '#181A1B', color: '#fff', fontSize: 16, outline: 'none', boxShadow: '0 1px 2px #0004' }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 7, color: '#b0b3b8', fontWeight: 500 }}>Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', background: '#181A1B', color: '#fff', fontSize: 16, outline: 'none', boxShadow: '0 1px 2px #0004' }} />
          </div>
          {error && <p style={{ color: "#ff4d4f", marginBottom: 14, textAlign: "center", fontWeight: 600 }}>{error}</p>}
          {success && <p style={{ color: "#27ae60", marginBottom: 14, textAlign: "center", fontWeight: 600 }}>{success}</p>}
          <button type="submit" style={{ width: '100%', background: '#111', color: '#fff', padding: 13, border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 17, cursor: 'pointer', marginBottom: 8, letterSpacing: 1, boxShadow: '0 2px 8px #0007', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#222'}
            onMouseOut={e => e.currentTarget.style.background = '#111'}
          >Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage; 