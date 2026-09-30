import { useState } from 'react'
import { DndContext, KeyboardSensor, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { Link, Navigate } from 'react-router-dom'
import { useAppState } from '../lib/AppState.jsx'
import { getDish } from '../data/dishes.js'
import { MEALS, MEAL_LABEL, calciumWarnings, dayLabel, sortDays, swapSlots } from '../lib/planner.js'

const slotId = (day, meal) => `${day}:${meal}`

function DishCell({ dishId }) {
  const dish = getDish(dishId)
  if (!dish) return <span className="muted">–</span>
  return (
    <Link to={`/gerichte/${dish.id}`} className="plan-dish">
      {dish.name}
      {dish.calciumRich && <span className="mini-tag">Kalzium</span>}
      {dish.ironRich && <span className="mini-tag">Eisen</span>}
    </Link>
  )
}

// Ein Platz im Plan: Er nimmt ein Gericht auf (Ablegen) und lässt es am Griff ziehen.
function Slot({ day, meal, dishId }) {
  const id = slotId(day, meal)
  const { setNodeRef: dropRef, isOver } = useDroppable({ id })
  const { attributes, listeners, setNodeRef: dragRef, transform, isDragging } = useDraggable({ id })
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined

  return (
    <div ref={dropRef} className={`plan-slot${isOver ? ' over' : ''}`}>
      <span className="slot-label">{MEAL_LABEL[meal]}</span>
      <div ref={dragRef} style={style} className={`plan-item${isDragging ? ' dragging' : ''}`}>
        <button
          type="button"
          className="drag-handle"
          aria-label={`${MEAL_LABEL[meal]} am ${dayLabel(day)} verschieben`}
          {...listeners}
          {...attributes}
        >
          ⠿
        </button>
        <DishCell dishId={dishId} />
      </div>
    </div>
  )
}

export default function WeekPlan() {
  const { data, update } = useAppState()
  const [dismissed, setDismissed] = useState([])
  const plan = data.plan
  // Der Griff reagiert erst nach ein paar Pixeln Bewegung, damit ein Antippen nicht als Ziehen zählt.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  )

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const [fromDay, fromMeal] = String(active.id).split(':')
    const [toDay, toMeal] = String(over.id).split(':')
    update({ plan: swapSlots(plan, { day: fromDay, meal: fromMeal }, { day: toDay, meal: toMeal }) })
    setDismissed([]) // nach einer Änderung wird neu geprüft
  }

  if (!plan || Object.keys(plan).length === 0) return <Navigate to="/gerichte" replace />

  const days = sortDays(Object.keys(plan))
  const warned = calciumWarnings(plan).filter((d) => !dismissed.includes(d))

  return (
    <section>
      <div className="section-head">
        <h1>Dein Wochenplan</h1>
        <p className="muted">Tippe auf ein Gericht für Details und Rezept. Mit dem Griff ⠿ verschiebst du es an einen anderen Platz.</p>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="plan">
        {days.map((day) => (
          <div key={day} className="card plan-day">
            <h2>{dayLabel(day)}</h2>
            {MEALS.map((meal) => (
              <Slot key={meal} day={day} meal={meal} dishId={plan[day][meal]} />
            ))}
            {warned.includes(day) && (
              <div className="notice warn" role="alert">
                <p>
                  Mittag- und Abendessen sind an diesem Tag beide kalziumreich. Viel Kalzium in
                  einer Mahlzeit kann die Eisenaufnahme hemmen – vielleicht tauschst du eines gegen
                  ein eisenreiches Gericht.
                </p>
                <button type="button" className="btn small-btn" onClick={() => setDismissed([...dismissed, day])}>
                  Trotzdem so lassen
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      </DndContext>

      <div className="actions">
        <Link className="btn" to="/gerichte">Gerichte ändern</Link>{' '}
        <button type="button" className="btn primary" disabled title="Kommt im nächsten Schritt">
          Fertig
        </button>
      </div>
    </section>
  )
}
