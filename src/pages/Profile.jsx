import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../lib/AppState.jsx'
import { getTargets, DISCLAIMER } from '../lib/nutrition.js'

const SEX_LABEL = { female: 'weiblich', male: 'männlich', diverse: 'divers' }
const STATUS_LABEL = { none: 'Keine', pregnant: 'Schwanger', breastfeeding: 'Stillend' }
const EMPTY_FORM = { name: '', sex: 'female', age: '', weightKg: '', status: 'none' }

export default function Profile() {
  const { data, update } = useAppState()
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const add = (e) => {
    e.preventDefault()
    const age = Number(form.age)
    const weightKg = Number(form.weightKg)
    if (!form.name.trim()) return setError('Bitte gib einen Namen ein.')
    if (!Number.isFinite(age) || age < 1 || age > 110) return setError('Bitte gib ein Alter zwischen 1 und 110 Jahren ein.')
    if (!Number.isFinite(weightKg) || weightKg < 5 || weightKg > 250) return setError('Bitte gib ein Gewicht zwischen 5 und 250 kg ein.')
    setError('')
    const status = form.sex === 'male' ? 'none' : form.status
    update({
      members: [...data.members, { id: crypto.randomUUID(), name: form.name.trim(), sex: form.sex, age, weightKg, status }],
    })
    setForm(EMPTY_FORM)
  }

  const remove = (id) => update({ members: data.members.filter((m) => m.id !== id) })

  return (
    <section>
      <h1>Deine Familie</h1>
      <p className="notice">{DISCLAIMER}</p>

      {data.members.length === 0 ? (
        <p className="muted">Noch niemand angelegt. Trage unten die erste Person ein.</p>
      ) : (
        <ul className="members">
          {data.members.map((m) => {
            const t = getTargets(m)
            return (
              <li key={m.id} className="card member">
                <div>
                  <strong>{m.name}</strong>
                  <span className="muted">
                    {' '}· {SEX_LABEL[m.sex]}, {m.age} Jahre, {m.weightKg} kg
                    {m.status !== 'none' && ` · ${STATUS_LABEL[m.status]}`}
                  </span>
                  <div className="targets">
                    Richtwerte pro Tag: Protein {t.protein} g · Kalzium {t.calcium} mg · Eisen {t.iron} mg
                  </div>
                </div>
                <button type="button" className="btn small-btn" onClick={() => remove(m.id)}>Entfernen</button>
              </li>
            )
          })}
        </ul>
      )}

      <form className="card form-card" onSubmit={add}>
        <h2>Person hinzufügen</h2>
        <label>Name<input value={form.name} onChange={set('name')} /></label>
        <label>
          Geschlecht
          <select value={form.sex} onChange={set('sex')}>
            <option value="female">weiblich</option>
            <option value="male">männlich</option>
            <option value="diverse">divers</option>
          </select>
        </label>
        <label>Alter (Jahre)<input type="number" inputMode="numeric" value={form.age} onChange={set('age')} /></label>
        <label>Gewicht (kg)<input type="number" inputMode="decimal" value={form.weightKg} onChange={set('weightKg')} /></label>
        {form.sex !== 'male' && (
          <label>
            Schwangerschaft / Stillzeit
            <select value={form.status} onChange={set('status')}>
              <option value="none">Keine</option>
              <option value="pregnant">Schwanger</option>
              <option value="breastfeeding">Stillend</option>
            </select>
          </label>
        )}
        {error && <p className="notice warn" role="alert">{error}</p>}
        <button className="btn primary" type="submit">Hinzufügen</button>
      </form>

      {data.members.length > 0 && (
        <div className="actions">
          <Link className="btn primary" to="/gerichte">Weiter zu den Gerichten</Link>
        </div>
      )}
    </section>
  )
}
