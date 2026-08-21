import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function QrViewPage() {
  const { token } = useParams();
  const [qrUrl, setQrUrl] = useState("");
  const [exclusiveUrl, setExclusiveUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setQrUrl(`http://localhost:5249/api/qr/${token}/image`);
    fetch(`http://localhost:5249/api/qr/${token}/exclusive`)
      .then(res => res.json())
      .then(data => setExclusiveUrl(data.url))
      .catch(() => setError("Failed to load QR info"));
  }, [token]);

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Your QR Code</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {qrUrl && (
        <img src={qrUrl} alt="QR Code" style={{ width: 256, height: 256, margin: "24px auto", display: "block", borderRadius: 8, boxShadow: "0 2px 8px #0001" }} />
      )}
      <p style={{ margin: "16px 0", fontWeight: 500 }}>
        Escanea este código para acceder a tu funcionalidad exclusiva por tiempo limitado.
      </p>
      {exclusiveUrl && (
        <div>
          <a href={exclusiveUrl} target="_blank" rel="noopener noreferrer">{exclusiveUrl}</a>
        </div>
      )}
      <p>
        <a href="/products">Back to list</a>
      </p>
    </div>
  );
}

export default QrViewPage; 