import { useState } from 'react'

// Shows the picture of a dish. If it is missing, a soft placeholder appears.
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
