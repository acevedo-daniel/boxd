import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, createProduct, updateProduct, getCategories } from "../api/products";

function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCategories);
    if (isEdit) {
      getProduct(id).then(prod => {
        setName(prod.name);
        setPrice(prod.price);
        setDescription(prod.description);
        setCategoryId(prod.categoryId);
        setImageUrl(prod.imageUrl || "");
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name || !price || !categoryId) {
      setError("Name, price and category are required");
      return;
    }
    if (Number(price) <= 0) {
      setError("Price must be positive");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in");
      return;
    }
    try {
      let data;
      if (isEdit) {
        data = { id: Number(id), name, price: parseFloat(price), description, categoryId, imageUrl };
        await updateProduct(id, data, token);
        setSuccess("Product updated!");
      } else {
        data = { name, price: parseFloat(price), description, categoryId, imageUrl };
        await createProduct(data, token);
        setSuccess("Product created!");
      }
      setTimeout(() => navigate("/products"), 1200);
    } catch (err) {
      setError("Failed to save product");
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#181a1b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#232526', padding: 40, borderRadius: 16, boxShadow: '0 6px 32px #0008', minWidth: 340, maxWidth: 500, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 18 }}>{isEdit ? 'Edit Product' : 'Create Product'}</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: 18 }}>
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', background: '#181A1B', color: '#fff', fontSize: 16, outline: 'none', boxShadow: '0 1px 2px #0004' }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Price</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min="0.01" step="0.01" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', background: '#181A1B', color: '#fff', fontSize: 16, outline: 'none', boxShadow: '0 1px 2px #0004' }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', background: '#181A1B', color: '#fff', fontSize: 16, outline: 'none', boxShadow: '0 1px 2px #0004' }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Category</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', background: '#181A1B', color: '#fff', fontSize: 16, outline: 'none', boxShadow: '0 1px 2px #0004' }}>
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Image URL</label>
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', background: '#181A1B', color: '#fff', fontSize: 16, outline: 'none', boxShadow: '0 1px 2px #0004' }} />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <button type="submit" style={{ width: '100%', background: '#111', color: '#fff', padding: 13, border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 17, cursor: 'pointer', marginBottom: 14, letterSpacing: 1, boxShadow: '0 2px 8px #0007', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#222'}
            onMouseOut={e => e.currentTarget.style.background = '#111'}>
            {isEdit ? 'Update' : 'Create'}
          </button>
        </form>
        <p style={{ marginTop: 10 }}>
          <a href="/products" style={{ color: '#b0b3b8', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}
            onMouseOver={e => e.currentTarget.style.color = '#fff'}
            onMouseOut={e => e.currentTarget.style.color = '#b0b3b8'}>
            Back to list
          </a>
        </p>
      </div>
    </div>
  );
}

export default ProductFormPage; 