# Vegan Weekly Planner

A weekly meal planner for vegan families. Pick from 17 vegan dishes (nutrition computed from their ingredients), let the
app spread them over lunch and dinner, get a note about iron absorption when two calcium-rich dishes land on the same
day, swap dishes by drag and drop, and get a shopping list scaled to your family.

> **Note:** All nutrition values are approximations and guideline values for orientation. They are **not medical advice**.

**Live demo:** https://vegan-meal-family.vercel.app/

Built with React, Vite and Firebase (login + database), hosted on Vercel. This project was planned with the Devpost Learn
skills: see [`devpost/scope.md`](devpost/scope.md), [`devpost/prd.md`](devpost/prd.md) and
[`devpost/spec.md`](devpost/spec.md).

## What the app does

1. Sign in (email and password) and add your family (name, sex, age, weight, pregnancy/breastfeeding). From this the app
   shows daily guideline values for protein, calcium and iron (based on the DGE reference values).
2. Choose up to 14 of the 17 vegan dishes for the week. Each dish has a photo, nutrition, ingredients and a method, with
   a portion picker for cooking.
3. The app spreads the dishes over lunch and dinner of the days you choose. If both dishes of a day are high in calcium,
   you get a note about iron absorption.
4. Swap dishes by drag and drop.
5. Shopping list: scaled to the family (children up to 12 count as half a portion), identical ingredients added up,
   sorted by category. Tick off what you already have at home.

Every week has its own dishes, plan and shopping list; a week switcher (this week, next week …) lets you plan ahead.

Family, selection, plans and ticked items are saved in Firebase and are the same on phone and computer.

## Run it yourself

Requirements: Node.js and your own Firebase project.

```bash
npm install
cp .env.example .env.local   # then fill in the Firebase values
npm run dev                  # then open http://localhost:5173
```

Tests and build:

```bash
npm test
npm run build
```

### Set up Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Register a **web app** (without Firebase Hosting). Copy the six values from `firebaseConfig` into `.env.local`
   (names in `.env.example`).
3. **Authentication** → enable the **Email/Password** sign-in method.
4. Create a **Firestore Database** (production mode) and paste the rules from [`firestore.rules`](firestore.rules).
   They let every signed-in person read and write only their own entry.

The access values belong **only** in `.env.local` (not committed) and in the Vercel settings, never in the code.

### Publish with Vercel

1. Connect the repository to [Vercel](https://vercel.com) (framework: Vite, build `npm run build`, output `dist`).
2. In the Vercel project settings under **Environment Variables**, add the six `VITE_FIREBASE_…` values.
3. In Firebase under **Authentication → Settings → Authorized domains**, add the Vercel address.

## Structure

```
src/
  pages/        Screens (welcome, sign-in, profile, dishes, detail, days, week plan, shopping)
  components/   Reusable pieces
  data/         The 17 dishes and the nutrition per ingredient (approximate values)
  lib/          Logic: guideline values, dish nutrition, week plan, shopping list, recipe amounts, Firebase
  styles/       Look (colours, font, rounded shapes)
tests/          Tests of the logic
devpost/        Planning documents (scope, prd, spec) and the build checklist
```

## Known limits

- The nutrition per ingredient consists of typical approximate values for raw ingredients, not a verified database.
  For tofu without a label, a calcium value of 200 mg per 100 g is assumed.
- Dish photos: as long as no picture is in `public/images/` (`<dish-id>.jpg`, 4:3, 1200 × 900), the app shows a placeholder for that dish. The pictures are AI-generated. On macOS, `scripts/convert-images.sh` turns originals from `images-originals/` (named by dish id, not committed) into the right size and format. The app icon and favicon are made from `images-originals/icon/app-icon.png` with `scripts/make-icons.py` (needs Pillow).
- Adding or editing your own dishes, other diets and further nutrients (for example vitamin B12) are not part of this
  demo.
