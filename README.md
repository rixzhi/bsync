# BSYNC — Municipal Permit Underwriting Frontend

Team California Doritos. Next.js 14 (App Router) + TypeScript + Tailwind CSS + lucide-react.

## Run it (WSL2)

```bash
cd bsync-frontend
npm install
npm run dev
```

Open http://localhost:3000. Toggle between **Officer Dashboard** and **Citizen Portal** from the top nav.

## What's here

- `app/page.tsx` — shell that switches between the two views
- `components/Dashboard.tsx` — officer console: application list, MOCK/LIVE toggle, traffic-light
  status badge (GREEN/YELLOW/RED), OCR Data + AI Legal Citations tabs
- `components/Intake.tsx` — citizen intake form: Name, Aadhaar, Survey Number, drag-and-drop PDF
  upload, "Running Deterministic OCR..." submit state
- `lib/types.ts`, `lib/mock-data.ts` — shared types and mock permit application data

## Wiring in real data

- The MOCK/LIVE toggle in `Dashboard.tsx` is currently cosmetic (`useState`). Wire it to swap the
  data source between `lib/mock-data.ts` and a real fetch to your underwriting API.
- `Intake.tsx`'s submit handler uses a `setTimeout` to simulate the OCR pipeline — replace it with
  your actual upload + OCR request, keeping the `processing` → `done` state transitions.

## Design tokens

Palette and type scale live in `tailwind.config.ts` (`ink`, `slate`, `seal`, `status` colors;
IBM Plex Serif/Sans/Mono). Adjust there to restyle globally.
