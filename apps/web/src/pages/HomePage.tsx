const catalogueAreas = ['Keyboards', 'Pointing', 'Audio', 'Displays', 'Desk', 'Accessories']

export function HomePage() {
  return (
    <div className="home-page">
      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">BOXD · en construcción</p>
        <h1 id="hero-title">Tecnología pensada para cómo trabajás.</h1>
        <p>
          Estamos preparando una experiencia de compra curada para equipos, periféricos y espacios de trabajo.
        </p>
      </section>

      <section className="catalogue-direction" aria-labelledby="catalogue-title">
        <div>
          <p className="eyebrow">Dirección de catálogo</p>
          <h2 id="catalogue-title">Menos opciones, mejores decisiones.</h2>
        </div>
        <ul>
          {catalogueAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
        <p className="foundation-note">
          El catálogo, las cuentas, el carrito y la administración se incorporarán como vertical slices con contratos de API reales.
        </p>
      </section>
    </div>
  )
}
