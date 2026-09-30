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
    <Link to={`/dishes/${dish.id}`} className="plan-dish">
      {dish.name}
      {dish.calciumRich && <span className="mini-tag">Calcium</span>}
      {dish.ironRich && <span className="mini-tag">Iron</span>}
    </Link>
  )
}

// A slot in the plan: it takes a dish (drop) and lets it be dragged by the handle.
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
          aria-label={`Move ${MEAL_LABEL[meal].toLowerCase()} on ${dayLabel(day)}`}
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
  // The handle only reacts after a few pixels of movement, so a tap does not count as a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  )

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const [fromDay, fromMeal] = String(active.id).split(':')
    const [toDay, toMeal] = String(over.id).split(':')
    update({ plan: swapSlots(plan, { day: fromDay, meal: fromMeal }, { day: toDay, meal: toMeal }) })
    setDismissed([]) // after a change, everything is checked again
  }

  if (!plan || Object.keys(plan).length === 0) return <Navigate to="/dishes" replace />

  const days = sortDays(Object.keys(plan))
  const warned = calciumWarnings(plan).filter((d) => !dismissed.includes(d))

  return (
    <section>
      <div className="section-head">
        <h1>Your week plan</h1>
        <p className="muted">Tap a dish for details and the recipe. Use the handle ⠿ to move it to another slot.</p>
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
                  Lunch and dinner are both high in calcium on this day. A lot of calcium in one
                  meal can reduce iron absorption – you could swap one of them for a dish that is
                  high in iron.
                </p>
                <button type="button" className="btn small-btn" onClick={() => setDismissed([...dismissed, day])}>
                  Keep it anyway
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      </DndContext>

      <div className="actions">
        <Link className="btn" to="/dishes">Change dishes</Link>{' '}
        <Link className="btn primary" to="/shopping">Done</Link>
      </div>
    </section>
  )
}
