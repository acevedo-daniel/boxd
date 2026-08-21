import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, deleteProduct } from "../api/products";
import ConfirmModal from "../components/ConfirmModal";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = () => {
    navigate(`/products/${id}/edit`);
  };

  const handleDelete = async () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await deleteProduct(id, token);
      navigate("/products");
    } catch {
      setError("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div style={{ color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (error || !product) return <div style={{ color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{error || "Product not found"}</div>;

  return (
    <>
      <ConfirmModal
        open={showConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
      <div style={{ minHeight: '100vh', background: '#181a1b', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '48px 0', fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 48, width: '100%', maxWidth: 1200, boxSizing: 'border-box', padding: '0 24px' }}>
          {/* Imagen principal y botones */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <img src={product.imageUrl || '/placeholder.png'} alt={product.name} style={{ width: '100%', maxWidth: 420, borderRadius: 24, objectFit: 'cover', marginBottom: 24, background: '#232526' }} />
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <button onClick={handleEdit} style={{ background: '#232526', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 22px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #0003', transition: 'background 0.2s', letterSpacing: 0.5 }}
                onMouseOver={e => e.currentTarget.style.background = '#333'}
                onMouseOut={e => e.currentTarget.style.background = '#232526'}>
                Edit
              </button>
              <button onClick={handleDelete} disabled={deleting} style={{ background: '#232526', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 22px', fontWeight: 600, fontSize: 15, cursor: 'pointer', opacity: deleting ? 0.7 : 1, boxShadow: '0 2px 8px #0003', transition: 'background 0.2s', letterSpacing: 0.5 }}
                onMouseOver={e => e.currentTarget.style.background = '#333'}
                onMouseOut={e => e.currentTarget.style.background = '#232526'}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
          {/* Info del producto */}
          <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 24 }}>
            <h1 style={{ fontSize: 30, fontWeight: 600, margin: 0, letterSpacing: 0.2, fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}>{product.name}</h1>
            <div style={{ fontSize: 26, fontWeight: 500, margin: 0, color: '#fff', letterSpacing: 0.5, fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}>
              ${product.price?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD
            </div>
            <div style={{ width: '100%' }}>
              <h3 style={{ color: '#fff', fontWeight: 600, fontSize: 18, marginBottom: 10, fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}>Description</h3>
              {product.description ? (
                <ul style={{ color: '#fff', fontSize: 16, lineHeight: 1.7, margin: 0, paddingLeft: 24, fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}>
                  {product.description.split('\n').map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: '#bdbdbd', fontSize: 15 }}>No description available.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage; 