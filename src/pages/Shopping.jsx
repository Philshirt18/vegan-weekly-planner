import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAppState } from '../lib/AppState.jsx'
import { buildShoppingList, withoutChecked } from '../lib/shopping.js'

export default function Shopping() {
  const { data, update } = useAppState()
  const [stage, setStage] = useState('preview') // 'preview' = Vorschau zum Abhaken, 'final' = fertige Liste

  if (!data.plan || Object.keys(data.plan).length === 0) return <Navigate to="/gerichte" replace />

  const groups = buildShoppingList(data.plan, data.members)
  const checked = data.checkedIngredients
  const toggle = (key) =>
    update({ checkedIngredients: checked.includes(key) ? checked.filter((k) => k !== key) : [...checked, key] })

  if (stage === 'final') {
    const missing = withoutChecked(groups, checked)
    return (
      <section>
        <div className="section-head">
          <h1>Deine Einkaufsliste</h1>
          <p className="muted">Das brauchst du noch für diese Woche.</p>
        </div>

        {missing.length === 0 ? (
          <p className="card">Du hast schon alles zu Hause – nichts einzukaufen. 🎉</p>
        ) : (
          <div className="shop-groups">
            {missing.map((g) => (
              <div key={g.category} className="card">
                <h2>{g.category}</h2>
                <ul className="shop-list">
                  {g.items.map((i) => (
                    <li key={i.key}><span>{i.name}</span><strong>{i.label}</strong></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="actions">
          <button type="button" className="btn" onClick={() => setStage('preview')}>Zurück zur Vorschau</button>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="section-head">
        <h1>Vorschau der Einkaufsliste</h1>
        <p className="muted">
          Alle Zutaten für deinen Wochenplan, umgerechnet auf deine Familie. Hake ab, was du schon
          zu Hause hast.
        </p>
      </div>

      <div className="shop-groups">
        {groups.map((g) => (
          <div key={g.category} className="card">
            <h2>{g.category}</h2>
            <ul className="shop-list">
              {g.items.map((i) => (
                <li key={i.key}>
                  <label className="check">
                    <input type="checkbox" checked={checked.includes(i.key)} onChange={() => toggle(i.key)} />
                    <span className="check-name">{i.name}</span>
                    <strong>{i.label}</strong>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="actions">
        <Link className="btn" to="/woche">Zurück zum Wochenplan</Link>{' '}
        <button type="button" className="btn primary" onClick={() => setStage('final')}>
          Einkaufsliste erstellen
        </button>
      </div>
    </section>
  )
}
