// Daily guideline values per person for protein, calcium and iron.
// Basis: reference values of the DGE (German Nutrition Society, D-A-CH), retrieved 2026-09-30:
//   Protein: https://www.dge.de/wissenschaft/referenzwerte/protein/
//   Calcium: https://www.dge.de/wissenschaft/referenzwerte/calcium/
//   Iron:    https://www.dge.de/wissenschaft/referenzwerte/eisen/
// These are general guideline values for orientation, not medical advice.
//
// TO CHECK: The iron values for children from 10 years (marked "check") were not clear
// when retrieved. Compare with the DGE reference value tool: https://www.dge.de/wissenschaft/referenzwerte-tool/

export const DISCLAIMER = 'Guideline values for orientation – not medical advice.'

// status: 'none' | 'pregnant' | 'breastfeeding'   sex: 'female' | 'male' | 'diverse'

function proteinPerKg({ age, sex, status }) {
  if (status === 'pregnant') return 1.0 // 3rd trimester (cautious, since the trimester is not asked)
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
  if (age < 7) return 7 // 1 to <7 years
  if (age < 10) return 10
  if (age < 13) return male ? 12 : 14 // check
  if (age < 19) return male ? 11 : 16 // check
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

// Daily guideline values of one person. weightKg is only needed for protein.
export function getTargets(member) {
  const m = { status: 'none', sex: 'female', ...member }
  const perKg = proteinPerKg(m)
  return {
    protein: Math.round(perKg * m.weightKg),
    calcium: calcium(m),
    iron: iron(m),
  }
}

// Portion factor for shopping quantities: up to 12 years half a portion, otherwise a whole one.
export function portionFactor(member) {
  return member.age <= 12 ? 0.5 : 1
}

export function totalPortions(members) {
  return members.reduce((sum, m) => sum + portionFactor(m), 0)
}
