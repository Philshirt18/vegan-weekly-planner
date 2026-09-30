---
doc: spec
status: approved
---

# Vegan Weekly Planner (working title) — Technical Spec

## How This Works, In Plain Language
The app is a **web app**: a website that behaves like an app in the browser and works on a computer and a phone. It has four parts:

1. **The interface** (built with React): all the screens from the PRD, meaning welcome, sign-in, family profile, dishes overview, detail view, week plan and shopping list. The whole interface is in English.
2. **The dish data:** the 17 dishes are stored as a fixed file in the app (name, picture, ingredients, method). Their nutrition is computed from the ingredients. They do not change in the demo.
3. **The logic:** small rules in the app that (a) work out the guideline values from family and weight, (b) spread the dishes over the week and spot calcium conflicts, and (c) calculate the shopping list (scale the amounts, add up identical ingredients).
4. **Firebase** (an online service from Google): handles the **sign-in** with email and password and stores your personal data in a **database**: family, chosen dishes, week plan and ticked items. This is why you see the same on phone and computer.

**Vercel** puts the finished app on the internet under a link. The database is like an online spreadsheet that the app writes to and reads from. There is exactly one entry per person.
Why this shape: a login and a database are more effort than a sticky note in the browser, but the user wanted the same data on both devices. To keep it small, the dishes live in the app instead of the database, and there is only one sign-in method.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. **Welcome:** The app loads from Vercel. The interface shows the short text. *(Interface only.)*
2. **Sign in / register:** You enter email and password → this goes to Firebase Authentication → Firebase answers with your user ID → the app remembers that you are signed in.
3. **Family profile:** You add people → on saving, the app writes them into your database entry in Firestore. The guideline values are calculated in the app from age, sex, weight and pregnancy/breastfeeding.
4. **Dishes overview and detail view:** The dishes come from the fixed file. When you select or deselect "Eat this week", the app saves the choice in your database entry.
5. **Choose days and spread:** With fewer than 14 dishes you choose days. The logic spreads the dishes over the slots and checks whether two calcium-rich dishes fall on one day (→ note). The arrangement is saved.
6. **Drag and drop:** Moving changes the arrangement → notes are checked again → saved.
7. **Done → shopping list:** The logic takes all dishes of the plan, scales the amounts with the family's portions (adult 1, child up to 12 years 0.5), adds up identical ingredients and sorts by category.
8. **Ticking off and final list:** Ticked ingredients are saved; the final list shows the rest.
9. **Coming back:** The next time you open the app you sign in (or are still signed in), the app reads your entry from Firestore and shows family, plan and list again.

## Stack
Versions checked with `npm view` on 2026-09-30 (current at that time): React 19.3, Vite 8.3, React Router 7.18, Firebase 12.19, dnd kit core 6.3, Vitest.

- **React** with **Vite** (JavaScript), interface and build tool — [react.dev](https://react.dev), [vite.dev/guide](https://vite.dev/guide/). *Chosen (agreed by the learner):* simple, fast, can be published directly on Vercel. *Tradeoff:* more setup than a single HTML file.
- **React Router** for the screens — [reactrouter.com](https://reactrouter.com).
- **Firebase Authentication** (email and password only) — [firebase.google.com/docs/auth/web/password-auth](https://firebase.google.com/docs/auth/web/password-auth). *Chosen:* the simplest sign-in method. *Tradeoff:* no "forgot password" in the demo.
- **Cloud Firestore** as the database — [firebase.google.com/docs/firestore](https://firebase.google.com/docs/firestore).
- **dnd kit** for drag and drop with mouse and touch — [dndkit.com](https://dndkit.com).
- **Vercel** for publishing — [vercel.com/docs](https://vercel.com/docs).
- **Plain CSS** (with variables for the colours), no extra styling library.
- **Vitest** for the tests of the logic.

## Where It Runs and How Someone Tries It
- **Runs:** in the browser (computer and phone).
- **Start locally:** `npm install`, then `npm run dev`, then open the address shown in the browser (usually `http://localhost:5173`).
- **Set up Firebase (once, by the user in the browser):** create a Firebase project, enable Authentication with email/password, create Firestore, paste the security rules from `firestore.rules`, register a web app. The access values go into the file `.env.local` (not into the repository, not into the chat). A template `.env.example` without real values is in the repository.
- **Publish:** connect the GitHub repository to Vercel, enter the values from `.env.local` as environment variables in the Vercel settings, add the Vercel address in Firebase Authentication under "Authorized domains".
- **For the submission:** the short demo video and the public GitHub repository (with `scope.md`, `prd.md`, `spec.md`) are required. The Vercel link is extra.
- **Recording:** record with a test account, showing the whole flow (profile, 14 dishes, drag and drop, note, shopping list).

## Look and Feel
PRD ref: `prd.md > Look and Feel`.
- **Colours:** soft, matte pastel tones. Light beige background, accents in soft sage green, text and borders in warm, muted brown. No bright colours.
- **Font:** a round, well readable font that does not look strict (Nunito from Google Fonts).
- **Shapes:** round buttons, rounded cards, generous spacing.
- **Mood:** calm and family-friendly; short, friendly texts in English.
- **Phone first:** single-column layout on the phone; the dish grid gets wider on the computer.
- **Notes** are gentle (for example warm yellow), not alarming red.

## Components

### Welcome and sign-in
Short text, then registration or sign-in. Errors (wrong password, email already taken) are shown clearly.
PRD ref: `prd.md > The Core Journey` (steps 1–2).

### Family profile
Form and list for people (name, sex, age, weight, pregnancy/breastfeeding), note "not medical advice". Calculates guideline values through the nutrition logic.
PRD ref: `prd.md > Family profile`.

### Dishes overview and detail view
Grid with cards for 17 dishes (photo, name, button "Eat this week", button "More details"), marker for chosen dishes, button "Add another dish" without function. Detail view: photo and name, focus label, nutrition, ingredients with a portion picker (half steps, starting value the family, only for the recipe view), method, switch "Eat this week". If a picture is missing, a soft placeholder appears.
PRD ref: `prd.md > Choosing dishes`.

### Day selection and week plan
Click days when fewer than 14 dishes are chosen. Note when the number does not fit. Spreading of the dishes over lunch and dinner, drag and drop, a note for two calcium-rich dishes on the same day (can be dismissed). A note when no dish is chosen.
PRD ref: `prd.md > Week plan`, `prd.md > States and Boundaries`.

### Shopping list
Preview with categories, ingredients and amounts, ticking off what is at home, final list in which items are ticked off while shopping (struck through, with a counter). Empty state when everything is ticked off.
PRD ref: `prd.md > Shopping list`.

### Logic
Small files without an interface:
- **Nutrition:** guideline values for protein (by weight), calcium and iron by age, sex, pregnancy/breastfeeding (`lib/nutrition.js`), and the nutrition of a dish computed from its ingredients (`lib/dishNutrients.js`, `data/ingredients.js`).
- **Spreading and note:** assigns chosen dishes to slots and finds days with two calcium-rich dishes (`lib/planner.js`).
- **Shopping list:** scales amounts per portion with the family portions, adds up identical ingredients of the same unit, groups by category (`lib/shopping.js`).
- **Recipe amounts:** scales ingredient amounts for cooking to the chosen portions (`lib/recipe.js`).
PRD ref: `prd.md > Family profile`, `prd.md > Week plan`, `prd.md > Shopping list`.

### Connection to Firebase
Sign in, sign out, read and write data. No other file knows Firebase.
PRD ref: `prd.md > States and Boundaries` (coming back).

## Data Model
**Fixed data (in the app, does not change):** list of the 17 dishes. Per dish:
- `id`, `name`, `image` (path, `/images/<id>.jpg`),
- `nutrients` (protein, calcium, iron, vitamin C per adult portion) — **computed from the ingredients**, not typed in by hand,
- `calciumRich` (from 300 mg calcium), `ironRich` (iron from 5 mg **and** under 300 mg calcium) — derived from the computed values, never both at once,
- `ingredients`: list with `name`, `amount` (per adult portion), `unit` (`g`, `ml`, `pc`, `tbsp`, `tsp`, `clove`, `slice`), `category`,
- `steps`: the method.

**Personal data (Firestore):** one entry per user, `users/{user ID}`:
- `members`: list with `id`, `name`, `sex` (`female`/`male`/`diverse`), `age`, `weightKg`, `status` (`none`/`pregnant`/`breastfeeding`),
- `selectedDishIds`: chosen dishes,
- `days`: chosen days of the week (`mon` … `sun`),
- `plan`: for every day `lunch` and `dinner` with a dish ID,
- `checkedIngredients`: ingredients ticked in the preview as "already at home" (key `name|unit`),
- `boughtIngredients`: ingredients ticked in the final list as "in the cart" (key `name|unit`).

**Where it lives, how it changes, what happens on return:**
- Fixed dishes: in the app, they only change with a new version.
- Personal data: in Firestore, the app writes on every change. On the next opening it is read and everything is back. The phone sees changes from the computer after reloading the page (no live sync). Saved dish IDs that no longer exist are dropped on loading.
- Portions: a person from 13 years counts 1, up to 12 years 0.5. This is fixed in the logic.

**Security rule for Firestore:** every signed-in person may read and write only their own entry (`request.auth.uid == userId`).

## File Structure
```
project/
├── src/
│   ├── main.jsx                 # Start point of the app
│   ├── App.jsx                  # Screens and the routes between them
│   ├── pages/
│   │   ├── Welcome.jsx          # Welcome
│   │   ├── Login.jsx            # Sign in / register
│   │   ├── Profile.jsx          # Family profile
│   │   ├── Dishes.jsx           # Dishes overview
│   │   ├── DishDetail.jsx       # Detail view
│   │   ├── PlanDays.jsx         # Choose days / note about the number
│   │   ├── WeekPlan.jsx         # Week plan with drag and drop
│   │   └── Shopping.jsx         # Preview, ticking off, final list
│   ├── components/              # Reusable pieces (layout, image, sign-in guard)
│   ├── data/
│   │   ├── dishes.js            # 17 dishes (fixed, ingredients and method)
│   │   └── ingredients.js       # Nutrition per ingredient (approximate values), basis of the dish nutrition
│   ├── lib/
│   │   ├── dishNutrients.js     # Compute and classify the nutrition of a dish from its ingredients
│   │   ├── recipe.js            # Scale ingredient amounts for cooking to the chosen portions
│   │   ├── nutrition.js         # Guideline values per person, portion factor
│   │   ├── planner.js           # Spreading, days, calcium note, swapping
│   │   ├── shopping.js          # Scale, add up, categories, formatting
│   │   ├── firebase.js          # Sign-in, reading and writing
│   │   └── AppState.jsx         # Central state, loading and saving
│   └── styles/
│       └── theme.css            # Colours, font, round shapes
├── tests/                       # Tests of the logic (Vitest)
├── public/
│   └── images/                  # Pictures of the dishes (<dish-id>.jpg, created by the user)
├── devpost/                     # Devpost learning workspace (planning documents)
├── firestore.rules              # Security rules for the database
├── .env.example                 # Template without real values
├── .gitignore
├── vercel.json                  # So that all pages of the app load through Vercel
├── package.json
└── README.md
```

## External Services and Dependencies
- **Firebase Authentication (email/password):** register, sign in, sign out through the Firebase web package. Access values in `.env.local`. [Docs](https://firebase.google.com/docs/auth/web/password-auth).
- **Cloud Firestore:** reading and writing the entry `users/{uid}`. [Docs](https://firebase.google.com/docs/firestore).
- **Vercel:** publishing from GitHub, environment variables in the project settings. [Docs](https://vercel.com/docs).
- **Google Fonts** (Nunito): font. [fonts.google.com](https://fonts.google.com).
- **DGE reference values** as the basis of the guideline values: [protein](https://www.dge.de/wissenschaft/referenzwerte/protein/), [calcium](https://www.dge.de/wissenschaft/referenzwerte/calcium/), [iron](https://www.dge.de/wissenschaft/referenzwerte/eisen/).
- **Costs and limits:** it is assumed that the free tiers of Firebase and Vercel are enough for the demo. Not verified beyond the free "Spark" plan being shown in the Firebase console.

## Important Failure Modes
- **Firebase not reachable or set up wrongly** → a clear message ("Your data could not be loaded") instead of an empty page; for the recording a fully set-up test account is needed.
- **Picture of a dish is missing** → a soft placeholder.
- **Sign-in fails** (wrong password, email already taken) → a clear message on the sign-in screen.
- **Drag and drop does not work cleanly on the phone** → as a fallback, a dish can be moved by tapping and choosing (only if the test shows it is needed).

## What Was Simplified and Why
- **Fixed dishes in the app** instead of in the database — less setup; adding dishes is under "Later". The database holds only personal data.
- **Email and password only** instead of further sign-in methods or "forgot password" — the simplest sign-in.
- **One entry per user** instead of several tables — enough for the demo.
- **Reloading instead of live sync** between devices — no real-time effort.
- **Fixed portion rule** (adult 1, child up to 12 years 0.5) instead of calculating from age and weight.
- **Nutrition per dish computed from a table of approximate values per ingredient** (raw ingredients, vitamin C with a cooking loss factor of 0.7; tofu assumed at 200 mg calcium per 100 g), marked as "approximate". Not a verified nutrition database.
- **Pictures created by the user**; placeholders until then.

## Decisions and Open Issues
**Decisions (by the learner):**
- Web app on computer and phone, published through Vercel (the learner's wish, because the app is meant for real use).
- Login and database through Firebase so that phone and computer show the same. *Tradeoff:* more effort and more sources of error than storage in the browser.
- Recommendation accepted: React with Vite, email/password only, only personal data in the database, drag and drop through a library.
- Pictures are AI-generated and supplied by the learner; the app shows placeholders until then.
- Children up to 12 years count as half a portion, fixed.
- Nutrition: guideline values per person based on the DGE (D-A-CH) reference values; dish nutrition computed from the ingredients.
- Calcium/iron rule defined as: iron-rich only under 300 mg calcium, because many plant foods contain both. The note in the week plan refers to iron absorption.
- Portion picker in the recipe view only (not in the shopping list).
- The whole app in English.

**Derived from the implementation (details, no new product decisions):** structure of the files, data format in Firestore, security rule, font Nunito, dish IDs in English.

**The learner's learning wish** ("understand where I can make the most important decisions"): the decisions above with their tradeoffs are the answer in small. The biggest ones were login with a database instead of browser storage, and the definition of the calcium/iron rule after the dish nutrition was actually computed.

**Open uncertainty:** the learner named no specific uncertainty; none was invented.

**Still to check:**
- Drag and drop on the phone (touch) — to be tested after the Vercel deployment.
- The iron guideline values for children from 10 years were not clear when retrieved (marked "check" in `lib/nutrition.js`); compare with the DGE reference value tool.
- The nutrition per ingredient is from typical approximate values, not a retrieved database.
