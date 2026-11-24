# Project Roadmap: AI Interview System

## Phases

### Phase 1: Authentication & Credential Hardening
- Change "Sign In" text to "Log In" across all UI views.
- Implement strict name validation (no pure numbers, no single letters, min 2 letters).
- Implement strict password validation (min 8 characters, letter, number, special char).
- Add clear error messaging and client/server validation.

### Phase 2: B.Tech Previous Year Questions (PYQ) Hub
- Create dedicated `pyq.html` page and update universal sidebar navigation.
- Curate rich database of B.Tech exam and placement interview PYQs (DSA, OS, DBMS, CN, OOPs, TCS, Infosys, Amazon, etc.).
- Build search, category filter, and one-click download feature.

### Phase 3: AI Interviewer & Generator Integration
- Add backend AI endpoint `/api/ai/generate` and `/api/ai/evaluate` with Gemini API / offline intelligent fallback.
- Enhance `paper-by-ai.html` to allow free-form topic generation and AI answer evaluation.

### Phase 4: Saved Previous Papers Search & Performance Review
- Implement saved papers storage in backend and localStorage.
- Add live search, filter, and paper detail modal on Dashboard and dedicated views.
- Ensure all pages and links are error-free and responsive.
