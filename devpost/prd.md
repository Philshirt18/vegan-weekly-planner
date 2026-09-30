---
doc: prd
status: approved
---

# Vegan Weekly Planner (working title) — Product Requirements

An app that plans the week for a vegan family: from 17 dishes that are balanced for nutrients in advance, with recipes, a note when calcium-rich dishes pile up on one day, and an automatic shopping list sorted by category.
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

## The Core Journey
1. On first opening, you see a short **welcome screen** that briefly describes what the app does. (`scope.md > The Core Loop`)
2. Then you **sign in** (email and password) and come to the **family profile**: you add each family member (name, sex, age, weight, field for pregnancy/breastfeeding). A note says that all values are guidelines for orientation, not medical advice.
3. Next comes the **dishes overview** with the 17 demo dishes (photo, name and the buttons "Eat this week" and "More details"). A button "Add another dish" is there but does nothing in the demo.
4. Clicking a dish opens the **detail view**. There you select or deselect "Eat this week".
5. If fewer than 14 dishes were chosen, the app asks **for which days** the plan should apply (days of the week to click). Every day has a lunch and a dinner.
6. The app **spreads** the chosen dishes over the meals of the week. You can move dishes by **drag and drop**. If both dishes of a day are high in calcium, a **note about iron absorption** appears; you decide yourself whether to keep it.
7. You click **"Done"**. A **shopping list preview** appears with all ingredients and amounts, sorted by category.
8. You **tick off** what you already have at home. From that comes the **final shopping list** with what is still missing.
9. Success: a few clicks have become a week plan and a finished shopping list. When you come back later, the family is still saved.

## Screens and Layout
- **Welcome screen:** a short text about what the app does, a button to continue.
- **Sign-in:** email and password, with "create account".
- **Family profile:** a list of the people added and a form to add one (name, sex, age, weight, pregnancy/breastfeeding) with the note "not medical advice". A button leads to the dishes overview.
- **Dishes overview:** grid of cards for 17 dishes, each with photo, name, a button "Eat this week" (choose directly) and a button "More details". A marker shows which dishes are chosen for this week. Button "Add another dish" (without function in the demo).
- **Detail view:** from top to bottom photo with name, focus label, nutrition, ingredients (with portion picker), method. Plus the choice "Eat this week".
- **Choose days:** appears only when fewer than 14 dishes are chosen; days of the week to click.
- **Week plan:** the week with lunch and dinner per day, dishes movable by drag and drop, notes visible, button "Done".
- **Shopping list:** first the preview with categories, ingredients and amounts to tick off, then the final list.

## Look and Feel
- Family-friendly, calm (it is an organising app).
- Soft, light pastel colours, matte: greens, beige, a little brown.
- Round rather than square buttons.
- A well readable font that does not look too strict.
- No specific role-model apps named.

## Features and Behavior

### Family profile
- Per person: name, sex, age, weight, pregnancy/breastfeeding.
- From age, sex, weight and pregnancy/breastfeeding come guideline values for the nutrients (for example protein by weight). Children get child-appropriate values.
- A note on every page with nutrition values: guidelines for orientation, not medical advice.
- User: a parent in a vegan family (for example two adults and a young child) who wants to enter the family so the values fit them.
  - [ ] You can add at least three people, including a child.
  - [ ] The fields name, sex, age, weight and pregnancy/breastfeeding are present.
  - [ ] The note "not medical advice" is visible.

### Choosing dishes
- 17 dishes, all vegan and balanced for nutrients in advance (protein in every dish, iron with vitamin C, calcium and iron not in the same dish). The user does not have to calculate anything.
- The overview shows photo, name and two buttons: "Eat this week" (select or deselect directly, without opening the detail view) and "More details".
- The detail view contains: photo with name, focus label ("High in calcium" or "High in iron, with vitamin C") with a short, neutral note (calcium: "important for bones and teeth"), nutrition, ingredients, method (in this order), plus the choice "Eat this week".
  - [ ] There are exactly 17 dishes, each with photo, name, nutrition, ingredients and method.
  - [ ] A click opens the detail view in the order given.
  - [ ] In the detail view, the portions for the recipe can be chosen in half steps (starting value: the family's portions). The ingredient amounts in the recipe recalculate; the shopping list stays with the family.
  - [ ] The dish can be selected and deselected; the overview shows what is chosen.
  - [ ] "Add another dish" is visible but has no function.

### Week plan
- A full week = 14 dishes (7 days × lunch and dinner).
- If fewer than 14 dishes are chosen, the app asks for which days the plan should apply. Each chosen day has two slots.
- If the number of chosen dishes does not match the slots (odd number or more dishes than slots), the app shows a note; you deselect dishes or add one.
- The app spreads the dishes over the meals. Lunch or dinner does not matter for calcium and iron.
- Drag and drop changes the arrangement.
- If both dishes of a day are high in calcium, a note about iron absorption appears. The user can ignore it.
  - [ ] With fewer than 14 dishes the day selection appears.
  - [ ] With a number that does not fit, a note appears that leads to selecting/deselecting.
  - [ ] After the spreading, every chosen meal is filled with a dish.
  - [ ] A dish can be moved by drag and drop.
  - [ ] Two calcium-rich dishes on the same day trigger a note that can be dismissed.

### Shopping list
- All ingredients of all chosen dishes of the chosen days.
- Amounts are scaled to the family.
- Identical ingredients are added up (for example one total of onions instead of several entries).
- Sorted by category (vegetables, legumes, chilled items such as tofu and tempeh, and so on).
- First a preview with all ingredients and amounts; you tick off what is already at home; from that comes the final list, in which you tick off items while shopping.
  - [ ] Every ingredient of the chosen dishes appears on the list.
  - [ ] An ingredient that occurs in several dishes appears only once with the total amount.
  - [ ] Ingredients are grouped by category.
  - [ ] Ticked-off ingredients are missing from the final list.
  - [ ] In the final list you can tick off items again as you put them in your cart; ticked items are struck through, a counter shows how many are done, and the ticks are saved.

## States and Boundaries
- **First start** — welcome screen, then sign-in, then an empty family profile.
- **Coming back** — the app remembers the family (see Product Decisions).
- **No dishes chosen** — the way to the week plan is blocked or shows a note that dishes must be chosen. (Assumption, see Open Questions.)
- **Number of dishes does not fit** — note with the option to select or deselect dishes.
- **Calcium conflict** — a note that the user may knowingly ignore.
- **All ingredients ticked off** — the final list is empty (assumption, see Open Questions).

## Product Decisions
- Vegan only, no other diets in the demo — more focus and less effort.
- Nutrients are built into the dishes that are balanced in advance instead of being calculated live — the user does not have to calculate, the demo stays simple. The nutrition of the dishes is computed from the ingredients (approximate values).
- Rule "calcium and iron not together": a dish counts as high in calcium from 300 mg calcium and as high in iron only with less than 300 mg calcium (from about 300 mg in one meal, iron absorption drops noticeably). Reason: many plant foods (tofu, beans, kale, sesame) contain both, so a strict separation would not be feasible. Tofu without a calcium label: 200 mg per 100 g assumed.
- Profile with weight, age, sex and pregnancy/breastfeeding — guideline values adapt to the person, children too.
- Note "not medical advice" — responsible; the values are for orientation.
- Only lunch and dinner — breakfast is almost always the same.
- 17 dishes, of which up to 14 are chosen for the week — this gives the choice a meaning.
- Recipes with a method are in the demo — the user wanted them in this version already.
- Portion picker in the recipe (half steps, starting value the family), only affects the recipe view, not the shopping list — makes cooking easier; the shopping list stays simple.
- Calcium-and-iron rule as a note instead of a block — the user decides for themselves. The note refers to iron absorption and is worded neutrally (calcium itself is not harmful).
- Amounts are scaled to the family and identical ingredients added — the shopping list should be usable directly.
- The app remembers the family and the plan — coming back without entering everything again.
- Login with email and password (Firebase) so that phone and computer show the same data.
- The whole app is in English (decided by the user after the first builds).

## What We're Building
- Welcome screen
- Sign-in
- Family profile (name, sex, age, weight, pregnancy/breastfeeding, note "not medical advice")
- 17 dishes with photo, name, nutrition, ingredients and method
- Dishes overview and detail view with the choice "Eat this week" and a portion picker for the recipe
- Button "Add another dish" (without function)
- Day selection when fewer than 14 dishes, and a note when the number does not fit
- Week plan with spreading, drag and drop and a note for two calcium-rich dishes on the same day
- Shopping list with categories, scaled and added-up amounts, ticking off and a final list
- Saving the family, plan and ticked items between visits

## Deferred From the POC
- Adding or editing dishes yourself — the button is only a placeholder.
- Other diets (vegetarian, gluten-free and more) — focus on vegan.
- A bigger list of dishes (25–30 dishes) — 17 are enough for the demo.
- Password reset and other sign-in methods.

## Possible Later Enhancements
- Other diets as a setting.
- Activity of the family members as a further factor for the guideline values.
- A note also for two iron-rich dishes on the same day.
- Notes about further vegan nutrients (above all vitamin B12, also iodine, vitamin D, zinc, omega-3) that cannot be covered by individual dishes.

## Non-Goals
- No medical advice or diagnosis.
- No breakfast plan (it stays almost always the same).
- No live calculation of nutrients per dish.

## Open Questions
- **Login:** Decided in the spec: the demo contains sign-in with email and password (Firebase) so that phone and computer show the same data. See `spec.md`.
- **Portions:** Decided: adults count as one portion, children up to 12 years as half a portion.
- **Source of the guideline values** for children and adults: decided in the build, the DGE (D-A-CH) reference values.
- **Photos:** The dish photos are created by the user with an AI image tool; until then the app shows placeholders.
- **Empty states:** Assumptions confirmed: with no dishes chosen the way to the week plan is blocked; with everything ticked off the final list says there is nothing to buy.
- **Remembering the week plan:** Confirmed: the chosen week plan is saved as well, not only the family.
