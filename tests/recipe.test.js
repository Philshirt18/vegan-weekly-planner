import { describe, it, expect } from 'vitest'
import { cookAmount, formatPortions } from '../src/lib/recipe.js'

const ing = (amount, unit, name = 'X') => ({ name, amount, unit, category: 'Vegetables' })

describe('cookAmount', () => {
  it('scales grams and rounds to 5 g', () => {
    expect(cookAmount(ing(150, 'g'), 1)).toBe('150 g')
    expect(cookAmount(ing(70, 'g'), 2.5)).toBe('175 g')
    expect(cookAmount(ing(10, 'g'), 0.5)).toBe('5 g')
    expect(cookAmount(ing(90, 'g'), 2.5)).toBe('225 g')
  })
  it('switches to kg and litres for large amounts', () => {
    expect(cookAmount(ing(250, 'g'), 6)).toBe('1.5 kg')
    expect(cookAmount(ing(300, 'ml'), 4)).toBe('1.2 l')
  })
  it('writes pieces and spoons with fractions', () => {
    expect(cookAmount(ing(0.5, 'pc'), 1)).toBe('½')
    expect(cookAmount(ing(0.5, 'pc'), 2.5)).toBe('1 ¼')
    expect(cookAmount(ing(1, 'tsp'), 2.5)).toBe('2 ½ tsp')
    expect(cookAmount(ing(1, 'tbsp'), 0.5)).toBe('½ tbsp')
  })
  it('uses singular and plural for cloves and slices', () => {
    expect(cookAmount(ing(1, 'clove'), 1)).toBe('1 clove')
    expect(cookAmount(ing(1, 'clove'), 2.5)).toBe('2 ½ cloves')
    expect(cookAmount(ing(2, 'slice'), 1)).toBe('2 slices')
  })
  it('never shows zero', () => {
    expect(cookAmount(ing(0.25, 'pc'), 0.5)).toBe('¼')
  })
})

describe('formatPortions', () => {
  it('writes portions with a decimal point', () => {
    expect(formatPortions(2.5)).toBe('2.5')
    expect(formatPortions(4)).toBe('4')
  })
})
