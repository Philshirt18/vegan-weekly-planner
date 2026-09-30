---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Du siehst die App und kannst Gerichte ansehen und für die Woche wählen**
  Becomes usable: Eine laufende App im ruhigen Pastell-Look mit Willkommensscreen, der Übersicht der 17 Gerichte (Foto-Platzhalter und Name), der Detailansicht (Nährstoffe, Zutaten, Anleitung) und dem Schalter "Diese Woche essen". Die Auswahl gilt nur, solange die Seite offen ist.
  Why now: Trägt den Kern (die 17 vorab abgestimmten Gerichte) schon im ersten Schritt und liefert das Gerüst, in das alles andere hineinkommt. Die Gerichtedaten sind außerdem die Grundlage für Warnung und Einkaufsliste.
  PRD ref: `prd.md > The Core Journey` (Schritte 1, 3, 4), `prd.md > Gerichte auswählen`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Stack`, `spec.md > Look and Feel`, `spec.md > Components > Gerichteübersicht und Detailansicht`, `spec.md > Data Model`, `spec.md > File Structure`
  Build: Vite/React-Projekt aufsetzen, Theme (Farben, Nunito, runde Formen), Willkommen, `src/data/dishes.js` mit 17 veganen Gerichten (Zutaten mit Kategorien, Schätzwerte, Anleitung, `calciumRich`/`ironRich`), Übersicht, Detailansicht, Platzhalter für fehlende Bilder, Button "Weiteres Gericht hinzufügen" ohne Funktion. Paketversionen mit `npm view` prüfen.
  Verify (mechanical): `npm run build` läuft ohne Fehler; Dev-Server startet; ein kleiner Test/Skript bestätigt 17 Gerichte mit Name, Zutaten, Anleitung und Nährstoffen; Seiten laden ohne Fehler in der Konsole.
  Learner check: App öffnen, ein Gericht anklicken, Nährstoffe/Zutaten/Anleitung ansehen, "Diese Woche essen" an- und abwählen. Sieht es so aus, wie du es dir vorgestellt hast? Sind die Gerichte und ihre Nährwerte plausibel?
  Commit: `Add app shell, look and feel, and 17 dishes with detail view`

- [x] **2. Du kannst dich anmelden und deine Familie wird gespeichert**
  Becomes usable: Registrieren und Anmelden mit E-Mail und Passwort, Familienprofil mit Richtwerten (Name, Geschlecht, Alter, Gewicht, Schwangerschaft/Stillzeit), Hinweis "keine medizinische Beratung". Profil und gewählte Gerichte sind nach Neuladen und auf einem anderen Gerät wieder da.
  Why now: Firebase ist das größte Risiko (Konto, Zugangswerte, Sicherheitsregeln). Es kommt früh, damit Überraschungen früh auffallen, und liefert das Speichern für alles Folgende.
  PRD ref: `prd.md > Familienprofil`, `prd.md > The Core Journey` (Schritte 2, 9), `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components > Willkommen und Anmeldung`, `spec.md > Components > Familienprofil`, `spec.md > Components > Anbindung an Firebase`, `spec.md > Components > Rechenlogik`, `spec.md > Data Model`, `spec.md > External Services and Dependencies`
  Build: Du richtest das Firebase-Projekt ein (ich führe dich Schritt für Schritt; die Zugangswerte legst du selbst in `.env.local` ab). Ich baue `firebase.js`, Login, Profil und `nutrition.js` (Richtwerte, mit geprüfter Quelle) und speichere `members` und `selectedDishIds` in `users/{uid}`. Sicherheitsregel: nur der eigene Eintrag.
  Verify (mechanical): Tests für `nutrition.js` (Protein nach Gewicht, Kind, Schwangerschaft); `npm run build` läuft; die Firestore-Regeln enthalten die Eigentümer-Prüfung; ein Test-Login schreibt und liest einen Eintrag.
  Learner check: Mit E-Mail und Passwort registrieren, Familie eintragen (drei Personen mit einem Kind), Gerichte wählen, Seite neu laden und dich wieder anmelden. Alles sollte wieder da sein. Danach am Handy anmelden und dasselbe sehen.
  Commit: `Add Firebase login, family profile, and saved selection`

- [ ] **3. Du bekommst einen Wochenplan mit Kalzium-Warnung**
  Becomes usable: Bei weniger als 14 Gerichten wählst du die Tage, bei nicht passender Anzahl kommt ein Hinweis, die App verteilt die Gerichte auf Mittag und Abend, und an Tagen mit zwei kalziumreichen Gerichten erscheint eine wegklickbare Warnung. Bei null Gerichten kommt ein Hinweis. Der Plan wird gespeichert.
  Why now: Das ist der zweite Teil des Kerns (nährstoffbewusste Verteilung). Er baut auf den Gerichten aus Schritt 1 und dem Speichern aus Schritt 2 auf.
  PRD ref: `prd.md > Wochenplan`, `prd.md > The Core Journey` (Schritte 5, 6), `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components > Tage-Auswahl und Wochenplan`, `spec.md > Components > Rechenlogik`, `spec.md > Data Model`
  Build: `planner.js` (Plätze aus den Tagen, Verteilung, Erkennung von Tagen mit zwei kalziumreichen Gerichten, Anzahl-Prüfung), Seiten `PlanDays` und `WeekPlan`, Speichern von `days` und `plan`.
  Verify (mechanical): Tests für `planner.js` (14 von 14, 8 von 10 Plätzen, ungerade Anzahl, Warnung bei zwei kalziumreichen Gerichten, keine Warnung sonst); `npm run build` läuft.
  Learner check: 14 Gerichte wählen und den Plan ansehen. Dann nur 9 wählen: Tage-Auswahl und Hinweis prüfen. Zwei kalziumreiche Gerichte an einen Tag legen: Kommt die Warnung, und lässt sie sich wegklicken?
  Commit: `Add week planner with calcium warning`

- [ ] **4. Du kannst Gerichte im Plan per Drag und Drop verschieben**
  Becomes usable: Gerichte lassen sich mit Maus und am Handy per Touch zwischen den Plätzen verschieben. Warnungen aktualisieren sich sofort, und die Änderung wird gespeichert.
  Why now: Drag und Drop ist das technisch heikelste Bedienelement (Touch). Es steht direkt nach dem Plan, damit ein Problem früh auffällt.
  PRD ref: `prd.md > Wochenplan`, `prd.md > The Core Journey` (Schritt 6)
  Spec ref: `spec.md > Components > Tage-Auswahl und Wochenplan`, `spec.md > Important Failure Modes`
  Build: dnd kit in `WeekPlan` einbinden, Tauschen von Gerichten zwischen Plätzen, Neuprüfung der Warnungen, Speichern. Falls Touch nicht sauber geht: Verschieben per Antippen und Auswählen als Ersatz.
  Verify (mechanical): Test für die Tauschfunktion in `planner.js`; `npm run build` läuft; Seite lädt ohne Konsolenfehler.
  Learner check: Ein Gericht am Computer ziehen und ablegen, dann am Handy. Ändert sich die Warnung mit? Bleibt die Änderung nach dem Neuladen?
  Commit: `Add drag and drop for the week plan`

- [ ] **5. Du klickst auf "Fertig" und bekommst deine Einkaufsliste**
  Becomes usable: Vorschau der Einkaufsliste mit allen Zutaten des Plans, für die Familie umgerechnet (Erwachsener 1, Kind bis 12 Jahre 0,5), gleiche Zutaten addiert, nach Kategorien sortiert. Du hakst ab, was du schon hast, und siehst die finale Liste. Abgehaktes wird gespeichert.
  Why now: Das ist der dritte Teil des Kerns und der Schlusspunkt des Ablaufs im PRD. Er braucht Plan und Profil.
  PRD ref: `prd.md > Einkaufsliste`, `prd.md > The Core Journey` (Schritte 7, 8), `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components > Einkaufsliste`, `spec.md > Components > Rechenlogik`, `spec.md > Data Model`
  Build: `shopping.js` (Portionen, Umrechnung, Addition gleicher Zutaten und Einheiten, Kategorien), Seite `Shopping` mit Vorschau, Abhaken und finaler Liste, Speichern von `checkedIngredients`, Leerzustand.
  Verify (mechanical): Tests für `shopping.js` (Umrechnung, gleiche Zutat in zwei Gerichten addiert, halbe Portion fürs Kind, Kategorien, abgehakte Zutaten fehlen in der finalen Liste); `npm run build` läuft.
  Learner check: Plan mit "Fertig" abschließen, die Vorschau prüfen (stimmen die Mengen ungefähr?), einiges abhaken und die finale Liste ansehen. Stimmen die Kategorien?
  Commit: `Add shopping list with scaled quantities`

- [ ] **6. Die App ist unter einem Link erreichbar und dokumentiert**
  Becomes usable: Die App läuft auf Vercel unter einem Link, funktioniert am Handy und am Computer, und die README beschreibt Start und Einrichtung.
  Why now: Letzter technischer Schritt, weil alles davor lokal prüfbar sein soll. Er zeigt, ob Login und Datenbank auch online funktionieren.
  PRD ref: `prd.md > The Core Journey` (Schritt 9)
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > External Services and Dependencies`
  Build: `vercel.json` für die Seitenrouten, README (Start, Firebase-Einrichtung, Veröffentlichung, Hinweis auf keine medizinische Beratung), `.env.example`. Du verbindest das GitHub-Repository mit Vercel und trägst die Umgebungsvariablen ein und die Vercel-Adresse in Firebase als autorisierte Domain. Ich führe dich dabei.
  Verify (mechanical): `npm run build` läuft; der Vercel-Link lädt; Anmeldung und Speichern funktionieren online; keine Zugangswerte im Repository (Suche nach `.env` und Schlüsselwerten).
  Learner check: Den Vercel-Link am Handy öffnen, anmelden und den ganzen Ablauf bis zur Einkaufsliste durchspielen.
  Commit: `Add Vercel config and README`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — nach Schritt 3 (Wochenplan mit Warnung): Der Kern ist sichtbar und du kannst noch Richtung ändern.
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: —
Route and stops: —
Edit outcome: —
Reflection: —
Activity mode: —

## Revisions

- Gerichtekarten haben "Diese Woche essen" und "Mehr Details" direkt in der Übersicht — die lernende Person wollte bekannte Gerichte wählen können, ohne jedes Mal die Detailansicht zu öffnen (Änderung in `prd.md` und `spec.md` nachgezogen).
- Nährwerte der Gerichte werden aus den Zutaten berechnet (neu: `src/data/ingredients.js`, `src/lib/dishNutrients.js`) statt von Hand geschätzt — die Prüfung ergab, dass die geschätzten Werte bei Eisen, Kalzium und Vitamin C oft deutlich falsch lagen. Die Regel "nie Kalzium und Eisen zusammen" wurde auf "eisenreich nur unter 300 mg Kalzium" präzisiert, weil viele Zutaten beides enthalten; einzelne Rezepte wurden angepasst (Falafel ohne Tahini, weniger Tofu in Erdnuss-Nudeln, Paprika in Erbsen-Pesto-Nudeln und Burritos). Tofu ohne Kalziumangabe: 200 mg/100 g angenommen. Auf Wunsch der lernenden Person.
