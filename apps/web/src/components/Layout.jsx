import React from "react";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 64px)" }}>
        {children}
      </main>
    </div>
  );
}

export default Layout; 