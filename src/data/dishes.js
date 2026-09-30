import { computeNutrients, classify } from '../lib/dishNutrients.js'

// 17 vegan demo dishes. Ingredient amounts are per adult portion.
// Nutrition is COMPUTED from the ingredients (see data/ingredients.js and lib/dishNutrients.js).
// The values are approximations, not medically verified.
//
// Rules these data follow (see tests/dishes.test.js):
//  - Protein in every dish (at least 15 g)
//  - Calcium-rich (from 300 mg) and iron-rich (iron from 5 mg, under 300 mg calcium) exclude each other
//  - Iron-rich dishes contain a vitamin C source (at least 30 mg)

export const CATEGORIES = [
  'Vegetables',
  'Fruit',
  'Legumes',
  'Grains & pasta',
  'Chilled',
  'Nuts & seeds',
  'Pantry & spices',
]

const V = 'Vegetables'
const O = 'Fruit'
const H = 'Legumes'
const G = 'Grains & pasta'
const K = 'Chilled'
const N = 'Nuts & seeds'
const P = 'Pantry & spices'

const ing = (name, amount, unit, category) => ({ name, amount, unit, category })

export const DISHES = [
  {
    id: 'tofu-veggie-stir-fry',
    name: 'Tofu and Vegetable Stir-Fry with Rice',
    ingredients: [
      ing('Tofu (plain)', 150, 'g', K),
      ing('Broccoli', 150, 'g', V),
      ing('Bell pepper', 0.5, 'pc', V),
      ing('Carrot', 1, 'pc', V),
      ing('Rice', 80, 'g', G),
      ing('Soy sauce', 1, 'tbsp', P),
      ing('Oil', 1, 'tbsp', P),
      ing('Sesame seeds', 1, 'tsp', N),
    ],
    steps: [
      'Cook the rice according to the packet instructions.',
      'Cut the tofu into cubes and fry in oil until golden, then take it out of the pan.',
      'Chop the broccoli, bell pepper and carrot and stir-fry for 5–6 minutes in the same pan.',
      'Add the tofu and soy sauce and fry briefly together.',
      'Serve on the rice, sprinkled with sesame seeds.',
    ],
  },
  {
    id: 'red-lentil-dal',
    name: 'Red Lentil Dal with Bell Pepper',
    ingredients: [
      ing('Red lentils', 90, 'g', H),
      ing('Coconut milk', 100, 'ml', P),
      ing('Bell pepper', 1, 'pc', V),
      ing('Onion', 0.5, 'pc', V),
      ing('Garlic', 1, 'clove', V),
      ing('Tomatoes (canned)', 100, 'g', P),
      ing('Curry powder', 1, 'tsp', P),
      ing('Rice', 70, 'g', G),
      ing('Lemon', 0.25, 'pc', O),
    ],
    steps: [
      'Dice the onion and garlic and fry briefly with the curry powder.',
      'Add the lentils, tomatoes and coconut milk with about 250 ml of water.',
      'Simmer for 15 minutes, stirring now and then.',
      'Cut the bell pepper into strips and cook it for the last 5 minutes.',
      'Season with lemon juice and serve with rice. The vitamin C from the pepper and lemon helps with iron absorption.',
    ],
  },
  {
    id: 'chickpea-spinach-curry',
    name: 'Chickpea and Spinach Curry',
    ingredients: [
      ing('Chickpeas (canned)', 120, 'g', H),
      ing('Spinach', 100, 'g', V),
      ing('Onion', 0.5, 'pc', V),
      ing('Coconut milk', 100, 'ml', P),
      ing('Tomatoes (canned)', 100, 'g', P),
      ing('Curry powder', 1, 'tsp', P),
      ing('Rice', 70, 'g', G),
      ing('Lemon', 0.25, 'pc', O),
    ],
    steps: [
      'Cook the rice.',
      'Dice the onion and fry it with the curry powder.',
      'Add the tomatoes, coconut milk and drained chickpeas and simmer for 10 minutes.',
      'Stir in the spinach until it wilts.',
      'Season with lemon juice and serve with the rice.',
    ],
  },
  {
    id: 'lentil-bolognese',
    name: 'Spaghetti with Lentil Bolognese',
    ingredients: [
      ing('Wholewheat spaghetti', 90, 'g', G),
      ing('Red lentils', 60, 'g', H),
      ing('Tomatoes (canned)', 200, 'g', P),
      ing('Carrot', 1, 'pc', V),
      ing('Onion', 0.5, 'pc', V),
      ing('Garlic', 1, 'clove', V),
      ing('Bell pepper', 0.5, 'pc', V),
      ing('Olive oil', 1, 'tbsp', P),
    ],
    steps: [
      'Finely dice the onion, garlic, carrot and bell pepper and fry in olive oil.',
      'Add the lentils, tomatoes and about 150 ml of water.',
      'Simmer for 15 minutes until the lentils are soft.',
      'Cook the spaghetti and drain.',
      'Pour the sauce over the spaghetti. Season with salt, pepper and oregano.',
    ],
  },
  {
    id: 'tempeh-broccoli-bowl',
    name: 'Tempeh Bowl with Broccoli and Quinoa',
    ingredients: [
      ing('Tempeh', 120, 'g', K),
      ing('Broccoli', 150, 'g', V),
      ing('Quinoa', 70, 'g', G),
      ing('Carrot', 1, 'pc', V),
      ing('Soy sauce', 1, 'tbsp', P),
      ing('Oil', 1, 'tbsp', P),
      ing('Sesame seeds', 1, 'tsp', N),
    ],
    steps: [
      'Cook the quinoa according to the packet instructions.',
      'Slice the tempeh and fry in oil until crispy.',
      'Cut the broccoli into florets and steam or boil for 4 minutes. Grate the carrot.',
      'Deglaze the tempeh with soy sauce.',
      'Arrange everything in a bowl and sprinkle with sesame seeds.',
    ],
  },
  {
    id: 'black-bean-chili',
    name: 'Black Bean Chili with Bell Pepper',
    ingredients: [
      ing('Black beans (canned)', 150, 'g', H),
      ing('Sweetcorn (canned)', 60, 'g', V),
      ing('Bell pepper', 1, 'pc', V),
      ing('Onion', 0.5, 'pc', V),
      ing('Tomatoes (canned)', 150, 'g', P),
      ing('Rice', 70, 'g', G),
      ing('Ground cumin', 1, 'tsp', P),
      ing('Lime', 0.5, 'pc', O),
    ],
    steps: [
      'Cook the rice.',
      'Dice the onion, fry it with the cumin and add the bell pepper pieces.',
      'Add the tomatoes, drained beans and sweetcorn and simmer for 15 minutes.',
      'Season with lime juice, salt and a little chili.',
      'Serve with the rice.',
    ],
  },
  {
    id: 'baked-tofu-sweet-potato-kale',
    name: 'Baked Tofu with Sweet Potato and Kale',
    ingredients: [
      ing('Tofu (plain)', 150, 'g', K),
      ing('Sweet potato', 250, 'g', V),
      ing('Kale', 100, 'g', V),
      ing('Olive oil', 1, 'tbsp', P),
      ing('Soy sauce', 1, 'tbsp', P),
      ing('Paprika powder', 1, 'tsp', P),
      ing('Sesame seeds', 1, 'tsp', N),
    ],
    steps: [
      'Preheat the oven to 200 °C.',
      'Cut the sweet potato into wedges and the tofu into cubes, and mix with oil, soy sauce and paprika powder.',
      'Bake on a tray for 25 minutes.',
      'Tear the kale into small pieces and add it to the tray for the last 8 minutes.',
      'Sprinkle with sesame seeds and serve.',
    ],
  },
  {
    id: 'falafel-plate',
    name: 'Falafel Plate with Tomato Salad',
    ingredients: [
      ing('Chickpeas (canned)', 150, 'g', H),
      ing('Onion', 0.5, 'pc', V),
      ing('Parsley', 10, 'g', V),
      ing('Olive oil', 1, 'tbsp', P),
      ing('Ground cumin', 1, 'tsp', P),
      ing('Tomato', 1.5, 'pc', V),
      ing('Cucumber', 0.5, 'pc', V),
      ing('Flatbread', 1, 'pc', G),
      ing('Lemon', 0.25, 'pc', O),
    ],
    steps: [
      'Roughly blend the chickpeas with the onion, parsley and cumin.',
      'Shape the mixture into small balls.',
      'Bake in the oven at 200 °C for 20 minutes, turning once.',
      'Dice the tomato and cucumber and dress with lemon juice.',
      'Mix olive oil with lemon juice and a little water into a sauce and serve everything with the flatbread.',
    ],
  },
  {
    id: 'pea-pesto-pasta',
    name: 'Pasta with Pea Pesto and Tofu Parmesan',
    ingredients: [
      ing('Pasta', 90, 'g', G),
      ing('Peas (frozen)', 100, 'g', V),
      ing('Cashews', 20, 'g', N),
      ing('Tofu (plain)', 80, 'g', K),
      ing('Nutritional yeast', 1, 'tbsp', P),
      ing('Basil', 10, 'g', V),
      ing('Garlic', 1, 'clove', V),
      ing('Bell pepper', 0.5, 'pc', V),
      ing('Lemon', 0.25, 'pc', O),
      ing('Olive oil', 1, 'tbsp', P),
    ],
    steps: [
      'Cook the pasta, adding the peas for the last 3 minutes.',
      'Blend half of the peas with the cashews, basil, garlic, olive oil and lemon juice into a pesto.',
      'Crumble the tofu with the nutritional yeast and a pinch of salt (tofu parmesan).',
      'Cut the bell pepper into fine strips and mix with the pasta and the pesto.',
      'Sprinkle with the tofu parmesan.',
    ],
  },
  {
    id: 'lentil-vegetable-soup',
    name: 'Vegetable and Lentil Soup with Wholegrain Bread',
    ingredients: [
      ing('Brown lentils', 80, 'g', H),
      ing('Carrot', 1, 'pc', V),
      ing('Celery', 50, 'g', V),
      ing('Potatoes', 150, 'g', V),
      ing('Onion', 0.5, 'pc', V),
      ing('Tomatoes (canned)', 100, 'g', P),
      ing('Bell pepper', 0.5, 'pc', V),
      ing('Vegetable stock', 300, 'ml', P),
      ing('Wholegrain bread', 2, 'slice', G),
    ],
    steps: [
      'Dice the onion, carrot, celery and potatoes and fry briefly.',
      'Add the lentils, tomatoes and vegetable stock.',
      'Simmer for 25 minutes until the lentils and potatoes are soft.',
      'Cook the diced bell pepper in the soup for the last 5 minutes.',
      'Serve with the wholegrain bread.',
    ],
  },
  {
    id: 'pumpkin-chickpea-tahini',
    name: 'Roasted Pumpkin and Chickpeas with Tahini',
    ingredients: [
      ing('Pumpkin', 250, 'g', V),
      ing('Chickpeas (canned)', 120, 'g', H),
      ing('Kale', 80, 'g', V),
      ing('Quinoa', 50, 'g', G),
      ing('Tahini', 2, 'tbsp', N),
      ing('Lemon', 0.5, 'pc', O),
      ing('Olive oil', 1, 'tbsp', P),
    ],
    steps: [
      'Preheat the oven to 200 °C.',
      'Dice the pumpkin and bake on a tray with the chickpeas and olive oil for 25 minutes.',
      'Cook the quinoa.',
      'Add the kale to the tray for the last 8 minutes.',
      'Stir the tahini with lemon juice and a little water and pour it over everything.',
    ],
  },
  {
    id: 'tofu-scramble',
    name: 'Tofu Scramble with Roasted Potatoes and Spinach',
    ingredients: [
      ing('Tofu (plain)', 150, 'g', K),
      ing('Potatoes', 250, 'g', V),
      ing('Spinach', 80, 'g', V),
      ing('Onion', 0.5, 'pc', V),
      ing('Nutritional yeast', 1, 'tbsp', P),
      ing('Turmeric', 1, 'tsp', P),
      ing('Olive oil', 1, 'tbsp', P),
    ],
    steps: [
      'Cut the potatoes into wedges and roast at 200 °C for 30 minutes.',
      'Dice the onion and fry it in oil.',
      'Crumble the tofu, add it to the onion with the turmeric and nutritional yeast and fry for 5 minutes.',
      'Fold in the spinach until it wilts.',
      'Season with salt and pepper and serve with the potatoes.',
    ],
  },
  {
    id: 'bean-burritos',
    name: 'Bean Burritos with Guacamole',
    ingredients: [
      ing('Kidney beans (canned)', 120, 'g', H),
      ing('Sweetcorn (canned)', 50, 'g', V),
      ing('Tortilla wrap', 2, 'pc', G),
      ing('Avocado', 0.5, 'pc', O),
      ing('Tomato', 1, 'pc', V),
      ing('Bell pepper', 0.5, 'pc', V),
      ing('Rice', 40, 'g', G),
      ing('Lime', 0.5, 'pc', O),
      ing('Ground cumin', 1, 'tsp', P),
    ],
    steps: [
      'Cook the rice.',
      'Warm the beans, sweetcorn and diced bell pepper with the cumin in a pan for 5 minutes.',
      'Mash the avocado with lime juice (guacamole) and dice the tomato.',
      'Warm the tortillas briefly.',
      'Fill the tortillas with everything, roll them up and serve.',
    ],
  },
  {
    id: 'peanut-tofu-noodles',
    name: 'Peanut Tofu Noodles with Vegetables',
    ingredients: [
      ing('Pasta', 90, 'g', G),
      ing('Tofu (plain)', 80, 'g', K),
      ing('Peanut butter', 2, 'tbsp', N),
      ing('Carrot', 1, 'pc', V),
      ing('Bell pepper', 0.5, 'pc', V),
      ing('Spring onion', 2, 'pc', V),
      ing('Soy sauce', 1, 'tbsp', P),
      ing('Lime', 0.5, 'pc', O),
    ],
    steps: [
      'Cook the noodles.',
      'Cube the tofu and fry until crispy.',
      'Cut the carrot and bell pepper into strips and fry briefly.',
      'Stir the peanut butter with soy sauce, lime juice and a little warm water into a sauce.',
      'Mix everything together and sprinkle with spring onions.',
    ],
  },
  {
    id: 'potato-bean-bake',
    name: 'Potato and White Bean Bake',
    ingredients: [
      ing('Potatoes', 250, 'g', V),
      ing('White beans (canned)', 120, 'g', H),
      ing('Zucchini', 150, 'g', V),
      ing('Soy cream', 100, 'ml', K),
      ing('Nutritional yeast', 1, 'tbsp', P),
      ing('Onion', 0.5, 'pc', V),
      ing('Garlic', 1, 'clove', V),
    ],
    steps: [
      'Slice the potatoes thinly and pre-cook for 8 minutes.',
      'Dice the onion, garlic and zucchini and fry briefly.',
      'Layer everything with the beans in a baking dish.',
      'Stir the soy cream with the nutritional yeast, salt and pepper and pour over the top.',
      'Bake at 200 °C for 25 minutes until golden.',
    ],
  },
  {
    id: 'white-bean-kale-stew',
    name: 'White Bean and Kale Stew',
    ingredients: [
      ing('White beans (canned)', 150, 'g', H),
      ing('Kale', 120, 'g', V),
      ing('Carrot', 1, 'pc', V),
      ing('Potatoes', 100, 'g', V),
      ing('Onion', 0.5, 'pc', V),
      ing('Vegetable stock', 300, 'ml', P),
      ing('Olive oil', 1, 'tbsp', P),
    ],
    steps: [
      'Dice the onion, carrot and potatoes and fry in olive oil.',
      'Pour in the vegetable stock and simmer for 15 minutes.',
      'Add the beans and the torn kale.',
      'Cook for another 8 minutes until the kale is soft.',
      'Season with salt, pepper and a little nutmeg.',
    ],
  },
  {
    id: 'beetroot-lentil-salad',
    name: 'Beetroot and Lentil Salad with Orange',
    ingredients: [
      ing('Brown lentils', 80, 'g', H),
      ing('Beetroot (cooked)', 150, 'g', V),
      ing('Orange', 1, 'pc', O),
      ing('Walnuts', 20, 'g', N),
      ing("Lamb's lettuce", 50, 'g', V),
      ing('Olive oil', 1, 'tbsp', P),
      ing('Mustard', 1, 'tsp', P),
    ],
    steps: [
      'Cook the lentils according to the packet instructions and let them cool.',
      'Dice the beetroot, segment the orange and catch the juice.',
      'Whisk the orange juice with olive oil, mustard, salt and pepper into a dressing.',
      "Mix the lentils, beetroot, orange segments and lamb's lettuce.",
      'Pour the dressing over the salad and sprinkle with chopped walnuts.',
    ],
  },
].map((d) => {
  const nutrients = computeNutrients(d.ingredients)
  return { ...d, nutrients, image: `/images/${d.id}.jpg`, ...classify(nutrients) }
})

export const getDish = (id) => DISHES.find((d) => d.id === id)
