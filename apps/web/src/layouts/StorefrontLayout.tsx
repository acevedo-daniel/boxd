import { Link, NavLink, Outlet } from 'react-router-dom'

export function StorefrontLayout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="BOXD, inicio">
          BOXD
        </Link>
        <nav aria-label="Navegación principal">
          <NavLink to="/" end>
            Inicio
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>BOXD · Tecnología curada para tu espacio de trabajo.</p>
      </footer>
    </div>
  )
}
