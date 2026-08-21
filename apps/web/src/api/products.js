// Product and Category API service
const API_URL = "http://localhost:5249"; // Cambiado para coincidir con el puerto real de la API

export async function getProducts(page = 1, pageSize = 10) {
  const response = await fetch(`${API_URL}/api/products?page=${page}&pageSize=${pageSize}`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function getProduct(id) {
  const response = await fetch(`${API_URL}/api/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
}

export async function createProduct(data, token) {
  const response = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Failed to create product");
  return response.json();
}

export async function updateProduct(id, data, token) {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Failed to update product");
  if (response.status === 204) return; // No Content, no intentes parsear JSON
  return response.json();
}

export async function deleteProduct(id, token) {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Failed to delete product");
  if (response.status === 204) return; // No Content, no intentes parsear JSON
  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${API_URL}/api/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}

export async function createCategory(data, token) {
  const response = await fetch(`${API_URL}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Failed to create category");
  return response.json();
} 