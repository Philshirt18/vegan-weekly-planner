---
doc: prd
status: approved
---

# Veganer Nährstoff-Wochenplaner (Arbeitstitel) — Product Requirements

Eine App, die einer veganen Familie die Woche plant: aus 17 vorab nährstoffmäßig abgestimmten Gerichten mit Rezepten, einer Warnung bei ungünstiger Kalzium-/Eisen-Verteilung und einer automatischen, nach Kategorien sortierten Einkaufsliste.
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

## The Core Journey
1. Beim ersten Öffnen sieht man einen kurzen **Willkommensscreen**, der knapp beschreibt, was die App macht. (`scope.md > The Core Loop`)
2. Danach kommt das **Familienprofil**: Man legt jedes Familienmitglied an (Name, Geschlecht, Alter, Gewicht, Feld für Schwangerschaft/Stillzeit). Ein Hinweis sagt, dass alle Werte Richtwerte und Orientierung sind, keine medizinische Beratung.
3. Danach öffnet sich direkt die **Gerichteübersicht** mit den 17 Demo-Gerichten (Foto, Name und die Knöpfe "Diese Woche essen" und "Mehr Details"). Ein Button "Weiteres Gericht hinzufügen" steht dort, tut in der Demo aber nichts.
4. Ein Klick auf ein Gericht öffnet die **Detailansicht**. Dort wählt man "Diese Woche essen" an oder ab.
5. Wurden weniger als 14 Gerichte gewählt, fragt die App, **für welche Tage** der Plan gelten soll (Wochentage zum Anklicken). Jeder Tag hat ein Mittag- und ein Abendessen.
6. Die App **verteilt** die gewählten Gerichte auf die Mahlzeiten der Woche. Per **Drag und Drop** kann man Gerichte verschieben. Sind an einem Tag beide Gerichte kalziumreich, erscheint eine **Warnung**; man entscheidet selbst, ob man trotzdem so lässt.
7. Man klickt **"Fertig"**. Es erscheint eine **Vorschau der Einkaufsliste** mit allen Zutaten und Mengen, nach Kategorien sortiert.
8. Man **hakt ab**, was man schon zu Hause hat. Daraus entsteht die **finale Einkaufsliste** mit dem, was noch fehlt.
9. Erfolg: Aus ein paar Klicks sind ein Wochenplan und eine fertige Einkaufsliste geworden. Beim späteren Öffnen ist die Familie noch gespeichert.

## Screens and Layout
- **Willkommensscreen:** kurzer Text, was die App macht, ein Button zum Weitergehen.
- **Familienprofil:** eine Liste der angelegten Personen und ein Formular zum Hinzufügen (Name, Geschlecht, Alter, Gewicht, Schwangerschaft/Stillzeit) mit dem Hinweis "keine medizinische Beratung". Ein Button führt zur Gerichteübersicht.
- **Gerichteübersicht:** Raster aus Karten für 17 Gerichte, jede mit Foto, Name, Knopf "Diese Woche essen" (direkt wählen) und Knopf "Mehr Details". Markierung, welche Gerichte für diese Woche gewählt sind. Button "Weiteres Gericht hinzufügen" (ohne Funktion in der Demo).
- **Detailansicht:** von oben nach unten Foto mit Name, Nährstoffe, Zutaten, Anleitung. Dazu die Auswahl "Diese Woche essen".
- **Tage wählen:** erscheint nur bei weniger als 14 gewählten Gerichten; Wochentage zum Anklicken.
- **Wochenplan:** die Woche mit Mittag und Abend pro Tag, Gerichte per Drag und Drop verschiebbar, Warnungen sichtbar, Button "Fertig".
- **Einkaufsliste:** zuerst die Vorschau mit Kategorien, Zutaten und Mengen zum Abhaken, dann die finale Liste.

## Look and Feel
- Familienfreundlich, ruhig (es ist eine Organisations-App).
- Weiche, helle Pastelltöne, matt: Grüntöne, Beige, etwas Braun.
- Runde statt eckige Buttons.
- Gut lesbare Schrift, die nicht zu streng wirkt.
- Keine konkreten Vorbild-Apps genannt.

## Features and Behavior

### Familienprofil
- Pro Person: Name, Geschlecht, Alter, Gewicht, Schwangerschaft/Stillzeit.
- Aus Alter, Geschlecht, Gewicht und Schwangerschaft/Stillzeit ergeben sich Richtwerte für die Nährstoffe (zum Beispiel Protein nach Gewicht). Kinder bekommen kindgerechte Werte.
- Hinweis auf jeder Seite mit Nährstoffwerten: Richtwerte und Orientierung, keine medizinische Beratung.
- Nutzer:in: Ein Elternteil in einer veganen Familie (zum Beispiel zwei Erwachsene und ein kleines Kind) will die Familie eintragen, damit die Werte passen.
  - [ ] Man kann mindestens drei Personen anlegen, darunter ein Kind.
  - [ ] Die Felder Name, Geschlecht, Alter, Gewicht und Schwangerschaft/Stillzeit sind vorhanden.
  - [ ] Der Hinweis "keine medizinische Beratung" ist sichtbar.

### Gerichte auswählen
- 17 Gerichte, alle vegan und vorab nährstoffmäßig abgestimmt (Protein in jedem Gericht, Eisen mit Vitamin C, Kalzium und Eisen nicht im selben Gericht). Die Nutzer:in muss nichts nachrechnen.
- Übersicht zeigt Foto, Name und zwei Knöpfe: "Diese Woche essen" (direkt an- oder abwählen, ohne die Detailansicht zu öffnen) und "Mehr Details".
- Die Detailansicht enthält: Foto mit Name, Schwerpunkt-Etikett ("Kalziumreich" oder "Eisenreich, mit Vitamin C") mit kurzem, neutralem Hinweis (Kalzium: "wichtig für Knochen und Zähne"), Nährstoffe, Zutaten, Anleitung (in dieser Reihenfolge), plus die Auswahl "Diese Woche essen".
  - [ ] Es gibt genau 17 Gerichte, jedes mit Foto, Name, Nährstoffen, Zutaten und Anleitung.
  - [ ] Ein Klick öffnet die Detailansicht in der genannten Reihenfolge.
  - [ ] Das Gericht lässt sich an- und abwählen; die Übersicht zeigt, was gewählt ist.
  - [ ] "Weiteres Gericht hinzufügen" ist sichtbar, hat aber keine Funktion.

### Wochenplan
- Vollständige Woche = 14 Gerichte (7 Tage × Mittag und Abend).
- Bei weniger als 14 gewählten Gerichten fragt die App, für welche Tage der Plan gelten soll. Pro gewähltem Tag gibt es zwei Plätze.
- Passt die Zahl der gewählten Gerichte nicht zu den Plätzen (ungerade Zahl oder mehr Gerichte als Plätze), zeigt die App einen Hinweis; man wählt Gerichte ab oder fügt eines hinzu.
- Die App verteilt die Gerichte auf die Mahlzeiten. Mittag oder Abend ist für Kalzium und Eisen egal.
- Drag und Drop ändert die Verteilung.
- Sind an einem Tag beide Gerichte kalziumreich, erscheint eine Warnung. Die Nutzer:in kann sie ignorieren.
  - [ ] Bei weniger als 14 Gerichten erscheint die Tage-Auswahl.
  - [ ] Bei nicht passender Anzahl erscheint ein Hinweis, der zum An-/Abwählen führt.
  - [ ] Nach der Verteilung ist jede gewählte Mahlzeit mit einem Gericht belegt.
  - [ ] Ein Gericht lässt sich per Drag und Drop verschieben.
  - [ ] Zwei kalziumreiche Gerichte am selben Tag lösen eine Warnung aus, die man wegklicken kann.

### Einkaufsliste
- Alle Zutaten aller gewählten Gerichte der gewählten Tage.
- Mengen werden auf die Familie umgerechnet.
- Gleiche Zutaten werden zusammengezählt (zum Beispiel eine Summe Zwiebeln statt mehrerer Einträge).
- Sortiert nach Kategorien (Gemüse, Hülsenfrüchte, Gekühltes wie Tofu und Tempeh und so weiter).
- Zuerst eine Vorschau mit allen Zutaten und Mengen; man hakt ab, was schon zu Hause ist; daraus entsteht die finale Liste.
  - [ ] Jede Zutat der gewählten Gerichte taucht auf der Liste auf.
  - [ ] Eine Zutat, die in mehreren Gerichten vorkommt, steht nur einmal mit der Gesamtmenge da.
  - [ ] Zutaten sind nach Kategorien gruppiert.
  - [ ] Abgehakte Zutaten fehlen in der finalen Liste.

## States and Boundaries
- **Erster Start** — Willkommensscreen, dann leeres Familienprofil.
- **Wiederkehr** — Die App erinnert sich an die Familie (siehe Product Decisions).
- **Keine Gerichte gewählt** — Der Weg zum Wochenplan ist gesperrt oder zeigt einen Hinweis, dass Gerichte gewählt werden müssen. (Annahme, siehe Open Questions.)
- **Zahl der Gerichte passt nicht** — Hinweis mit Möglichkeit, Gerichte an- oder abzuwählen.
- **Kalzium-Konflikt** — Warnung, die die Nutzer:in bewusst übergehen darf.
- **Alle Zutaten abgehakt** — Die finale Liste ist leer (Annahme, siehe Open Questions).

## Product Decisions
- Nur vegan, keine anderen Ernährungsformen in der Demo — mehr Fokus und weniger Aufwand.
- Nährstoffe stecken in den vorab abgestimmten Gerichten statt live berechnet — die Nutzer:in muss nicht rechnen, die Demo bleibt einfach. Die Nährwerte der Gerichte werden aus den Zutaten berechnet (Näherungswerte).
- Regel "Kalzium und Eisen nicht zusammen": Ein Gericht gilt als kalziumreich ab 300 mg Kalzium und als eisenreich nur mit weniger als 300 mg Kalzium (ab etwa 300 mg lässt die Eisenaufnahme in einer Mahlzeit merklich nach). Grund: Viele pflanzliche Lebensmittel (Tofu, Bohnen, Grünkohl, Sesam) enthalten beides, eine strikte Trennung wäre nicht machbar. Tofu ohne Kalziumangabe: 200 mg pro 100 g angenommen.
- Profil mit Gewicht, Alter, Geschlecht und Schwangerschaft/Stillzeit — Richtwerte passen sich der Person an, auch für Kinder.
- Hinweis "keine medizinische Beratung" — verantwortungsvoll; die Werte sind Orientierung.
- Nur Mittag- und Abendessen — das Frühstück ist fast immer gleich.
- 17 Gerichte, davon werden bis zu 14 für die Woche gewählt — so hat die Auswahl eine Bedeutung.
- Rezepte mit Anleitung sind in der Demo drin — die Nutzer:in wollte sie schon in dieser Version.
- Kalzium-und-Eisen-Regel als Warnung statt als Sperre — die Nutzer:in entscheidet selbst.
- Mengen werden auf die Familie umgerechnet und gleiche Zutaten addiert — die Einkaufsliste soll direkt nutzbar sein.
- Die App merkt sich die Familie — Wiederkehr ohne erneute Eingabe.
- Login: gewünscht, wenn es ohne großen Aufwand geht — Entscheidung im Spec.

## What We're Building
- Willkommensscreen
- Familienprofil (Name, Geschlecht, Alter, Gewicht, Schwangerschaft/Stillzeit, Hinweis "keine medizinische Beratung")
- 17 Gerichte mit Foto, Name, Nährstoffen, Zutaten und Anleitung
- Gerichteübersicht und Detailansicht mit Auswahl "Diese Woche essen"
- Button "Weiteres Gericht hinzufügen" (ohne Funktion)
- Tage-Auswahl bei weniger als 14 Gerichten und Hinweis bei nicht passender Anzahl
- Wochenplan mit Verteilung, Drag und Drop und Warnung bei zwei kalziumreichen Gerichten am selben Tag
- Einkaufsliste mit Kategorien, umgerechneten und zusammengezählten Mengen, Abhaken und finaler Liste
- Speichern der Familie zwischen den Besuchen

## Deferred From the POC
- Gerichte selbst hinzufügen oder bearbeiten — der Button ist nur ein Platzhalter.
- Andere Ernährungsformen (vegetarisch, glutenfrei und weitere) — Fokus auf vegan.
- Größere Gerichteliste (25–30 Gerichte) — für die Demo genügen 17.
- Login mit Konten, falls der Aufwand zu groß ist — siehe Open Questions.

## Possible Later Enhancements
- Weitere Ernährungsformen als Einstellung.
- Aktivität der Familienmitglieder als weiterer Faktor für die Richtwerte.
- Warnung auch bei zwei eisenreichen Gerichten am selben Tag.
- Hinweise zu weiteren veganen Nährstoffen (vor allem Vitamin B12, außerdem Jod, Vitamin D, Zink, Omega-3), die sich nicht über einzelne Gerichte decken lassen.

## Non-Goals
- Keine medizinische Beratung oder Diagnose.
- Kein Frühstücksplan (bleibt fast immer gleich).
- Keine Live-Berechnung der Nährstoffe pro Gericht.

## Open Questions
- **Login:** Entschieden im Spec: Die Demo enthält Anmeldung mit E-Mail und Passwort (Firebase), damit Handy und Computer dieselben Daten zeigen. Siehe `spec.md`.
- **Portionen:** Wie zählt ein Kind gegenüber einem Erwachsenen bei den Mengen (zum Beispiel halbe Portion)? Der Spec klärt das mit der Nutzer:in. Vor dem Spec: nein.
- **Herkunft der Nährstoffrichtwerte** für Kinder und Erwachsene (welche Quelle). Der Spec klärt das. Vor dem Spec: nein.
- **Fotos:** Woher die 17 Gerichtebilder kommen. Der Spec klärt das. Vor dem Spec: nein.
- **Leere Zustände:** Was die App bei null gewählten Gerichten und bei komplett abgehakter Liste zeigt (Annahme oben). Bitte im Review bestätigen.
- **Wochenplan merken:** Ob auch der gewählte Wochenplan gespeichert wird oder nur die Familie. Bitte im Review bestätigen.
