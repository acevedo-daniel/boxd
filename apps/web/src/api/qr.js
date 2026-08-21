const API_URL = "http://localhost:5249";

export async function generateQr(expirationMinutes = 10, token) {
  const response = await fetch(`${API_URL}/api/qr/generate?expirationMinutes=${expirationMinutes}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Failed to generate QR");
  return response.blob(); // Devuelve la imagen PNG
}

export async function validateQr(qrToken) {
  const response = await fetch(`${API_URL}/api/qr/validate/${encodeURIComponent(qrToken)}`);
  if (!response.ok) throw new Error("Invalid or expired QR token");
  return response.json();
}

export async function infoQr(qrToken) {
  const response = await fetch(`${API_URL}/api/qr/info/${qrToken}`);
  if (!response.ok) throw new Error("Invalid or expired QR token");
  return response.json();
} 