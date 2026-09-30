import { describe, it, expect } from 'vitest'
import { cookAmount, formatPortions } from '../src/lib/recipe.js'

const ing = (amount, unit, name = 'X') => ({ name, amount, unit, category: 'Gemüse' })

describe('cookAmount', () => {
  it('scales grams and rounds to 5 g', () => {
    expect(cookAmount(ing(150, 'g'), 1)).toBe('150 g')
    expect(cookAmount(ing(70, 'g'), 2.5)).toBe('175 g')
    expect(cookAmount(ing(10, 'g'), 0.5)).toBe('5 g')
    expect(cookAmount(ing(90, 'g'), 2.5)).toBe('225 g')
  })
  it('switches to kg and litres for large amounts', () => {
    expect(cookAmount(ing(250, 'g'), 6)).toBe('1,5 kg')
    expect(cookAmount(ing(300, 'ml'), 4)).toBe('1,2 l')
  })
  it('writes pieces and spoons with fractions', () => {
    expect(cookAmount(ing(0.5, 'Stück'), 1)).toBe('½ Stück')
    expect(cookAmount(ing(0.5, 'Stück'), 2.5)).toBe('1 ¼ Stück')
    expect(cookAmount(ing(1, 'TL'), 2.5)).toBe('2 ½ TL')
    expect(cookAmount(ing(1, 'EL'), 0.5)).toBe('½ EL')
  })
  it('uses singular and plural for cloves and slices', () => {
    expect(cookAmount(ing(1, 'Zehe'), 1)).toBe('1 Zehe')
    expect(cookAmount(ing(1, 'Zehe'), 2.5)).toBe('2 ½ Zehen')
    expect(cookAmount(ing(2, 'Scheibe'), 1)).toBe('2 Scheiben')
  })
  it('never shows zero', () => {
    expect(cookAmount(ing(0.25, 'Stück'), 0.5)).toBe('¼ Stück')
  })
})

describe('formatPortions', () => {
  it('uses a decimal comma', () => {
    expect(formatPortions(2.5)).toBe('2,5')
    expect(formatPortions(4)).toBe('4')
  })
})
