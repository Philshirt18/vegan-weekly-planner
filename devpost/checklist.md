---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. You can see the app, look at dishes and choose them for the week**
  Becomes usable: A running app in a calm pastel look with a welcome screen, the overview of the 17 dishes (picture placeholder and name), the detail view (nutrition, ingredients, method) and the switch "Eat this week". The choice only lasts while the page is open.
  Why now: Carries the kernel (the 17 dishes balanced in advance) in the very first step and provides the frame everything else goes into. The dish data is also the basis for the note and the shopping list.
  PRD ref: `prd.md > The Core Journey` (steps 1, 3, 4), `prd.md > Choosing dishes`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Stack`, `spec.md > Look and Feel`, `spec.md > Components > Dishes overview and detail view`, `spec.md > Data Model`, `spec.md > File Structure`
  Build: Set up the Vite/React project, theme (colours, Nunito, round shapes), welcome, `src/data/dishes.js` with 17 vegan dishes (ingredients with categories, method, `calciumRich`/`ironRich`), overview, detail view, placeholder for missing pictures, button "Add another dish" without function. Check package versions with `npm view`.
  Verify (mechanical): `npm run build` runs without errors; the dev server starts; a small test confirms 17 dishes with name, ingredients, method and nutrition; pages load without errors in the console.
  Learner check: Open the app, click a dish, look at nutrition/ingredients/method, select and deselect "Eat this week". Does it look the way you pictured it? Are the dishes and their nutrition values plausible?
  Commit: `Add app shell, look and feel, and 17 dishes with detail view`

- [x] **2. You can sign in and your family is saved**
  Becomes usable: Register and sign in with email and password, family profile with guideline values (name, sex, age, weight, pregnancy/breastfeeding), note "not medical advice". Profile and chosen dishes are back after reloading and on another device.
  Why now: Firebase is the biggest risk (account, access values, security rules). It comes early so surprises show up early, and it provides the saving for everything that follows.
  PRD ref: `prd.md > Family profile`, `prd.md > The Core Journey` (steps 2, 9), `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components > Welcome and sign-in`, `spec.md > Components > Family profile`, `spec.md > Components > Connection to Firebase`, `spec.md > Components > Logic`, `spec.md > Data Model`, `spec.md > External Services and Dependencies`
  Build: The learner sets up the Firebase project (guided step by step; the access values are put into `.env.local` by the learner themself). Build `firebase.js`, sign-in, profile and `nutrition.js` (guideline values, with a checked source) and save `members` and `selectedDishIds` in `users/{uid}`. Security rule: only the user's own entry.
  Verify (mechanical): Tests for `nutrition.js` (protein by weight, child, pregnancy); `npm run build` runs; the Firestore rules contain the owner check; a test sign-in writes and reads an entry.
  Learner check: Register with email and password, enter the family (three people with a child), choose dishes, reload the page and sign in again. Everything should be back. Then sign in on the phone and see the same.
  Commit: `Add Firebase login, family profile, computed nutrients, and saved selection`

- [x] **3. You get a week plan with a calcium note**
  Becomes usable: With fewer than 14 dishes you choose the days, a note appears when the number does not fit, the app spreads the dishes over lunch and dinner, and on days with two calcium-rich dishes a dismissible note appears. With zero dishes a note appears. The plan is saved.
  Why now: This is the second part of the kernel (nutrition-aware spreading). It builds on the dishes from step 1 and the saving from step 2.
  PRD ref: `prd.md > Week plan`, `prd.md > The Core Journey` (steps 5, 6), `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components > Day selection and week plan`, `spec.md > Components > Logic`, `spec.md > Data Model`
  Build: `planner.js` (slots from the days, spreading, detection of days with two calcium-rich dishes, count check), pages `PlanDays` and `WeekPlan`, saving `days` and `plan`.
  Verify (mechanical): Tests for `planner.js` (14 of 14, 8 of 10 slots, odd number, note for two calcium-rich dishes, no note otherwise); `npm run build` runs.
  Learner check: Choose 14 dishes and look at the plan. Then choose only 9: check the day selection and the note. Put two calcium-rich dishes on one day: does the note appear, and can it be dismissed?
  Commit: `Add week planner with calcium warning`

- [x] **4. You can move dishes in the plan by drag and drop**
  Becomes usable: Dishes can be moved between slots with the mouse and on the phone by touch. Notes update immediately, and the change is saved.
  Why now: Drag and drop is the technically trickiest control (touch). It comes right after the plan so a problem shows up early.
  PRD ref: `prd.md > Week plan`, `prd.md > The Core Journey` (step 6)
  Spec ref: `spec.md > Components > Day selection and week plan`, `spec.md > Important Failure Modes`
  Build: Add dnd kit to `WeekPlan`, swapping dishes between slots, re-checking the notes, saving. If touch does not work cleanly: moving by tapping and choosing as a fallback.
  Verify (mechanical): Test for the swap function in `planner.js`; `npm run build` runs; the page loads without console errors.
  Learner check: Drag and drop a dish on the computer, then on the phone. Does the note change with it? Does the change stay after reloading?
  Commit: `Add drag and drop for the week plan`

- [x] **5. You click "Done" and get your shopping list**
  Becomes usable: Preview of the shopping list with all ingredients of the plan, scaled to the family (adult 1, child up to 12 years 0.5), identical ingredients added up, sorted by category. You tick off what you already have and see the final list. Ticked items are saved.
  Why now: This is the third part of the kernel and the end point of the flow in the PRD. It needs the plan and the profile.
  PRD ref: `prd.md > Shopping list`, `prd.md > The Core Journey` (steps 7, 8), `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components > Shopping list`, `spec.md > Components > Logic`, `spec.md > Data Model`
  Build: `shopping.js` (portions, scaling, adding up identical ingredients and units, categories), page `Shopping` with preview, ticking off and final list, saving `checkedIngredients`, empty state.
  Verify (mechanical): Tests for `shopping.js` (scaling, same ingredient in two dishes added up, half portion for the child, categories, ticked ingredients missing from the final list); `npm run build` runs.
  Learner check: Finish the plan with "Done", check the preview (are the amounts roughly right?), tick off some items and look at the final list. Are the categories right?
  Commit: `Add shopping list with scaled quantities and recipe portion picker`

- [ ] **6. The app is reachable under a link and documented**
  Becomes usable: The app runs on Vercel under a link, works on the phone and the computer, and the README describes start and set-up.
  Why now: Last technical step, because everything before it should be checkable locally. It shows whether login and database also work online.
  PRD ref: `prd.md > The Core Journey` (step 9)
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > External Services and Dependencies`
  Build: `vercel.json` for the page routes, README (start, Firebase set-up, publishing, note about not being medical advice), `.env.example`. The learner connects the GitHub repository to Vercel, enters the environment variables and adds the Vercel address in Firebase as an authorized domain. Guided.
  Verify (mechanical): `npm run build` runs; the Vercel link loads; sign-in and saving work online; no access values in the repository (search for `.env` and key values).
  Learner check: Open the Vercel link on the phone, sign in and play through the whole flow up to the shopping list.
  Commit: `Add Vercel config and README`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after step 3 (week plan with note): the kernel is visible and the direction can still change.
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

- Dish cards have "Eat this week" and "More details" directly in the overview — the learner wanted to choose known dishes without opening the detail view every time (change carried into `prd.md` and `spec.md`).
- Dish nutrition is computed from the ingredients (new: `src/data/ingredients.js`, `src/lib/dishNutrients.js`) instead of being estimated by hand — the check showed that the hand-estimated values for iron, calcium and vitamin C were often clearly wrong. The rule "never calcium and iron together" was refined to "iron-rich only under 300 mg calcium", because many ingredients contain both; individual recipes were adjusted (falafel without tahini, less tofu in the peanut noodles, bell pepper in the pea pesto pasta and the burritos). Tofu without a calcium label: 200 mg per 100 g assumed. At the learner's request.
- Drag and drop on the phone (touch) is not yet tested — at the learner's request to be tested after the Vercel step (step 6); if it does not work cleanly, add the tap-and-choose fallback.
- Portion picker in the recipe (detail view, `src/lib/recipe.js`) added — the learner wanted to see the amounts for the portions needed while cooking; deliberately affects only the recipe view, not the shopping list (the learner's decision).
- The calcium note in the week plan is worded around iron absorption and neutrally (calcium itself is not harmful) — the learner's decision.
- The whole app, the README and the planning documents were translated to English — the learner's decision. Dish IDs and page addresses are now English (`/dishes`, `/week`, `/shopping`); saved choices with old dish IDs are dropped when loading.
- The final shopping list has tick boxes too (`boughtIngredients`, separate from the "already at home" ticks of the preview), with a counter and struck-through items — the learner's request, for use while shopping.
- Separate weeks with one shopping list per week (new: `src/lib/weeks.js`, `src/lib/storedData.js`, `src/components/WeekSwitcher.jsx`; Firestore data moved from one top-level plan to `weeks[<Monday>]`) — the learner wanted to plan next week already. Existing single plans are moved into the current week on load. Saving now uses `updateDoc` because `setDoc` with merge would not clear a reset plan in Firestore; this also fixed a latent bug where a discarded plan could come back after reloading.
- The welcome screen got a light "How it works" list (four numbered steps) — the learner asked whether an explanation of the steps is needed; a full tutorial was judged unnecessary for the demo, a short list helps people who open the public link without the video.
- Mobile layout fixes found on a 390 px wide screen (iPhone 12): the tick rows of the shopping list stacked vertically because a global form rule turned every `label` into a column, and buttons that wrapped onto two lines touched each other. Rows are now one line (checkbox, name, amount) and button bars use a flex gap; plus `text-size-adjust` and `overflow-wrap` so iPhones neither enlarge nor overflow text.
- App icon and favicon added (a sage-green bowl with a sprout, AI-generated by the learner): `public/favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`, generated with `scripts/make-icons.py`. The rounded versions have transparent corners; the iPhone version is a full square because iOS rounds it itself.
