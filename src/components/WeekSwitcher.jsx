import { useAppState } from '../lib/AppState.jsx'
import { weekRange } from '../lib/weeks.js'

// Chooses which week you are planning: "This week", "Next week" … with arrows.
export default function WeekSwitcher() {
  const { weekKey, weekTitle, moveWeek, canPrev, canNext, todayKey, goToThisWeek } = useAppState()

  return (
    <div className="week-switcher" role="group" aria-label="Choose the week">
      <button type="button" className="step-btn" onClick={() => moveWeek(-1)} disabled={!canPrev} aria-label="Previous week">‹</button>
      <div className="week-name" aria-live="polite">
        <strong>{weekTitle}</strong>
        <span className="muted small">{weekRange(weekKey)}</span>
      </div>
      <button type="button" className="step-btn" onClick={() => moveWeek(1)} disabled={!canNext} aria-label="Next week">›</button>
      {weekKey !== todayKey && (
        <button type="button" className="link-btn" onClick={goToThisWeek}>Back to this week</button>
      )}
    </div>
  )
}
