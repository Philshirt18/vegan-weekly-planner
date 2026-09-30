// Nährwerte je Zutat, pro 100 g (bzw. 100 ml). Grundlage für die berechneten Nährwerte der Gerichte.
//
// WICHTIG: Das sind typische Näherungswerte für ROHE Zutaten, aus dem Wissen des Entwicklers
// (orientiert an USDA/BLS-Werten), nicht aus einer abgerufenen Datenbank. Sie sind eine Orientierung.
// Werte, die stark schwanken:
//  - Tofu: Kalzium hängt vom Gerinnungsmittel ab (mit Kalziumsulfat ca. 350–700 mg, mit Nigari
//    ca. 100–200 mg pro 100 g). Ohne Angabe auf der Packung nehmen wir den Mittelwert 200 mg an.
//  - Vitamin C geht beim Kochen teilweise verloren (siehe VITAMIN_C_RETENTION in lib/dishNutrients.js).
//
// unitGrams: Gewicht einer Einheit in Gramm (für Stück, Zehe, Scheibe, EL, TL).
// Für g und ml wird die Menge direkt als Gramm gerechnet.

const n = (protein, calcium, iron, vitaminC, unitGrams = {}) => ({ protein, calcium, iron, vitaminC, unitGrams })

export const INGREDIENTS = {
  'Avocado': n(2, 12, 0.6, 10, { Stück: 150 }),
  'Basilikum': n(3.2, 177, 3.2, 18),
  'Braune Linsen': n(24, 56, 7.5, 4),
  'Brokkoli': n(2.8, 47, 0.7, 89),
  'Cashews': n(18, 37, 6.7, 0.5),
  'Currypulver': n(14, 478, 19, 1, { TL: 2 }),
  'Erbsen (TK)': n(5.2, 25, 1.5, 14),
  'Erdnussbutter': n(25, 49, 1.7, 0, { EL: 16 }),
  'Feldsalat': n(2, 35, 2.0, 35),
  'Fladenbrot': n(9, 90, 2.5, 0, { Stück: 100 }),
  'Frühlingszwiebel': n(1.8, 72, 1.5, 19, { Stück: 15 }),
  'Gemüsebrühe': n(0, 0, 0, 0),
  'Grünkohl': n(4.3, 150, 1.6, 93),
  'Gurke': n(0.7, 16, 0.3, 3, { Stück: 300 }),
  'Hefeflocken': n(50, 40, 4, 0, { EL: 5 }),
  'Karotte': n(0.9, 33, 0.3, 6, { Stück: 80 }),
  'Kartoffeln': n(2, 10, 0.8, 15),
  'Kichererbsen (Dose)': n(7, 45, 2.2, 1.3),
  'Kidneybohnen (Dose)': n(6.8, 40, 2.2, 0.5),
  'Knoblauch': n(6.4, 181, 1.7, 31, { Zehe: 3 }),
  'Kokosmilch': n(2.3, 16, 1.6, 2),
  'Kreuzkümmel': n(18, 931, 66, 8, { TL: 2 }),
  'Kurkuma': n(8, 168, 55, 1, { TL: 3 }),
  'Kürbis': n(1, 21, 0.8, 9),
  'Limette': n(0.7, 33, 0.6, 29, { Stück: 60 }),
  'Mais (Dose)': n(2.5, 5, 0.6, 5),
  'Nudeln': n(13, 21, 2.5, 0),
  'Olivenöl': n(0, 0, 0, 0, { EL: 13 }),
  'Öl': n(0, 0, 0, 0, { EL: 13 }),
  'Orange': n(0.9, 40, 0.1, 53, { Stück: 130 }),
  'Paprika': n(1, 7, 0.4, 120, { Stück: 150 }),
  'Paprikapulver': n(14, 229, 21, 1, { TL: 2.5 }),
  'Petersilie': n(3, 138, 6.2, 133),
  'Quinoa': n(14, 47, 4.6, 0),
  'Reis': n(7, 10, 1.0, 0),
  'Rote Bete (gegart)': n(1.7, 16, 0.8, 4),
  'Rote Linsen': n(24, 35, 7.5, 4),
  'Schwarze Bohnen (Dose)': n(7, 35, 2.1, 0),
  'Sellerie': n(1.5, 43, 0.7, 8),
  'Senf': n(4, 80, 1.5, 0, { TL: 5 }),
  'Sesam': n(18, 975, 14.6, 0, { TL: 3 }),
  'Sojasahne': n(1.5, 15, 0.3, 0),
  'Sojasauce': n(8, 17, 2.4, 0, { EL: 16 }),
  'Spinat': n(2.9, 99, 2.7, 28),
  'Süßkartoffel': n(1.6, 30, 0.6, 10),
  'Tahini': n(17, 426, 8.9, 0, { EL: 15 }),
  'Tempeh': n(19, 111, 2.7, 0),
  'Tofu natur': n(8, 200, 2.7, 0),
  'Tomate': n(0.9, 10, 0.3, 14, { Stück: 120 }),
  'Tomaten (Dose)': n(1.0, 30, 1.0, 9),
  'Tortilla': n(8, 100, 3, 0, { Stück: 60 }),
  'Vollkornbrot': n(8, 60, 2.5, 0, { Scheibe: 45 }),
  'Vollkornspaghetti': n(13.5, 40, 3.6, 0),
  'Walnüsse': n(15, 98, 2.9, 1.3),
  'Weiße Bohnen (Dose)': n(7, 65, 2.4, 0),
  'Zitrone': n(1.1, 26, 0.6, 50, { Stück: 60 }),
  'Zucchini': n(1.2, 16, 0.4, 18),
  'Zwiebel': n(1.1, 23, 0.2, 7, { Stück: 110 }),
}
