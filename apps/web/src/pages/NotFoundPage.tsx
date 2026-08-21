import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <p className="eyebrow">404</p>
      <h1 id="not-found-title">Esta página no existe.</h1>
      <p>Volvé al inicio para seguir explorando BOXD.</p>
      <Link className="text-link" to="/">
        Ir al inicio
      </Link>
    </section>
  )
}
