// Nutrition per ingredient, per 100 g (or 100 ml). Basis for the computed nutrition of each dish.
//
// IMPORTANT: These are typical approximate values for RAW ingredients, taken from the developer's
// knowledge (in line with USDA/BLS values), not from a database that was looked up. They are a guideline.
// Values that vary a lot:
//  - Tofu: calcium depends on the coagulant (calcium sulphate roughly 350-700 mg, nigari roughly
//    100-200 mg per 100 g). Without a label on the pack we assume the middle value of 200 mg.
//  - Vitamin C is partly lost when cooking (see VITAMIN_C_RETENTION in lib/dishNutrients.js).
//
// unitGrams: weight of one unit in grams (for pc, clove, slice, tbsp, tsp).
// For g and ml the amount is used directly as grams.

const n = (protein, calcium, iron, vitaminC, unitGrams = {}) => ({ protein, calcium, iron, vitaminC, unitGrams })

export const INGREDIENTS = {
  'Avocado': n(2, 12, 0.6, 10, { pc: 150 }),
  'Basil': n(3.2, 177, 3.2, 18),
  'Brown lentils': n(24, 56, 7.5, 4),
  'Broccoli': n(2.8, 47, 0.7, 89),
  'Cashews': n(18, 37, 6.7, 0.5),
  'Curry powder': n(14, 478, 19, 1, { tsp: 2 }),
  'Peas (frozen)': n(5.2, 25, 1.5, 14),
  'Peanut butter': n(25, 49, 1.7, 0, { tbsp: 16 }),
  "Lamb's lettuce": n(2, 35, 2.0, 35),
  'Flatbread': n(9, 90, 2.5, 0, { pc: 100 }),
  'Spring onion': n(1.8, 72, 1.5, 19, { pc: 15 }),
  'Vegetable stock': n(0, 0, 0, 0),
  'Kale': n(4.3, 150, 1.6, 93),
  'Cucumber': n(0.7, 16, 0.3, 3, { pc: 300 }),
  'Nutritional yeast': n(50, 40, 4, 0, { tbsp: 5 }),
  'Carrot': n(0.9, 33, 0.3, 6, { pc: 80 }),
  'Potatoes': n(2, 10, 0.8, 15),
  'Chickpeas (canned)': n(7, 45, 2.2, 1.3),
  'Kidney beans (canned)': n(6.8, 40, 2.2, 0.5),
  'Garlic': n(6.4, 181, 1.7, 31, { clove: 3 }),
  'Coconut milk': n(2.3, 16, 1.6, 2),
  'Ground cumin': n(18, 931, 66, 8, { tsp: 2 }),
  'Turmeric': n(8, 168, 55, 1, { tsp: 3 }),
  'Pumpkin': n(1, 21, 0.8, 9),
  'Lime': n(0.7, 33, 0.6, 29, { pc: 60 }),
  'Sweetcorn (canned)': n(2.5, 5, 0.6, 5),
  'Pasta': n(13, 21, 2.5, 0),
  'Olive oil': n(0, 0, 0, 0, { tbsp: 13 }),
  'Oil': n(0, 0, 0, 0, { tbsp: 13 }),
  'Orange': n(0.9, 40, 0.1, 53, { pc: 130 }),
  'Bell pepper': n(1, 7, 0.4, 120, { pc: 150 }),
  'Paprika powder': n(14, 229, 21, 1, { tsp: 2.5 }),
  'Parsley': n(3, 138, 6.2, 133),
  'Quinoa': n(14, 47, 4.6, 0),
  'Rice': n(7, 10, 1.0, 0),
  'Beetroot (cooked)': n(1.7, 16, 0.8, 4),
  'Red lentils': n(24, 35, 7.5, 4),
  'Black beans (canned)': n(7, 35, 2.1, 0),
  'Celery': n(1.5, 43, 0.7, 8),
  'Mustard': n(4, 80, 1.5, 0, { tsp: 5 }),
  'Sesame seeds': n(18, 975, 14.6, 0, { tsp: 3 }),
  'Soy cream': n(1.5, 15, 0.3, 0),
  'Soy sauce': n(8, 17, 2.4, 0, { tbsp: 16 }),
  'Spinach': n(2.9, 99, 2.7, 28),
  'Sweet potato': n(1.6, 30, 0.6, 10),
  'Tahini': n(17, 426, 8.9, 0, { tbsp: 15 }),
  'Tempeh': n(19, 111, 2.7, 0),
  'Tofu (plain)': n(8, 200, 2.7, 0),
  'Tomato': n(0.9, 10, 0.3, 14, { pc: 120 }),
  'Tomatoes (canned)': n(1.0, 30, 1.0, 9),
  'Tortilla wrap': n(8, 100, 3, 0, { pc: 60 }),
  'Wholegrain bread': n(8, 60, 2.5, 0, { slice: 45 }),
  'Wholewheat spaghetti': n(13.5, 40, 3.6, 0),
  'Walnuts': n(15, 98, 2.9, 1.3),
  'White beans (canned)': n(7, 65, 2.4, 0),
  'Lemon': n(1.1, 26, 0.6, 50, { pc: 60 }),
  'Zucchini': n(1.2, 16, 0.4, 18),
  'Onion': n(1.1, 23, 0.2, 7, { pc: 110 }),
}
