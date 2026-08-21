import React, { useEffect, useState } from "react";
import { getProducts, getCategories, createCategory } from "../api/products";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date-desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showCatModal, setShowCatModal] = useState(false);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catError, setCatError] = useState("");
  const [catSuccess, setCatSuccess] = useState("");

  useEffect(() => {
    getProducts(page, 12)
      .then(data => {
        setProducts(data.items || data);
        setTotalPages(data.totalPages || data.TotalPages || 1);
      })
      .catch(() => setError("Failed to load products"));
    getCategories().then(setCategories).catch(() => {});
  }, [page]);

  useEffect(() => {
    let prods = [...products];
    if (category) prods = prods.filter(p => String(p.categoryId) === String(category) || String(p.category?.id) === String(category));
    if (sort === "price-asc") prods.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") prods.sort((a, b) => b.price - a.price);
    if (sort === "name-asc") prods.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") prods.sort((a, b) => b.name.localeCompare(a.name));
    setFiltered(prods);
  }, [products, category, sort]);

  const handleAddToCart = (product) => {
    // Lógica de agregar al carrito (placeholder)
    alert(`Agregado: ${product.name}`);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCatError("");
    setCatSuccess("");
    if (!catName.trim()) {
      setCatError("Name is required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await createCategory({ name: catName, description: catDesc }, token);
      setCatSuccess("Category created!");
      setCatName("");
      setCatDesc("");
      setShowCatModal(false);
      // Refresca categorías
      getCategories().then(setCategories);
    } catch {
      setCatError("Failed to create category");
    }
  };

  // Estilo único para toda la paginación
  const navStyle = { fontSize: 13, color: "#bdbdbd", display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 24, fontWeight: 400 };

  return (
    <div style={{ minHeight: "100vh", background: "#181a1b", width: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', boxSizing: 'border-box' }}>
        <h1 style={{ textAlign: "center", fontWeight: 700, fontSize: "2.2rem", marginBottom: 8, marginTop: 40 }}>Products</h1>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <button onClick={() => navigate('/products/new')} style={{ background: '#232526', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0003', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#333'}
            onMouseOut={e => e.currentTarget.style.background = '#232526'}
          >
            Add New
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 auto 18px auto", flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ fontSize: 15, padding: '10px 18px', borderRadius: 10, background: "#232526", color: "#fff", border: "none", minWidth: 120, maxWidth: 180, outline: 'none', fontWeight: 600, boxShadow: '0 2px 8px #0002', transition: 'background 0.2s', marginRight: 8, appearance: 'none', cursor: 'pointer' }}>
              <option value="date-desc">Filter</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price low-high</option>
              <option value="price-desc">Price high-low</option>
            </select>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
              <select value={category} onChange={e => setCategory(e.target.value)}
                style={{ fontSize: 15, padding: '10px 18px', borderRadius: 10, background: "#232526", color: "#fff", border: "none", minWidth: 140, maxWidth: 220, outline: 'none', fontWeight: 600, boxShadow: '0 2px 8px #0002', transition: 'background 0.2s', appearance: 'none', cursor: 'pointer' }}>
                <option value="">Categories</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <button
                onClick={() => setShowCatModal(true)}
                style={{ background: '#232526', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #0003', transition: 'background 0.2s', marginLeft: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseOver={e => e.currentTarget.style.background = '#333'}
                onMouseOut={e => e.currentTarget.style.background = '#232526'}
                title="Create category"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", color: "#bdbdbd", fontSize: 13, marginBottom: 14, fontWeight: 400 }}>{filtered.length} products</div>
        {error && <p style={{ color: "#ff4669", textAlign: "center" }}>{error}</p>}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 18,
          justifyItems: "center",
          alignItems: "start",
          width: "100%",
          boxSizing: "border-box",
          margin: 0,
          minHeight: 200
        }}>
          {filtered.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
        <div style={navStyle}>
          <span>Previous</span>
          <span>Page {page} of {totalPages}</span>
          <span>Next</span>
        </div>
      </div>
      {/* Modal para crear categoría */}
      {showCatModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#232526', padding: 32, borderRadius: 16, minWidth: 320, maxWidth: 380, width: '100%', boxShadow: '0 6px 32px #0008', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 18 }}>Create Category</h2>
            <form onSubmit={handleCreateCategory} style={{ width: '100%' }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#b0b3b8', fontWeight: 500, marginBottom: 6, display: 'block' }}>Name</label>
                <input value={catName} onChange={e => setCatName(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #333', background: '#181A1B', color: '#fff', fontSize: 16, outline: 'none', marginBottom: 4 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#b0b3b8', fontWeight: 500, marginBottom: 6, display: 'block' }}>Description</label>
                <textarea value={catDesc} onChange={e => setCatDesc(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #333', background: '#181A1B', color: '#fff', fontSize: 16, outline: 'none', minHeight: 60 }} />
              </div>
              {catError && <div style={{ color: '#ff4d4f', fontWeight: 600, marginBottom: 10 }}>{catError}</div>}
              {catSuccess && <div style={{ color: '#27ae60', fontWeight: 600, marginBottom: 10 }}>{catSuccess}</div>}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowCatModal(false)} style={{ background: '#232526', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #0003', transition: 'background 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#333'}
                  onMouseOut={e => e.currentTarget.style.background = '#232526'}>
                  Cancel
                </button>
                <button type="submit" style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #0007', transition: 'background 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#222'}
                  onMouseOut={e => e.currentTarget.style.background = '#111'}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductListPage; 