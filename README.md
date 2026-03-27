# SheShark Web

A web app for **women entrepreneurs in clean energy**: dashboards, marketplace, funding, learning, community, safety, taxi, and **AI-assisted** business and health guidance. Built with **React 19**, **Vite 6**, **Tailwind CSS 4**, **Firebase** (auth & Firestore), and **Google Gemini** for chat on the server.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [How it runs](#how-it-runs)
- [Production build](#production-build)
- [Project structure](#project-structure)
- [Troubleshooting](#troubleshooting)

---

## Features

| Area | Description |
|------|-------------|
| **Landing & auth** | Public landing; sign-in via Firebase (e.g. Google). |
| **Dashboard** | Main hub after login. |
| **Energy Hub** | Energy-focused content and tools. |
| **AI Assistant** | Chat UI; requests go to `/api/ai/chat` with **health** or **business** modes (Gemini on the server). |
| **Marketplace** | Marketplace experience. |
| **Funding** | Funding-related flows. |
| **Learning** | Learning content. |
| **Business** | Business tools and advice context. |
| **Community** | Community features. |
| **Taxi** | Taxi-related section. |
| **Safety** | Safety resources. |
| **Profile** | User profile. |

The AI backend uses **Gemini 1.5 Flash** with separate system prompts for health vs. business (see `server.ts`).

---

## Tech stack

- **UI:** React 19, React Router 7, Tailwind CSS 4, Lucide icons, Motion, GSAP, Recharts  
- **State:** Zustand  
- **Backend (dev & optional prod):** Express + **Vite middleware** in development; static `dist/` in production when `NODE_ENV=production`  
- **Auth & data:** Firebase Auth, Firestore, Analytics (optional)  
- **AI:** `@google/genai` (Gemini), server-side only via `GEMINI_API_KEY`  
- **Tooling:** TypeScript, Vite, `tsx` for running the Node server  

---

## Prerequisites

- **Node.js** 18+ (20+ recommended)  
- **npm** (comes with Node)  
- A **Google AI Studio / Gemini API key** for chat  
- A **Firebase** project (web app) for `VITE_*` variables  

---

## Getting started

1. **Clone the repository**

   ```bash
   git clone https://github.com/TheShakSpace/Sheshark-Web.git
   cd Sheshark-Web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment** — create a `.env` file in the project root (see [Environment variables](#environment-variables)). Do not commit real secrets; `.env*` is gitignored except `.env.example` if you add one locally.

4. **Start the dev server**

   ```bash
   npm run dev
   ```

5. Open **http://localhost:3000** in your browser.

---

## Environment variables

Create **`.env`** in the repo root. Vite exposes only variables prefixed with `VITE_` to the client bundle.

### Server (Express + Gemini)

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | **Yes** (for AI chat) | Google Gemini API key. Used only on the server in `server.ts`. |

### Client (Vite + Firebase)

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | e.g. `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | GCP project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics (optional; may be required by your config) |

### Optional

| Variable | Description |
|----------|-------------|
| `DISABLE_HMR` | Set to `true` to disable Vite HMR (e.g. some hosted/agent environments). |

Example skeleton (replace values with your own):

```env
GEMINI_API_KEY=your_gemini_api_key

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Runs **`tsx server.ts`**: Express on port **3000** with Vite dev middleware and `/api/ai/chat`. |
| `npm run build` | Production Vite build → `dist/`. |
| `npm run preview` | Serves the built app with Vite’s preview (does **not** run `server.ts`). |
| `npm run lint` | Typecheck with `tsc --noEmit`. |
| `npm run clean` | Removes `dist/`. |

---

## How it runs

- **Development:** `npm run dev` starts Express (`server.ts`). Vite runs in **middleware mode** so you get HMR and the SPA at `http://localhost:3000`. AI requests hit `POST /api/ai/chat` on the same origin.
- **Client env in dev:** Vite loads env from the project root; `vite.config.ts` also passes `GEMINI_API_KEY` into the define block for the client build path—**secrets should stay server-only**; the chat API is the right place for Gemini calls (as implemented).

---

## Production build

1. Build the frontend:

   ```bash
   npm run build
   ```

2. Run the same Express app with production static serving:

   ```bash
   NODE_ENV=production tsx server.ts
   ```

   Ensure `GEMINI_API_KEY` (and any other server env vars) are set in the deployment environment. The server serves files from `dist/` and falls back to `index.html` for the SPA.

For hosting, you can also deploy the **`dist/`** folder to any static host if you move API routes to a separate backend; this repo is wired for **one Node process** serving both API and static files.

---

## Project structure

```
├── server.ts          # Express: Gemini API + Vite (dev) or static dist (prod)
├── vite.config.ts     # Vite + React + Tailwind; path alias `@/`
├── index.html
├── public/            # Static assets (e.g. icon, public downloads)
├── src/
│   ├── main.tsx
│   ├── App.tsx        # Routes, layout, sidebar
│   ├── pages/         # Feature pages (Dashboard, AI, etc.)
│   ├── components/
│   ├── lib/           # firebase, utils
│   └── store/         # Zustand
├── package.json
└── tsconfig.json
```

---

## Troubleshooting

- **`Gemini API key not configured`** — Set `GEMINI_API_KEY` in `.env` and restart `npm run dev`.  
- **Firebase errors in the browser** — Confirm all `VITE_FIREBASE_*` values match the Firebase console web app config. Restart dev server after changing env.  
- **AI chat fails with model errors** — The code uses `gemini-1.5-flash`. If Google renames or deprecates models, update the model string in `server.ts`.  
- **Port 3000 in use** — Change `PORT` in `server.ts` or stop the other process using that port.  
- **Git / GitHub push** — Use HTTPS with a Personal Access Token or SSH keys added to your GitHub account; repo access still requires collaborator/org permissions.

---

## License

Private / team use unless the repository owners specify otherwise.
