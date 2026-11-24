# AI Powered Personalized Mock Interview & B.Tech PYQ Platform

## Overview
A comprehensive web platform designed for B.Tech engineering students to prepare for technical campus placements and company technical interviews. Features role-based adaptive mock examinations, an AI exam generation and answer evaluation engine, a rich B.Tech Previous Year Questions (PYQ) download and search repository for top tech companies and core subjects, and saved exam history search.

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Modern ES6+ responsive UI)
- **Backend**: Node.js, Express.js
- **Database**: In-memory simulation fallback + MongoDB Compass driver
- **AI Engine**: Generative AI Integration (Gemini / Generative API endpoint + offline intelligent question & evaluation engine fallback)

## Core Capabilities
1. **Robust Authentication & Credential Validation**:
   - Clean "Log In" / "Register" flow (replaces outdated Sign In terminology).
   - Name validation: Rejects numeric-only names and single-alphabet inputs; requires valid student names (≥2 alphabetic chars).
   - Password security: Minimum 8 characters, requiring at least one letter, one number, and one special character.
   - Comprehensive error banners and client/server validation.

2. **B.Tech Interview & Subject PYQ Download Hub**:
   - Comprehensive Previous Year Questions repository for B.Tech students (DSA, OS, DBMS, Computer Networks, OOPs, System Design, Aptitude).
   - Company-wise placement papers (TCS, Infosys, Wipro, Amazon, Google, Accenture, Cognizant).
   - Instant search & filter by subject, topic, and company.
   - One-click instant download as formatted, printable paper files.

3. **AI-Powered Paper Generation & Evaluation Engine**:
   - Dynamic AI mock test generator based on weak topics or custom prompts.
   - Interactive AI technical interviewer evaluation: checks answers, scores responses, and provides constructive feedback.

4. **Saved Previous Papers Search & Performance Analytics**:
   - Search through previously attempted mock papers by subject, role, score, and date.
   - Review complete question-by-question breakdown of past attempts.
   - Student performance analytics, weak area detection, and remediation tracks.
