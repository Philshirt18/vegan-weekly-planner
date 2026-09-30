---
doc: spec
status: approved
---

# Veganer Nährstoff-Wochenplaner (Arbeitstitel) — Technical Spec

## How This Works, In Plain Language
Die App ist eine **Web-App**: eine Webseite, die sich im Browser wie eine App verhält und auf Computer und Handy funktioniert. Sie besteht aus vier Teilen:

1. **Die Oberfläche** (gebaut mit React): alle Bildschirme aus dem PRD, also Willkommen, Anmeldung, Familienprofil, Gerichteübersicht, Detailansicht, Wochenplan und Einkaufsliste.
2. **Die Gerichtedaten:** die 17 Gerichte liegen fest als Datei in der App (Name, Bild, Nährstoffe, Zutaten, Anleitung). Sie ändern sich in der Demo nicht.
3. **Die Rechenlogik:** kleine Regeln in der App, die (a) aus Familie und Gewicht die Richtwerte bestimmen, (b) die Gerichte auf die Woche verteilen und Kalzium-Konflikte erkennen und (c) die Einkaufsliste berechnen (Mengen umrechnen, gleiche Zutaten addieren).
4. **Firebase** (ein Online-Dienst von Google): erledigt die **Anmeldung** mit E-Mail und Passwort und speichert deine persönlichen Daten in einer **Datenbank**: Familie, gewählte Gerichte, Wochenplan und Abgehaktes. Deshalb siehst du auf Handy und Computer dasselbe.

**Vercel** stellt die fertige App unter einem Link ins Internet. Die Datenbank ist ein Online-Tabellenblatt, in das die App schreibt und aus dem sie liest. Pro Person gibt es genau einen Eintrag.
Warum so: Ein Login und eine Datenbank sind mehr Aufwand als ein Klebezettel im Browser, aber du wolltest dieselben Daten auf beiden Geräten. Damit es klein bleibt, liegen die Gerichte fest in der App statt in der Datenbank, und es gibt nur eine Anmeldeart.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. **Willkommen:** Die App lädt von Vercel. Die Oberfläche zeigt den kurzen Text. *(Nur die Oberfläche.)*
2. **Anmelden / Registrieren:** Du gibst E-Mail und Passwort ein → das geht an Firebase Authentication → Firebase antwortet mit deiner Nutzer-ID → die App merkt sich, dass du angemeldet bist.
3. **Familienprofil:** Du trägst Personen ein → beim Speichern schreibt die App sie in deinen Datenbankeintrag in Firestore. Die Richtwerte werden in der App aus Alter, Geschlecht, Gewicht und Schwangerschaft/Stillzeit berechnet.
4. **Gerichteübersicht und Detailansicht:** Die Gerichte kommen aus der festen Datei. Wenn du "Diese Woche essen" an- oder abwählst, speichert die App die Auswahl in deinem Datenbankeintrag.
5. **Tage wählen und verteilen:** Bei weniger als 14 Gerichten wählst du Tage. Die Rechenlogik verteilt die Gerichte auf die Plätze und prüft, ob an einem Tag zwei kalziumreiche Gerichte zusammenkommen (→ Warnung). Die Verteilung wird gespeichert.
6. **Drag und Drop:** Verschieben ändert die Verteilung → neue Prüfung auf Warnungen → speichern.
7. **Fertig → Einkaufsliste:** Die Rechenlogik nimmt alle Gerichte des Plans, rechnet die Mengen mit den Portionen der Familie (Erwachsener 1, Kind bis 12 Jahre 0,5) um, addiert gleiche Zutaten und sortiert nach Kategorie.
8. **Abhaken und finale Liste:** Abgehakte Zutaten werden gespeichert; die finale Liste zeigt den Rest.
9. **Wiederkehr:** Beim nächsten Öffnen meldest du dich an (oder bist noch angemeldet), die App liest deinen Eintrag aus Firestore und zeigt Familie, Plan und Liste wieder.

## Stack
> **Nicht online geprüft.** Die genauen Versionen und aktuellen Preise habe ich in dieser Planung nicht nachgeschlagen. Sie werden am Anfang des Baus geprüft (siehe Decisions and Open Issues).

- **React** mit **Vite** (JavaScript), Oberfläche und Build-Werkzeug — [react.dev](https://react.dev), [vite.dev/guide](https://vite.dev/guide/). *Gewählt (von dir zugestimmt):* einfach, schnell, direkt auf Vercel veröffentlichbar. *Tradeoff:* mehr Aufbau als eine einzelne HTML-Datei.
- **React Router** für die Bildschirme — [reactrouter.com](https://reactrouter.com).
- **Firebase Authentication** (nur E-Mail und Passwort) — [firebase.google.com/docs/auth/web/password-auth](https://firebase.google.com/docs/auth/web/password-auth). *Gewählt:* einfachste Anmeldeart. *Tradeoff:* kein "Passwort vergessen" in der Demo.
- **Cloud Firestore** als Datenbank — [firebase.google.com/docs/firestore](https://firebase.google.com/docs/firestore).
- **dnd kit** für Drag und Drop mit Maus und Touch — [dndkit.com](https://dndkit.com).
- **Vercel** für die Veröffentlichung — [vercel.com/docs](https://vercel.com/docs).
- **Normales CSS** (mit Variablen für die Farben), keine zusätzliche Styling-Bibliothek.

## Where It Runs and How Someone Tries It
- **Läuft:** im Browser (Computer und Handy).
- **Lokal starten:** `npm install`, dann `npm run dev`, dann im Browser die angezeigte Adresse öffnen (üblich: `http://localhost:5173`).
- **Firebase einrichten (einmalig, von dir im Browser):** ein Firebase-Projekt anlegen, Authentication mit E-Mail/Passwort aktivieren, Firestore anlegen, die Sicherheitsregeln aus diesem Dokument einfügen, eine Web-App registrieren. Die Zugangswerte kommen in die Datei `.env.local` (nicht ins Repository, nicht in den Chat). Eine Vorlage `.env.example` ohne echte Werte liegt im Repository.
- **Veröffentlichen:** GitHub-Repository mit Vercel verbinden, die Werte aus `.env.local` in den Vercel-Einstellungen als Umgebungsvariablen eintragen, die Vercel-Adresse in Firebase Authentication unter "Autorisierte Domains" hinzufügen.
- **Für die Abgabe:** Pflicht sind das kurze Demo-Video und das öffentliche GitHub-Repository (mit `scope.md`, `prd.md`, `spec.md`). Der Vercel-Link ist zusätzlich.
- **Aufnahme:** Aufnahme mit dem Testkonto, das den ganzen Ablauf zeigt (Profil, 14 Gerichte, Drag und Drop, Warnung, Einkaufsliste).

## Look and Feel
PRD ref: `prd.md > Look and Feel`.
- **Farben:** weiche, matte Pastelltöne. Hintergrund helles Beige, Akzente in sanftem Salbeigrün, Text und Rahmen in warmem, gedämpftem Braun. Keine grellen Farben.
- **Schrift:** eine runde, gut lesbare Schrift, die nicht streng wirkt (Vorschlag: Nunito über Google Fonts).
- **Formen:** runde Buttons, abgerundete Karten, großzügige Abstände.
- **Stimmung:** ruhig und familienfreundlich; kurze, freundliche Texte auf Deutsch.
- **Handy zuerst:** einspaltiges Layout auf dem Handy, das Gerichteraster wird auf dem Computer breiter.
- **Warnungen** sind sanft (zum Beispiel warmes Gelb), nicht alarmierend rot.

## Components

### Willkommen und Anmeldung
Kurzer Text, danach Registrierung oder Anmeldung. Fehler (falsches Passwort, E-Mail schon vergeben) werden verständlich angezeigt.
PRD ref: `prd.md > The Core Journey` (Schritte 1–2). Anmeldung ist neu gegenüber dem PRD; siehe Decisions and Open Issues.

### Familienprofil
Formular und Liste für Personen (Name, Geschlecht, Alter, Gewicht, Schwangerschaft/Stillzeit), Hinweis "keine medizinische Beratung". Berechnet Richtwerte über die Nährstofflogik.
PRD ref: `prd.md > Familienprofil`.

### Gerichteübersicht und Detailansicht
Raster mit Karten für 17 Gerichte (Foto, Name, Knopf "Diese Woche essen", Knopf "Mehr Details"), Markierung der gewählten Gerichte, Button "Weiteres Gericht hinzufügen" ohne Funktion. Detailansicht: Foto und Name, Nährstoffe, Zutaten, Anleitung, Schalter "Diese Woche essen". Fehlt ein Bild, erscheint ein sanfter Platzhalter.
PRD ref: `prd.md > Gerichte auswählen`.

### Tage-Auswahl und Wochenplan
Tage anklicken, wenn weniger als 14 Gerichte gewählt sind. Hinweis bei nicht passender Anzahl. Verteilung der Gerichte auf Mittag und Abend, Drag und Drop, Warnung bei zwei kalziumreichen Gerichten am selben Tag (wegklickbar). Hinweis, wenn kein Gericht gewählt ist.
PRD ref: `prd.md > Wochenplan`, `prd.md > States and Boundaries`.

### Einkaufsliste
Vorschau mit Kategorien, Zutaten und Mengen, Abhaken, finale Liste. Leerzustand, wenn alles abgehakt ist.
PRD ref: `prd.md > Einkaufsliste`.

### Rechenlogik
Drei kleine Dateien ohne Oberfläche:
- **Nährstoffe:** Richtwerte für Protein (nach Gewicht), Kalzium und Eisen je nach Alter, Geschlecht, Schwangerschaft/Stillzeit.
- **Verteilung und Warnung:** ordnet gewählte Gerichte den Plätzen zu und findet Tage mit zwei kalziumreichen Gerichten.
- **Einkaufsliste:** rechnet Mengen pro Portion mit den Familienportionen um, addiert gleiche Zutaten gleicher Einheit, gruppiert nach Kategorie.
PRD ref: `prd.md > Familienprofil`, `prd.md > Wochenplan`, `prd.md > Einkaufsliste`.

### Anbindung an Firebase
Anmelden, Abmelden, Daten lesen und schreiben. Sonst kennt keine andere Datei Firebase.
PRD ref: `prd.md > States and Boundaries` (Wiederkehr).

## Data Model
**Feste Daten (in der App, ändern sich nicht):** Liste der 17 Gerichte. Pro Gericht:
- `id`, `name`, `image` (Pfad),
- `nutrients` (Protein, Kalzium, Eisen als Schätzwerte je Portion, Vitamin C als Hinweis),
- `calciumRich` (ja/nein), `ironRich` (ja/nein),
- `ingredients`: Liste mit `name`, `amount` (pro Erwachsenenportion), `unit`, `category`,
- `steps`: Anleitung.

**Persönliche Daten (Firestore):** ein Eintrag pro Nutzer:in, `users/{Nutzer-ID}`:
- `members`: Liste mit `name`, `sex`, `age`, `weightKg`, `pregnantOrBreastfeeding`,
- `selectedDishIds`: gewählte Gerichte,
- `days`: gewählte Wochentage,
- `plan`: für jeden Tag `lunch` und `dinner` mit einer Gericht-ID,
- `checkedIngredients`: abgehakte Zutaten.

**Wo es lebt, wie es sich ändert, was bei Rückkehr passiert:**
- Feste Gerichte: in der App, ändern sich nur mit einer neuen Version.
- Persönliche Daten: in Firestore, die App schreibt bei jeder Änderung. Beim nächsten Öffnen werden sie gelesen und alles ist wieder da. Das Handy sieht Änderungen vom Computer nach dem Neuladen der Seite (kein Live-Abgleich).
- Portionen: Person ab 13 Jahren zählt 1, bis 12 Jahre 0,5. Das ist fest in der Rechenlogik.

**Sicherheitsregel für Firestore:** Jede angemeldete Person darf nur ihren eigenen Eintrag lesen und schreiben (`request.auth.uid == userId`).

## File Structure
```
project/
├── src/
│   ├── main.jsx                 # Startpunkt der App
│   ├── App.jsx                  # Bildschirme und Wege dazwischen
│   ├── pages/
│   │   ├── Welcome.jsx          # Willkommen
│   │   ├── Login.jsx            # Anmelden / Registrieren
│   │   ├── Profile.jsx          # Familienprofil
│   │   ├── Dishes.jsx           # Gerichteübersicht
│   │   ├── DishDetail.jsx       # Detailansicht
│   │   ├── PlanDays.jsx         # Tage wählen / Hinweis zur Anzahl
│   │   ├── WeekPlan.jsx         # Wochenplan mit Drag und Drop
│   │   └── Shopping.jsx         # Vorschau, Abhaken, finale Liste
│   ├── components/              # Wiederverwendete Teile (Karten, Warnung, Buttons)
│   ├── data/
│   │   └── dishes.js            # 17 Gerichte (fest)
│   ├── lib/
│   │   ├── nutrition.js         # Richtwerte pro Person
│   │   ├── planner.js           # Verteilung und Kalzium-Warnung
│   │   ├── shopping.js          # Mengen umrechnen, addieren, Kategorien
│   │   └── firebase.js          # Anmeldung, Lesen und Schreiben
│   └── styles/
│       └── theme.css            # Farben, Schrift, runde Formen
├── public/
│   └── images/                  # Bilder der Gerichte (von dir erstellt)
├── devpost/                     # Devpost-Lernordner (Planungsdokumente)
├── .env.example                 # Vorlage ohne echte Werte
├── .gitignore
├── vercel.json                  # damit alle Seiten der App über Vercel laden
├── package.json
└── README.md
```

## External Services and Dependencies
- **Firebase Authentication (E-Mail/Passwort):** Registrieren, Anmelden, Abmelden über das Firebase-Web-Paket. Zugangswerte in `.env.local`. [Doku](https://firebase.google.com/docs/auth/web/password-auth).
- **Cloud Firestore:** Lesen und Schreiben des Eintrags `users/{uid}`. [Doku](https://firebase.google.com/docs/firestore).
- **Vercel:** Veröffentlichung aus GitHub, Umgebungsvariablen in den Projekteinstellungen. [Doku](https://vercel.com/docs).
- **Google Fonts** (Nunito): Schrift. [fonts.google.com](https://fonts.google.com).
- **Kosten und Grenzen:** Ich gehe davon aus, dass die kostenlosen Stufen von Firebase und Vercel für die Demo reichen. Das ist nicht geprüft und wird am Anfang des Baus kontrolliert.

## Important Failure Modes
- **Firebase nicht erreichbar oder falsch eingerichtet** → klare Meldung ("Die Daten konnten nicht geladen werden") statt leerer Seite; für die Aufnahme ist ein fertig eingerichtetes Testkonto nötig.
- **Bild eines Gerichts fehlt** → sanfter Platzhalter mit dem Namen des Gerichts.
- **Anmeldung schlägt fehl** (falsches Passwort, E-Mail schon vergeben) → verständliche Meldung auf dem Anmeldebildschirm.
- **Drag und Drop auf dem Handy funktioniert nicht sauber** → ergänzend lässt sich ein Gericht per Antippen und Auswählen verschieben (nur falls der Test es nötig macht).

## What Was Simplified and Why
- **Feste Gerichte in der App** statt in der Datenbank — weniger Aufbau; Gerichte hinzufügen steht unter "Später". Die Datenbank hält nur persönliche Daten.
- **Nur E-Mail und Passwort** statt weiterer Anmeldearten oder "Passwort vergessen" — einfachste Anmeldung.
- **Ein Eintrag pro Nutzer:in** statt mehrerer Tabellen — reicht für die Demo.
- **Neuladen statt Live-Abgleich** zwischen den Geräten — kein Echtzeit-Aufwand.
- **Feste Portionsregel** (Erwachsener 1, Kind bis 12 Jahre 0,5) statt Berechnung aus Alter und Gewicht.
- **Geschätzte Nährstoffwerte pro Gericht**, als "ungefähr" gekennzeichnet — der Kern (Warnung, Verteilung, Einkaufsliste) bleibt echt. Die Nährstoffwerte sind Beispieldaten, keine geprüften Werte.
- **Bilder von dir** erstellt, bis dahin Platzhalter.

## Decisions and Open Issues
**Entscheidungen (von dir):**
- Web-App auf Computer und Handy, veröffentlicht über Vercel (dein Wunsch, weil du sie selbst nutzen willst).
- Login und Datenbank über Firebase, damit Handy und Computer dasselbe zeigen. *Tradeoff:* mehr Aufwand und mehr Fehlerquellen als der Speicher im Browser.
- Empfehlung angenommen: React mit Vite, nur E-Mail/Passwort, nur persönliche Daten in der Datenbank, Drag und Drop über eine Bibliothek.
- Bilder werden KI-generiert und von dir geliefert; die App zeigt bis dahin Platzhalter.
- Kinder bis 12 Jahre zählen als halbe Portion, fest eingestellt.
- Nährstoffe: Richtwerte pro Person angelehnt an D-A-CH-Referenzwerte, Nährwerte pro Gericht als grobe Schätzung, von dir geprüft.

**Aus der Umsetzung abgeleitet (Details, keine neuen Produktentscheidungen):** Aufbau der Dateien, Datenformat in Firestore, Sicherheitsregel, Schrift Nunito.

**Dein Lernwunsch** ("verstehen, wo ich die wichtigsten Entscheidungen treffen kann"): Die Entscheidungen oben mit ihrem jeweiligen Tradeoff sind die Antwort im Kleinen. Die größte war der Login mit Datenbank statt des Browser-Speichers. Im Bau halten wir bei jedem Schritt kurz fest, welche Entscheidung dahinter lag.

**Offene Unsicherheit:** Eine konkrete Unsicherheit hast du nicht genannt; es wurde keine erfunden.

**Noch offen (früh im Bau prüfen):**
- Aktuelle Versionen der Pakete und ob die kostenlosen Stufen von Firebase und Vercel reichen.
- Genaue Richtwerte aus der D-A-CH-Quelle prüfen und die Nährwerte der 17 Gerichte gegenlesen.
- Ob Drag und Drop auf dem Handy sauber funktioniert.
- Änderung gegenüber dem PRD: Die Anmeldung ist jetzt Teil der Demo. `prd.md > Open Questions` (Login) ist damit entschieden.
- Zwei kalziumreiche Gerichte am selben Tag lösen eine Warnung aus; zwei eisenreiche nicht (wie im PRD festgehalten).
