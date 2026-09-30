import { computeNutrients, classify } from '../lib/dishNutrients.js'

// 17 vegane Demo-Gerichte. Die Zutatenmengen gelten pro Erwachsenenportion.
// Die Nährwerte werden aus den Zutaten BERECHNET (siehe data/ingredients.js und
// lib/dishNutrients.js). Sie sind Näherungswerte, nicht medizinisch geprüft.
//
// Regeln, die diese Daten einhalten (siehe tests/dishes.test.js):
//  - Protein in jedem Gericht (mindestens 15 g)
//  - Kalziumreich (ab 300 mg) und eisenreich (Eisen ab 5 mg, unter 300 mg Kalzium) schließen sich aus
//  - eisenreiche Gerichte enthalten eine Vitamin-C-Quelle (mindestens 30 mg)

export const CATEGORIES = [
  'Gemüse',
  'Obst',
  'Hülsenfrüchte',
  'Getreide & Nudeln',
  'Gekühltes',
  'Nüsse & Samen',
  'Vorrat & Gewürze',
]

const V = 'Gemüse'
const O = 'Obst'
const H = 'Hülsenfrüchte'
const G = 'Getreide & Nudeln'
const K = 'Gekühltes'
const N = 'Nüsse & Samen'
const P = 'Vorrat & Gewürze'

const ing = (name, amount, unit, category) => ({ name, amount, unit, category })

export const DISHES = [
  {
    id: 'tofu-gemuese-pfanne',
    name: 'Tofu-Gemüse-Pfanne mit Reis',
    ingredients: [
      ing('Tofu natur', 150, 'g', K),
      ing('Brokkoli', 150, 'g', V),
      ing('Paprika', 0.5, 'Stück', V),
      ing('Karotte', 1, 'Stück', V),
      ing('Reis', 80, 'g', G),
      ing('Sojasauce', 1, 'EL', P),
      ing('Öl', 1, 'EL', P),
      ing('Sesam', 1, 'TL', N),
    ],
    steps: [
      'Reis nach Packungsanleitung kochen.',
      'Tofu in Würfel schneiden und in Öl goldbraun anbraten, dann herausnehmen.',
      'Brokkoli, Paprika und Karotte klein schneiden und 5–6 Minuten im selben Topf braten.',
      'Tofu und Sojasauce dazugeben, kurz mitbraten.',
      'Mit Sesam bestreut auf dem Reis servieren.',
    ],
  },
  {
    id: 'linsen-dal',
    name: 'Rotes Linsen-Dal mit Paprika',
    ingredients: [
      ing('Rote Linsen', 90, 'g', H),
      ing('Kokosmilch', 100, 'ml', P),
      ing('Paprika', 1, 'Stück', V),
      ing('Zwiebel', 0.5, 'Stück', V),
      ing('Knoblauch', 1, 'Zehe', V),
      ing('Tomaten (Dose)', 100, 'g', P),
      ing('Currypulver', 1, 'TL', P),
      ing('Reis', 70, 'g', G),
      ing('Zitrone', 0.25, 'Stück', O),
    ],
    steps: [
      'Zwiebel und Knoblauch würfeln und mit Currypulver kurz anbraten.',
      'Linsen, Tomaten und Kokosmilch mit etwa 250 ml Wasser dazugeben.',
      '15 Minuten köcheln lassen, dabei gelegentlich umrühren.',
      'Paprika in Streifen schneiden und die letzten 5 Minuten mitgaren.',
      'Mit Zitronensaft abschmecken und mit Reis servieren. Das Vitamin C aus Paprika und Zitrone hilft bei der Eisenaufnahme.',
    ],
  },
  {
    id: 'kichererbsen-curry',
    name: 'Kichererbsen-Curry mit Spinat',
    ingredients: [
      ing('Kichererbsen (Dose)', 120, 'g', H),
      ing('Spinat', 100, 'g', V),
      ing('Zwiebel', 0.5, 'Stück', V),
      ing('Kokosmilch', 100, 'ml', P),
      ing('Tomaten (Dose)', 100, 'g', P),
      ing('Currypulver', 1, 'TL', P),
      ing('Reis', 70, 'g', G),
      ing('Zitrone', 0.25, 'Stück', O),
    ],
    steps: [
      'Reis kochen.',
      'Zwiebel würfeln und mit Currypulver anbraten.',
      'Tomaten, Kokosmilch und abgetropfte Kichererbsen dazugeben und 10 Minuten köcheln lassen.',
      'Spinat unterrühren, bis er zusammenfällt.',
      'Mit Zitronensaft abschmecken und mit dem Reis servieren.',
    ],
  },
  {
    id: 'spaghetti-linsen-bolognese',
    name: 'Spaghetti mit Linsen-Bolognese',
    ingredients: [
      ing('Vollkornspaghetti', 90, 'g', G),
      ing('Rote Linsen', 60, 'g', H),
      ing('Tomaten (Dose)', 200, 'g', P),
      ing('Karotte', 1, 'Stück', V),
      ing('Zwiebel', 0.5, 'Stück', V),
      ing('Knoblauch', 1, 'Zehe', V),
      ing('Paprika', 0.5, 'Stück', V),
      ing('Olivenöl', 1, 'EL', P),
    ],
    steps: [
      'Zwiebel, Knoblauch, Karotte und Paprika fein würfeln und in Olivenöl anbraten.',
      'Linsen, Tomaten und etwa 150 ml Wasser dazugeben.',
      '15 Minuten köcheln lassen, bis die Linsen weich sind.',
      'Spaghetti kochen und abgießen.',
      'Sauce über die Spaghetti geben. Mit Salz, Pfeffer und Oregano abschmecken.',
    ],
  },
  {
    id: 'tempeh-bowl',
    name: 'Tempeh-Bowl mit Brokkoli und Quinoa',
    ingredients: [
      ing('Tempeh', 120, 'g', K),
      ing('Brokkoli', 150, 'g', V),
      ing('Quinoa', 70, 'g', G),
      ing('Karotte', 1, 'Stück', V),
      ing('Sojasauce', 1, 'EL', P),
      ing('Öl', 1, 'EL', P),
      ing('Sesam', 1, 'TL', N),
    ],
    steps: [
      'Quinoa nach Packungsanleitung kochen.',
      'Tempeh in Scheiben schneiden und in Öl knusprig braten.',
      'Brokkoli in Röschen teilen und 4 Minuten dämpfen oder kochen, Karotte raspeln.',
      'Tempeh mit Sojasauce ablöschen.',
      'Alles in einer Schale anrichten und mit Sesam bestreuen.',
    ],
  },
  {
    id: 'schwarze-bohnen-chili',
    name: 'Schwarze-Bohnen-Chili mit Paprika',
    ingredients: [
      ing('Schwarze Bohnen (Dose)', 150, 'g', H),
      ing('Mais (Dose)', 60, 'g', V),
      ing('Paprika', 1, 'Stück', V),
      ing('Zwiebel', 0.5, 'Stück', V),
      ing('Tomaten (Dose)', 150, 'g', P),
      ing('Reis', 70, 'g', G),
      ing('Kreuzkümmel', 1, 'TL', P),
      ing('Limette', 0.5, 'Stück', O),
    ],
    steps: [
      'Reis kochen.',
      'Zwiebel würfeln, mit Kreuzkümmel anbraten und Paprikastücke dazugeben.',
      'Tomaten, abgetropfte Bohnen und Mais zufügen und 15 Minuten köcheln lassen.',
      'Mit Limettensaft, Salz und etwas Chili abschmecken.',
      'Zusammen mit dem Reis servieren.',
    ],
  },
  {
    id: 'tofu-suesskartoffel-gruenkohl',
    name: 'Ofen-Tofu mit Süßkartoffel und Grünkohl',
    ingredients: [
      ing('Tofu natur', 150, 'g', K),
      ing('Süßkartoffel', 250, 'g', V),
      ing('Grünkohl', 100, 'g', V),
      ing('Olivenöl', 1, 'EL', P),
      ing('Sojasauce', 1, 'EL', P),
      ing('Paprikapulver', 1, 'TL', P),
      ing('Sesam', 1, 'TL', N),
    ],
    steps: [
      'Ofen auf 200 °C vorheizen.',
      'Süßkartoffel in Spalten und Tofu in Würfel schneiden, mit Öl, Sojasauce und Paprikapulver mischen.',
      'Auf einem Blech 25 Minuten backen.',
      'Grünkohl klein zupfen und die letzten 8 Minuten mit aufs Blech geben.',
      'Mit Sesam bestreuen und servieren.',
    ],
  },
  {
    id: 'falafel-teller',
    name: 'Falafel-Teller mit Tomatensalat',
    ingredients: [
      ing('Kichererbsen (Dose)', 150, 'g', H),
      ing('Zwiebel', 0.5, 'Stück', V),
      ing('Petersilie', 10, 'g', V),
      ing('Olivenöl', 1, 'EL', P),
      ing('Kreuzkümmel', 1, 'TL', P),
      ing('Tomate', 1.5, 'Stück', V),
      ing('Gurke', 0.5, 'Stück', V),
      ing('Fladenbrot', 1, 'Stück', G),
      ing('Zitrone', 0.25, 'Stück', O),
    ],
    steps: [
      'Kichererbsen mit Zwiebel, Petersilie und Kreuzkümmel grob pürieren.',
      'Aus der Masse kleine Bällchen formen.',
      'Im Ofen bei 200 °C 20 Minuten backen, dabei einmal wenden.',
      'Tomate und Gurke würfeln und mit Zitronensaft anmachen.',
      'Olivenöl mit Zitronensaft und etwas Wasser zu einer Sauce verrühren und alles mit dem Fladenbrot anrichten.',
    ],
  },
  {
    id: 'nudeln-erbsen-pesto',
    name: 'Nudeln mit Erbsen-Pesto und Tofu-Parmesan',
    ingredients: [
      ing('Nudeln', 90, 'g', G),
      ing('Erbsen (TK)', 100, 'g', V),
      ing('Cashews', 20, 'g', N),
      ing('Tofu natur', 80, 'g', K),
      ing('Hefeflocken', 1, 'EL', P),
      ing('Basilikum', 10, 'g', V),
      ing('Knoblauch', 1, 'Zehe', V),
      ing('Paprika', 0.5, 'Stück', V),
      ing('Zitrone', 0.25, 'Stück', O),
      ing('Olivenöl', 1, 'EL', P),
    ],
    steps: [
      'Nudeln kochen und dabei die Erbsen in den letzten 3 Minuten mitkochen.',
      'Die Hälfte der Erbsen mit Cashews, Basilikum, Knoblauch, Olivenöl und Zitronensaft zu Pesto pürieren.',
      'Tofu mit Hefeflocken und einer Prise Salz zerbröseln (Tofu-Parmesan).',
      'Paprika in feine Streifen schneiden und mit den Nudeln und dem Pesto mischen.',
      'Mit Tofu-Parmesan bestreuen.',
    ],
  },
  {
    id: 'gemuese-linsen-suppe',
    name: 'Gemüse-Linsen-Suppe mit Vollkornbrot',
    ingredients: [
      ing('Braune Linsen', 80, 'g', H),
      ing('Karotte', 1, 'Stück', V),
      ing('Sellerie', 50, 'g', V),
      ing('Kartoffeln', 150, 'g', V),
      ing('Zwiebel', 0.5, 'Stück', V),
      ing('Tomaten (Dose)', 100, 'g', P),
      ing('Paprika', 0.5, 'Stück', V),
      ing('Gemüsebrühe', 300, 'ml', P),
      ing('Vollkornbrot', 2, 'Scheibe', G),
    ],
    steps: [
      'Zwiebel, Karotte, Sellerie und Kartoffeln würfeln und kurz anbraten.',
      'Linsen, Tomaten und Gemüsebrühe dazugeben.',
      '25 Minuten köcheln lassen, bis Linsen und Kartoffeln weich sind.',
      'Paprika in kleinen Stücken die letzten 5 Minuten mitgaren.',
      'Mit dem Vollkornbrot servieren.',
    ],
  },
  {
    id: 'kuerbis-kichererbsen-tahini',
    name: 'Kürbis-Kichererbsen-Ofengemüse mit Tahini',
    ingredients: [
      ing('Kürbis', 250, 'g', V),
      ing('Kichererbsen (Dose)', 120, 'g', H),
      ing('Grünkohl', 80, 'g', V),
      ing('Quinoa', 50, 'g', G),
      ing('Tahini', 2, 'EL', N),
      ing('Zitrone', 0.5, 'Stück', O),
      ing('Olivenöl', 1, 'EL', P),
    ],
    steps: [
      'Ofen auf 200 °C vorheizen.',
      'Kürbis würfeln und mit den Kichererbsen und Olivenöl auf einem Blech 25 Minuten backen.',
      'Quinoa kochen.',
      'Grünkohl die letzten 8 Minuten mit aufs Blech geben.',
      'Tahini mit Zitronensaft und etwas Wasser verrühren und über alles gießen.',
    ],
  },
  {
    id: 'tofu-ruehrei-ofenkartoffeln',
    name: 'Tofu-Rührei mit Ofenkartoffeln und Spinat',
    ingredients: [
      ing('Tofu natur', 150, 'g', K),
      ing('Kartoffeln', 250, 'g', V),
      ing('Spinat', 80, 'g', V),
      ing('Zwiebel', 0.5, 'Stück', V),
      ing('Hefeflocken', 1, 'EL', P),
      ing('Kurkuma', 1, 'TL', P),
      ing('Olivenöl', 1, 'EL', P),
    ],
    steps: [
      'Kartoffeln in Spalten schneiden und bei 200 °C 30 Minuten im Ofen backen.',
      'Zwiebel würfeln und in Öl anbraten.',
      'Tofu zerbröseln, mit Kurkuma und Hefeflocken zur Zwiebel geben und 5 Minuten braten.',
      'Spinat unterheben, bis er zusammenfällt.',
      'Mit Salz und Pfeffer abschmecken und zu den Kartoffeln servieren.',
    ],
  },
  {
    id: 'bohnen-burritos',
    name: 'Bohnen-Burritos mit Guacamole',
    ingredients: [
      ing('Kidneybohnen (Dose)', 120, 'g', H),
      ing('Mais (Dose)', 50, 'g', V),
      ing('Tortilla', 2, 'Stück', G),
      ing('Avocado', 0.5, 'Stück', O),
      ing('Tomate', 1, 'Stück', V),
      ing('Paprika', 0.5, 'Stück', V),
      ing('Reis', 40, 'g', G),
      ing('Limette', 0.5, 'Stück', O),
      ing('Kreuzkümmel', 1, 'TL', P),
    ],
    steps: [
      'Reis kochen.',
      'Bohnen, Mais und gewürfelte Paprika mit Kreuzkümmel 5 Minuten in der Pfanne erwärmen.',
      'Avocado mit Limettensaft zerdrücken (Guacamole), Tomate würfeln.',
      'Tortillas kurz erwärmen.',
      'Alles auf die Tortillas geben, einrollen und servieren.',
    ],
  },
  {
    id: 'erdnuss-tofu-nudeln',
    name: 'Erdnuss-Tofu-Nudeln mit Gemüse',
    ingredients: [
      ing('Nudeln', 90, 'g', G),
      ing('Tofu natur', 80, 'g', K),
      ing('Erdnussbutter', 2, 'EL', N),
      ing('Karotte', 1, 'Stück', V),
      ing('Paprika', 0.5, 'Stück', V),
      ing('Frühlingszwiebel', 2, 'Stück', V),
      ing('Sojasauce', 1, 'EL', P),
      ing('Limette', 0.5, 'Stück', O),
    ],
    steps: [
      'Nudeln kochen.',
      'Tofu würfeln und knusprig anbraten.',
      'Karotte und Paprika in Streifen schneiden und kurz mitbraten.',
      'Erdnussbutter mit Sojasauce, Limettensaft und etwas warmem Wasser zu einer Sauce verrühren.',
      'Alles mischen und mit Frühlingszwiebeln bestreuen.',
    ],
  },
  {
    id: 'kartoffel-bohnen-auflauf',
    name: 'Kartoffel-Bohnen-Auflauf',
    ingredients: [
      ing('Kartoffeln', 250, 'g', V),
      ing('Weiße Bohnen (Dose)', 120, 'g', H),
      ing('Zucchini', 150, 'g', V),
      ing('Sojasahne', 100, 'ml', K),
      ing('Hefeflocken', 1, 'EL', P),
      ing('Zwiebel', 0.5, 'Stück', V),
      ing('Knoblauch', 1, 'Zehe', V),
    ],
    steps: [
      'Kartoffeln in dünne Scheiben schneiden und 8 Minuten vorkochen.',
      'Zwiebel, Knoblauch und Zucchini würfeln und kurz anbraten.',
      'Alles mit den Bohnen in eine Auflaufform schichten.',
      'Sojasahne mit Hefeflocken, Salz und Pfeffer verrühren und darübergeben.',
      'Bei 200 °C 25 Minuten goldbraun backen.',
    ],
  },
  {
    id: 'weisse-bohnen-eintopf',
    name: 'Weißer-Bohnen-Eintopf mit Grünkohl',
    ingredients: [
      ing('Weiße Bohnen (Dose)', 150, 'g', H),
      ing('Grünkohl', 120, 'g', V),
      ing('Karotte', 1, 'Stück', V),
      ing('Kartoffeln', 100, 'g', V),
      ing('Zwiebel', 0.5, 'Stück', V),
      ing('Gemüsebrühe', 300, 'ml', P),
      ing('Olivenöl', 1, 'EL', P),
    ],
    steps: [
      'Zwiebel, Karotte und Kartoffeln würfeln und in Olivenöl anbraten.',
      'Mit Gemüsebrühe aufgießen und 15 Minuten köcheln lassen.',
      'Bohnen und klein gezupften Grünkohl dazugeben.',
      'Weitere 8 Minuten garen, bis der Grünkohl weich ist.',
      'Mit Salz, Pfeffer und etwas Muskat abschmecken.',
    ],
  },
  {
    id: 'rote-bete-linsen-salat',
    name: 'Rote-Bete-Linsen-Salat mit Orange',
    ingredients: [
      ing('Braune Linsen', 80, 'g', H),
      ing('Rote Bete (gegart)', 150, 'g', V),
      ing('Orange', 1, 'Stück', O),
      ing('Walnüsse', 20, 'g', N),
      ing('Feldsalat', 50, 'g', V),
      ing('Olivenöl', 1, 'EL', P),
      ing('Senf', 1, 'TL', P),
    ],
    steps: [
      'Linsen nach Packungsanleitung kochen und abkühlen lassen.',
      'Rote Bete in Würfel schneiden, Orange filetieren und den Saft auffangen.',
      'Orangensaft mit Olivenöl, Senf, Salz und Pfeffer zum Dressing verrühren.',
      'Linsen, Rote Bete, Orangenfilets und Feldsalat mischen.',
      'Dressing darübergeben und mit gehackten Walnüssen bestreuen.',
    ],
  },
].map((d) => {
  const nutrients = computeNutrients(d.ingredients)
  return { ...d, nutrients, image: `/images/${d.id}.jpg`, ...classify(nutrients) }
})

export const getDish = (id) => DISHES.find((d) => d.id === id)
