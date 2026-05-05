# EcoLens

AI-powered sustainability analysis for product ideas — runs a full lifecycle assessment across carbon footprint, UN SDGs, circular economy principles, and three-pillar sustainability, and returns a structured score with citations.

Built to give product managers and founders a fast, research-backed answer to "how sustainable is this product?" — before committing to a design or supply chain.

We use the following tech stack:
- Google Gemini 1.5 Pro for lifecycle analysis, grounded search, and structured JSON output
- React 19 + TypeScript + Vite for the frontend
- Firebase Authentication (Google OAuth) for identity
- Firestore for cloud persistence (authenticated users) and localStorage for anonymous sessions
- Recharts for score visualizations
- html2pdf.js for PDF export of analysis results
- Tailwind CSS v4 + Framer Motion for UI and animations

---

## Table of Contents

- [Features](#features)
- [Project Layout](#project-layout)
- [Tech Stack](#tech-stack)
- [Auth and Login Flow](#auth-and-login-flow)
- [Roles and RBAC](#roles-and-rbac)
- [Application State](#application-state)
- [Pages](#pages)
- [Components](#components)
- [NLP and AI Routing](#nlp-and-ai-routing)
- [Hooks and Utilities](#hooks-and-utilities)
- [Known Limitations](#known-limitations)
- [Setup](#setup)
- [Author](#author)

---

## Features

* **Carbon Lifecycle Assessment:** Full carbon footprint breakdown across materials, production, distribution, use phase, and end-of-life
* **UN SDGs Mapping:** Scores the product idea against all 17 Sustainable Development Goals with per-goal impact ratings
* **6Rs of Circularity:** Evaluates Rethink, Refuse, Reduce, Reuse, Recycle, Repair potential for the product
* **Three Pillars Score:** Composite environmental, social, and economic sustainability rating
* **Comparative Analysis:** Side-by-side comparison of up to N product ideas on a single view
* **Persistent History:** Analysis history saved to Firestore (logged in) or localStorage (anonymous)
* **PDF Export:** One-click export of any analysis to a formatted PDF report
* **Guided Onboarding:** First-visit walkthrough stored in localStorage — no account required to start
* **Sustainability Glossary:** In-app reference for all frameworks and terminology used

---

## Project Layout

```
EcoLens/
├── src/
│   ├── App.tsx                  # Root shell — view state machine, analysis orchestration
│   ├── main.tsx                 # React 19 entry point
│   ├── components/
│   │   ├── AuthProvider.tsx      # Firebase Auth context — user, signIn, logOut
│   │   ├── IdeaForm.tsx          # Product idea input form
│   │   ├── AnalysisDashboard.tsx # Single-product analysis results view
│   │   ├── ComparisonDashboard.tsx # Side-by-side multi-product comparison
│   │   ├── HistoryDashboard.tsx  # Past analyses browser
│   │   ├── LoginModal.tsx        # Google sign-in modal
│   │   ├── LoadingState.tsx      # Animated loading during AI analysis
│   │   ├── Glossary.tsx          # Sustainability glossary modal
│   │   ├── Onboarding.tsx        # First-visit guided tour
│   │   └── ui/                  # Reusable primitives (Button, etc.)
│   ├── lib/
│   │   ├── gemini.ts            # Gemini AI client — prompt, structured output, grounding
│   │   ├── storage.ts           # Dual-mode persistence (Firestore / localStorage)
│   │   ├── firebase.ts          # Firebase app + auth + Firestore initialization
│   │   └── utils.ts             # cn(), score color formatters
│   └── types/
│       └── index.ts             # All TypeScript types (ProductIdea, SustainabilityAnalysis, etc.)
├── firestore.rules              # Firestore security rules — deny-all default, owner-scoped
├── server/                      # Express dev server (if applicable)
├── package.json
└── vite.config.ts
```

---

## Tech Stack

**Frontend**
- **React 19 + TypeScript** — UI layer with full type safety across all AI outputs and user data
- **Vite** — fast build tooling and dev server
- **Tailwind CSS v4** — utility-first styling
- **Framer Motion** — animation layer for transitions and loading states
- **Recharts** — score charts and sustainability visualizations
- **Lucide React** — icon set
- **react-markdown** — renders AI-generated markdown content in analysis views

**AI / Backend**
- **@google/genai v1.29** — Google Gemini SDK; model `gemini-3.1-pro-preview`
- **Google Search grounding** — Gemini retrieves real-world citations to back every analysis
- **Structured JSON output** — `responseMimeType: "application/json"` enforces schema on AI response

**Data and Auth**
- **Firebase Authentication** — Google OAuth via `signInWithPopup`
- **Firestore** — cloud document store; user-scoped data isolation via security rules
- **localStorage** — anonymous session fallback; no account required to use core features

**Utilities**
- **html2pdf.js** — client-side PDF generation from rendered HTML
- **uuid** — unique ID generation for product ideas
- **clsx + tailwind-merge** — conditional class composition

---

## Auth and Login Flow

EcoLens uses Firebase Authentication with Google as the sole provider. The flow is:

1. App loads wrapped in `<AuthProvider>` — `onAuthStateChanged` listener fires immediately
2. While auth state resolves, `loading = true` blocks rendering
3. Unauthenticated users can still use the app — analyses are saved to localStorage
4. Clicking **Sign In** opens `<LoginModal>`, which calls `signInWithPopup(auth, GoogleAuthProvider)`
5. On first successful login, `AuthProvider` auto-creates a user document in Firestore at `/users/{uid}` with `email`, `displayName`, `photoURL`, and `createdAt`
6. After login, `storage.ts` automatically switches from localStorage to Firestore for all reads and writes
7. `logOut()` calls `signOut(auth)` — session clears, data falls back to localStorage

**Auth context shape:**

```ts
{
  user: FirebaseUser | null
  loading: boolean
  signIn: () => Promise<void>
  logOut: () => Promise<void>
  updateProfileDetails: (data: Partial<UserProfile>) => Promise<void>
}
```

Firestore errors are caught and logged via `handleFirestoreError()` — a structured error handler in `AuthProvider` that formats error codes and messages for debugging without crashing the UI.

---

## Roles and RBAC

EcoLens has a **single-role architecture** — there are no admin, moderator, or tiered permission levels.

Access control is enforced entirely through Firestore security rules using UID matching:

- Every user can only read and write their own data (`request.auth.uid == userId`)
- User profile: get, create, and update allowed — delete is not permitted
- Ideas collection: full CRUD for the owner only
- No record is visible to or modifiable by any other authenticated user
- Unauthenticated requests are denied for all Firestore paths

**Firestore rule structure:**

```
/users/{userId}         → read/write only if request.auth.uid == userId
/users/{userId}/ideas/  → full CRUD only if request.auth.uid == userId
```

Field-level validation is enforced at write time via `isValidUser()` and `isValidIdea()` helper functions in the rules file — these check that required fields exist and have the correct types before any write is committed.

---

## Application State

EcoLens does **not use a client-side router** (no React Router, no hash routing). Navigation is managed through a `view` state variable in `App.tsx`:

```ts
type View = 'form' | 'analysis' | 'comparison' | 'history'
```

State transitions:
- `'form'` → `'analysis'`: user submits ideas, `startAnalysis()` runs, view switches after all results return
- `'analysis'` → `'comparison'`: user selects multiple past results to compare
- `'form'` / `'analysis'` → `'history'`: user opens history panel
- Any view → `'form'`: user clicks back/new analysis

**Key state in `App.tsx`:**

| Variable | Type | Purpose |
|---|---|---|
| `view` | `View` | Active screen |
| `ideas` | `ProductIdea[]` | Ideas queued for or returned from analysis |
| `isAnalyzing` | `boolean` | Locks UI during AI call |
| `loadingMsg` | `string` | Progress message shown in `<LoadingState>` |
| `historyItems` | `ProductIdea[]` | Loaded from Firestore or localStorage |
| `showGlossary` | `boolean` | Controls glossary modal |
| `showOnboarding` | `boolean` | Controls first-visit tour |
| `showLogin` | `boolean` | Controls sign-in modal |

**`AuthContext`** (from `AuthProvider.tsx`) is the only React Context used. It is consumed via `useContext(AuthContext)` in components that need user state or auth actions.

---

## Pages

EcoLens renders one of four views at a time, controlled by the `view` state in `App.tsx`. There is no URL change — the app is a single-page state machine.

**Form View (`'form'`)**
- Entry point for every session
- `<IdeaForm>` collects product name, description, category, materials, production location, target market, intended lifespan, and distribution channel
- Supports multiple ideas queued for batch analysis

**Analysis View (`'analysis'`)**
- Activated after `startAnalysis()` completes
- Renders `<AnalysisDashboard>` with the full `SustainabilityAnalysis` result
- Shows overall score, verdict, carbon breakdown, SDG mapping, 6Rs rating, three-pillar scores, improvement suggestions, and citations

**Comparison View (`'comparison'`)**
- Activated from history when user selects multiple ideas
- Renders `<ComparisonDashboard>` with side-by-side scores across all sustainability dimensions

**History View (`'history'`)**
- `<HistoryDashboard>` lists all past analyses
- Supports select-for-comparison, re-open single result, and delete

---

## Components

**`AuthProvider.tsx`**
Wraps the entire app. Manages Firebase auth state, creates Firestore user docs on first login, and exposes `AuthContext` to the component tree.

**`IdeaForm.tsx`**
Controlled form for product idea input. Sends structured `ProductIdea` objects to `App.tsx` for analysis. Supports adding multiple ideas before triggering a batch run.

**`AnalysisDashboard.tsx`**
Primary results view. Renders the full `SustainabilityAnalysis` object returned by Gemini — score gauges, carbon breakdown, SDG table, 6Rs assessment, three-pillar breakdown, improvement list, and cited sources. Includes the PDF export button.

**`ComparisonDashboard.tsx`**
Side-by-side view for two or more analyzed ideas. Useful for comparing material choices, supply chain configurations, or product variants against each other.

**`HistoryDashboard.tsx`**
Browsable list of all past analyses loaded from Firestore or localStorage. Allows users to reopen a single analysis, select multiple for comparison, or delete entries.

**`LoginModal.tsx`**
Minimal modal triggered when an unauthenticated user attempts an action that benefits from persistence. Calls `signIn()` from `AuthContext`.

**`LoadingState.tsx`**
Animated full-screen loading indicator shown during AI analysis. Displays rotating messages from `loadingMsg` state to communicate progress.

**`Glossary.tsx`**
Modal reference for sustainability frameworks used in the analysis — Carbon LCA, UN SDGs, 6Rs of Circularity, and Three Pillars. Helps non-expert users interpret their results.

**`Onboarding.tsx`**
First-visit guided tour. Shown once, controlled by a `ecolens_onboarding` flag in localStorage. No account or API call required.

**`ui/Button.tsx`**
Shared button primitive using `clsx` + `tailwind-merge` for variant composition.

---

## NLP and AI Routing

All AI logic runs through a single function in `src/lib/gemini.ts`:

```ts
analyzeProductIdea(idea: ProductIdea, onProgress?: (msg: string) => void): Promise<SustainabilityAnalysis>
```

**How it works:**

1. A singleton `GoogleGenAI` client is initialized once with `VITE_GEMINI_API_KEY`
2. `analyzeProductIdea` constructs a detailed prompt from the `ProductIdea` fields — product description, materials, supply chain details, intended lifespan, etc.
3. The prompt instructs Gemini to return a structured JSON object matching the `SustainabilityAnalysis` schema exactly — no freeform text
4. Two generation config options are set:
   - `responseMimeType: "application/json"` — enforces structured output at the API level
   - `temperature: 0.2` — reduces hallucination; analysis should be factual, not creative
5. `tools: [{ googleSearch: {} }]` — enables Google Search grounding, so Gemini cites real sources rather than generating unsupported claims
6. The raw response text is parsed with `JSON.parse()` into a typed `SustainabilityAnalysis` object
7. `onProgress` callback fires at key stages, updating `loadingMsg` in `App.tsx` for the loading UI

**There is no NLP preprocessing layer.** The product idea form fields are passed directly to Gemini as structured prompt context — no intent classification, no entity extraction, no routing between models. Gemini handles the full analytical task end-to-end.

---

## Hooks and Utilities

**`src/lib/utils.ts`**

- **`cn(...inputs)`** — composes class names using `clsx` and resolves Tailwind conflicts with `tailwind-merge`. Used across all components for conditional styling.
- **`formatScoreColor(score)`** — returns a text color class based on score thresholds: green (≥80), yellow (≥60), red (<60)
- **`formatScoreBg(score)`** — returns a background color class using the same thresholds
- **`formatScoreBgSubtle(score)`** — lighter background variant for badge-style score displays

**`src/lib/storage.ts`**

Dual-mode persistence layer. Checks `auth.currentUser` on every call to route between Firestore and localStorage:

- **`loadHistory()`** — fetches all ideas for the current user (Firestore) or parses `ecolens_history` from localStorage
- **`saveHistory(ideas)`** — overwrites the full history (localStorage path)
- **`addOrUpdateIdea(idea)`** — upserts a single idea doc to Firestore or updates the localStorage array
- **`deleteIdea(id)`** — removes by ID from Firestore or from the localStorage array

**`src/components/AuthProvider.tsx` — `handleFirestoreError(error, context)`**

Internal utility (not exported) that formats Firestore errors into structured log entries with the operation context, error code, and message. Prevents raw Firebase error objects from surfacing in the UI.

---

## Known Limitations

**No offline support:** Gemini API calls require an active internet connection. There is no caching of AI results or retry logic for failed requests beyond a single attempt.

**No multi-model fallback:** The app is hard-coded to `gemini-3.1-pro-preview`. If the model is deprecated or rate-limited, there is no fallback model configured.

**localStorage cap:** Anonymous users are subject to the browser's localStorage size limit (~5MB). Large numbers of analyses with long AI responses may approach this limit.

**No collaborative features:** Data is strictly user-scoped. There is no sharing, team workspace, or export-to-link functionality.

**No input validation on AI output:** If Gemini returns malformed JSON or a schema mismatch, `JSON.parse()` will throw an unhandled error. There is no Zod or schema validation layer on the AI response before it is used in the UI.

**Single OAuth provider:** Only Google login is supported. Email/password, GitHub, and other providers are not configured.

**No pagination in history:** All past analyses are loaded in a single Firestore query. For users with a large number of analyses, this may become slow and memory-intensive.

**PDF export is client-rendered:** `html2pdf.js` captures the rendered DOM — charts and complex layouts may render inconsistently across browsers and screen sizes.

---

## Setup

```bash
git clone https://github.com/yatinbhalla/EcoLens.git
cd EcoLens
npm install
```

Create a `.env.local` file:

```
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com/)

Set up a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/) — enable Authentication (Google provider) and Firestore.

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Author

Yatin Bhalla
<br>
🛍️ PM & AI builder | Managing retail businesses | PG Product Management @ BITS School of Management
<br>
🔗 [linkedin.com/in/yatin-bhalla-834632238](https://linkedin.com/in/yatin-bhalla-834632238)
