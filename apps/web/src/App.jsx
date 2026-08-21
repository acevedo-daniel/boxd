import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductFormPage from "./pages/ProductFormPage";
import QrViewPage from "./pages/QrViewPage";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";
import JoinPage from "./pages/JoinPage";
import BoxClubWelcomePage from "./pages/BoxClubWelcomePage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulación: decodificar el token para obtener el usuario (en real, usar jwt-decode)
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          username: username || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
          email: email || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
        });
      } catch {
        setUser(username || email ? { username, email } : null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  const NavbarLayout = () => (
    <>
      <Navbar onLogout={handleLogout} />
      <Outlet />
    </>
  );

  return (
    <Router>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/box-club/welcome" element={<BoxClubWelcomePage />} />

        {/* Rutas privadas con Navbar */}
        <Route element={<PrivateRoute><NavbarLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/qr/:token" element={<QrViewPage />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/join" element={<JoinPage />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
