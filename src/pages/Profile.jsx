import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../lib/AppState.jsx'
import { getTargets, DISCLAIMER } from '../lib/nutrition.js'

const SEX_LABEL = { female: 'female', male: 'male', diverse: 'diverse' }
const STATUS_LABEL = { none: 'None', pregnant: 'Pregnant', breastfeeding: 'Breastfeeding' }
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
    if (!form.name.trim()) return setError('Please enter a name.')
    if (!Number.isFinite(age) || age < 1 || age > 110) return setError('Please enter an age between 1 and 110 years.')
    if (!Number.isFinite(weightKg) || weightKg < 5 || weightKg > 250) return setError('Please enter a weight between 5 and 250 kg.')
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
      <h1>Your family</h1>
      <p className="notice">{DISCLAIMER}</p>

      {data.members.length === 0 ? (
        <p className="muted">Nobody added yet. Enter the first person below.</p>
      ) : (
        <ul className="members">
          {data.members.map((m) => {
            const t = getTargets(m)
            return (
              <li key={m.id} className="card member">
                <div>
                  <strong>{m.name}</strong>
                  <span className="muted">
                    {' '}· {SEX_LABEL[m.sex]}, {m.age} years, {m.weightKg} kg
                    {m.status !== 'none' && ` · ${STATUS_LABEL[m.status]}`}
                  </span>
                  <div className="targets">
                    Daily guidelines: protein {t.protein} g · calcium {t.calcium} mg · iron {t.iron} mg
                  </div>
                </div>
                <button type="button" className="btn small-btn" onClick={() => remove(m.id)}>Remove</button>
              </li>
            )
          })}
        </ul>
      )}

      <form className="card form-card" onSubmit={add}>
        <h2>Add a person</h2>
        <label>Name<input value={form.name} onChange={set('name')} /></label>
        <label>
          Sex
          <select value={form.sex} onChange={set('sex')}>
            <option value="female">female</option>
            <option value="male">male</option>
            <option value="diverse">diverse</option>
          </select>
        </label>
        <label>Age (years)<input type="number" inputMode="numeric" value={form.age} onChange={set('age')} /></label>
        <label>Weight (kg)<input type="number" inputMode="decimal" value={form.weightKg} onChange={set('weightKg')} /></label>
        {form.sex !== 'male' && (
          <label>
            Pregnancy / breastfeeding
            <select value={form.status} onChange={set('status')}>
              <option value="none">None</option>
              <option value="pregnant">Pregnant</option>
              <option value="breastfeeding">Breastfeeding</option>
            </select>
          </label>
        )}
        {error && <p className="notice warn" role="alert">{error}</p>}
        <button className="btn primary" type="submit">Add</button>
      </form>

      {data.members.length > 0 && (
        <div className="actions">
          <Link className="btn primary" to="/dishes">Continue to the dishes</Link>
        </div>
      )}
    </section>
  )
}
