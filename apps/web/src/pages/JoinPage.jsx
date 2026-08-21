import React, { useState } from "react";
import { generateQr, validateQr } from "../api/qr";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function JoinPage() {
  const navigate = useNavigate();
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [validationResult, setValidationResult] = useState(null);

  const handleGenerateQr = async () => {
    setLoading(true);
    setError("");
    setQrUrl(null);
    setValidationResult(null);
    try {
      const token = localStorage.getItem("token");
      const blob = await generateQr(10, token);
      setQrUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError("Failed to generate QR");
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    setLoading(true);
    setError("");
    setValidationResult(null);
    try {
      const result = await validateQr(tokenInput.trim());
      setValidationResult(result);
    } catch (err) {
      setError("Invalid or expired QR token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (validationResult && validationResult.message === "QR token validated successfully") {
      setTimeout(() => {
        navigate("/box-club/welcome");
      }, 800);
    }
  }, [validationResult, navigate]);

  return (
    <div style={{ minHeight: '100vh', background: '#181a1b', color: '#fff', fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}>
      {validationResult && validationResult.message === "QR token validated successfully" && (
        <div style={{ marginTop: 18, color: '#27ae60', fontWeight: 700, textAlign: 'center', fontSize: 18 }}>
          QR token validated successfully! Redirecting...
        </div>
      )}
      {(!validationResult || validationResult.message !== "QR token validated successfully") && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <div style={{ background: '#232526', padding: 48, borderRadius: 20, boxShadow: '0 6px 32px #0008', minWidth: 340, maxWidth: 420, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: 2, marginBottom: 10, textAlign: 'center' }}>BOX CLUB</h1>
            <h2 style={{ fontSize: 20, fontWeight: 400, color: '#b0b3b8', marginBottom: 32, textAlign: 'center' }}>
              Scan or enter your QR code to access exclusive benefits and content.
            </h2>
            <button onClick={handleGenerateQr} disabled={loading} style={{ width: '100%', background: '#111', color: '#fff', padding: 13, border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 17, cursor: 'pointer', marginBottom: 18, letterSpacing: 1, boxShadow: '0 2px 8px #0007', transition: 'background 0.2s' }}>
              {loading ? 'Generating...' : 'Generate QR'}
            </button>
            {qrUrl && (
              <div style={{ margin: '18px 0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={qrUrl} alt="QR Code" style={{ width: 180, height: 180, background: '#181a1b', borderRadius: 12, marginBottom: 8 }} />
                <span style={{ color: '#b0b3b8', fontSize: 14 }}>Scan this QR with your mobile device</span>
              </div>
            )}
            <div style={{ width: '100%', margin: '24px 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Enter QR token..."
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #333', background: '#181A1B', color: '#fff', fontSize: 16, outline: 'none', marginBottom: 10, boxShadow: '0 1px 2px #0004' }}
              />
              <button onClick={handleValidate} disabled={loading || !tokenInput.trim()} style={{ width: '100%', background: '#232526', color: '#fff', padding: 11, border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer', marginBottom: 8, letterSpacing: 1, boxShadow: '0 2px 8px #0003', transition: 'background 0.2s' }}>
                {loading ? 'Validating...' : 'Validate QR'}
              </button>
            </div>
            {validationResult && !validationResult.valid && (
              <div style={{ marginTop: 10, color: '#ff4d4f', fontWeight: 600, textAlign: 'center' }}>
                {validationResult.message || 'Invalid or expired QR token'}
              </div>
            )}
            {error && (
              <div style={{ marginTop: 10, color: '#ff4d4f', fontWeight: 600, textAlign: 'center' }}>{error}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JoinPage; 