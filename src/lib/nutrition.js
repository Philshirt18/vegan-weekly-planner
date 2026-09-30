// Richtwerte pro Person und Tag für Protein, Kalzium und Eisen.
// Grundlage: Referenzwerte der DGE (D-A-CH), abgerufen am 2026-09-30:
//   Protein: https://www.dge.de/wissenschaft/referenzwerte/protein/
//   Kalzium: https://www.dge.de/wissenschaft/referenzwerte/calcium/
//   Eisen:   https://www.dge.de/wissenschaft/referenzwerte/eisen/
// Das sind allgemeine Richtwerte zur Orientierung, keine medizinische Beratung.
//
// ZU PRÜFEN: Die Eisenwerte für Kinder ab 10 Jahren (markiert mit "prüfen") waren beim
// Abruf nicht eindeutig. Gegen das DGE-Referenzwerte-Tool gegenlesen: https://www.dge.de/wissenschaft/referenzwerte-tool/

export const DISCLAIMER = 'Richtwerte zur Orientierung – keine medizinische Beratung.'

// status: 'none' | 'pregnant' | 'breastfeeding'   sex: 'female' | 'male' | 'diverse'

function proteinPerKg({ age, sex, status }) {
  if (status === 'pregnant') return 1.0 // 3. Trimester (vorsichtig, da das Trimester nicht abgefragt wird)
  if (status === 'breastfeeding') return 1.2
  if (age < 1) return 1.3
  if (age < 4) return 1.0
  if (age < 15) return 0.9
  if (age < 19) return sex === 'female' ? 0.8 : 0.9
  if (age < 65) return 0.8
  return 1.0
}

function calcium({ age, status }) {
  if (status !== 'none' && age < 19) return 1200
  if (status !== 'none') return 1000
  if (age < 1) return 330
  if (age < 4) return 600
  if (age < 7) return 750
  if (age < 10) return 900
  if (age < 13) return 1100
  if (age < 19) return 1200
  return 1000
}

function ironFor({ age, sex }) {
  const male = sex === 'male'
  if (age < 7) return 7 // 1 bis <7 Jahre
  if (age < 10) return 10
  if (age < 13) return male ? 12 : 14 // prüfen
  if (age < 19) return male ? 11 : 16 // prüfen
  if (age < 51) return male ? 11 : 16
  return male ? 11 : 14
}

function iron({ age, sex, status }) {
  if (status === 'pregnant') return 27
  if (status === 'breastfeeding') return 16
  if (sex === 'diverse') {
    return Math.max(ironFor({ age, sex: 'male' }), ironFor({ age, sex: 'female' }))
  }
  return ironFor({ age, sex })
}

// Tagesrichtwerte einer Person. weightKg wird nur für Protein gebraucht.
export function getTargets(member) {
  const m = { status: 'none', sex: 'female', ...member }
  const perKg = proteinPerKg(m)
  return {
    protein: Math.round(perKg * m.weightKg),
    calcium: calcium(m),
    iron: iron(m),
  }
}

// Portionsfaktor für Einkaufsmengen: bis 12 Jahre eine halbe Portion, sonst eine ganze.
export function portionFactor(member) {
  return member.age <= 12 ? 0.5 : 1
}

export function totalPortions(members) {
  return members.reduce((sum, m) => sum + portionFactor(m), 0)
}
