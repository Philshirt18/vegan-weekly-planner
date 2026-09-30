# Veganer Nährstoff-Wochenplaner

**English summary:** A weekly meal planner for vegan families. Pick from 17 vegan dishes (with nutrients computed from
their ingredients), let the app spread them over lunch and dinner, get a note about iron absorption when two
calcium-rich dishes land on the same day, drag dishes to swap them, and get a shopping list scaled to your family.
Built with React, Vite and Firebase (login + database), hosted on Vercel. Nutrition values are approximate guidelines,
not medical advice. This project was planned with the Devpost Learn skills; see `devpost/scope.md`, `devpost/prd.md`
and `devpost/spec.md`.

Eine Web-App, die einer veganen Familie die Woche plant – mit Rezepten, einer Warnung zur Eisenaufnahme und einer
Einkaufsliste, die auf die Familie umgerechnet ist.

> **Hinweis:** Alle Nährwerte sind Näherungswerte und Richtwerte zur Orientierung. Sie sind **keine medizinische Beratung**.

## Was die App kann

1. Anmelden (E-Mail und Passwort) und die Familie anlegen (Name, Geschlecht, Alter, Gewicht, Schwangerschaft/Stillzeit).
   Daraus entstehen Tagesrichtwerte für Protein, Kalzium und Eisen (nach den DGE-Referenzwerten).
2. Aus 17 veganen Gerichten (Foto, Nährstoffe, Zutaten, Anleitung mit Portionswahl) bis zu 14 für die Woche wählen.
3. Die App verteilt die Gerichte auf Mittag- und Abendessen der gewählten Tage. Sind an einem Tag beide Gerichte
   kalziumreich, gibt es einen Hinweis zur Eisenaufnahme.
4. Gerichte per Drag und Drop tauschen.
5. Einkaufsliste: für die Familie umgerechnet (Kinder bis 12 Jahre zählen als halbe Portion), gleiche Zutaten
   zusammengezählt, nach Kategorien sortiert. Abhaken, was schon da ist.

Familie, Auswahl, Plan und Abgehaktes werden in Firebase gespeichert und sind auf Handy und Computer dieselben.

## Selbst starten

Voraussetzungen: Node.js und ein eigenes Firebase-Projekt.

```bash
npm install
cp .env.example .env.local   # dann die Firebase-Werte eintragen
npm run dev                  # danach http://localhost:5173 öffnen
```

Tests und Build:

```bash
npm test
npm run build
```

### Firebase einrichten

1. Auf [console.firebase.google.com](https://console.firebase.google.com) ein Projekt anlegen.
2. Eine **Web-App** registrieren (ohne Firebase Hosting). Die sechs Werte aus `firebaseConfig` in `.env.local` eintragen
   (Namen siehe `.env.example`).
3. **Authentication** → Anmeldemethode **E-Mail/Passwort** aktivieren.
4. **Firestore Database** anlegen (Produktionsmodus) und die Regeln aus [`firestore.rules`](firestore.rules) einfügen.
   Sie erlauben jeder angemeldeten Person nur ihren eigenen Eintrag.

Die Zugangswerte gehören **nur** in `.env.local` (wird nicht committet) und in die Vercel-Einstellungen, nie in den Code.

### Veröffentlichen mit Vercel

1. Das Repository mit [Vercel](https://vercel.com) verbinden (Framework: Vite, Build `npm run build`, Ausgabe `dist`).
2. In den Vercel-Projekteinstellungen unter **Environment Variables** die sechs `VITE_FIREBASE_…`-Werte eintragen.
3. In Firebase unter **Authentication → Einstellungen → Autorisierte Domains** die Vercel-Adresse hinzufügen.

## Aufbau

```
src/
  pages/        Bildschirme (Willkommen, Anmeldung, Profil, Gerichte, Detail, Tage, Wochenplan, Einkauf)
  components/   Wiederverwendete Teile
  data/         17 Gerichte und die Nährwerte je Zutat (Näherungswerte)
  lib/          Rechenlogik: Richtwerte, Nährwerte, Wochenplan, Einkaufsliste, Rezeptmengen, Firebase
  styles/       Look (Farben, Schrift, runde Formen)
tests/          Tests der Rechenlogik
devpost/        Planungsdokumente (scope, prd, spec) und Build-Checkliste
```

## Bekannte Grenzen

- Die Nährwerte pro Zutat sind typische Näherungswerte für rohe Zutaten, keine geprüfte Datenbank.
  Beim Tofu ist ohne Angabe auf der Packung ein Kalziumwert von 200 mg pro 100 g angenommen.
- Bilder der Gerichte: Solange keine Bilder in `public/images/` liegen (`<gericht-id>.jpg`), zeigt die App Platzhalter.
- Gerichte selbst hinzufügen oder bearbeiten, andere Ernährungsformen und weitere Nährstoffe (zum Beispiel Vitamin B12)
  sind nicht Teil dieser Demo.
