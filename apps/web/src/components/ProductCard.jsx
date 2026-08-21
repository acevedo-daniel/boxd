import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  return (
    <div
      className="product-card compact hoverable"
      onClick={() => navigate(`/products/${product.id}`)}
      tabIndex={0}
      role="button"
      style={{ cursor: "pointer" }}
    >
      <img src={product.imageUrl || '/placeholder.png'} alt={product.name} className="product-image round" />
      <div className="product-info compact">
        <div className="product-name-minimal compact">{product.name}</div>
        <div className="product-price-minimal compact">${product.price?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
      </div>
    </div>
  );
}

export default ProductCard; 