import { useState } from 'react'

// Zeigt das Bild eines Gerichts. Fehlt es, erscheint ein sanfter Platzhalter mit dem Namen.
export default function DishImage({ dish, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`dish-image placeholder ${className}`} role="img" aria-label={dish.name}>
        <span aria-hidden="true">🥣</span>
      </div>
    )
  }
  return (
    <img
      className={`dish-image ${className}`}
      src={dish.image}
      alt={dish.name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
