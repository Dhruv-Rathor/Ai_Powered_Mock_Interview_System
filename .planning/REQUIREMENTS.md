# Project Requirements: AI Interview System & B.Tech PYQ Hub

## 1. Authentication & Security (AUTH)
- **AUTH-1**: User interface updated to "Log In" (replacing old "Sign In").
- **AUTH-2**: Credential validation for Full Name:
  - Must not be purely numerical (e.g., '12345').
  - Must not be a single alphabet (e.g., 'A').
  - Must contain at least 2 alphabetic characters.
- **AUTH-3**: Credential validation for Password:
  - Minimum 8 characters.
  - At least one alphabet character (`[a-zA-Z]`).
  - At least one numeric character (`[0-9]`).
  - At least one special character (`[!@#$%^&*(),.?":{}|<>_\-+=]`).
- **AUTH-4**: User-friendly real-time hints and inline error alerts on both frontend and backend (`/api/auth/login`, `/api/auth/register`).

## 2. B.Tech PYQ Download & Search Repository (PYQ)
- **PYQ-1**: Dedicated PYQ Hub accessible from sidebar navigation.
- **PYQ-2**: Authentic B.Tech interview and exam question papers for core CS/IT subjects:
  - Data Structures & Algorithms (DSA)
  - Operating Systems (OS)
  - Database Management Systems (DBMS)
  - Computer Networks (CN)
  - Object-Oriented Programming (Java/C++)
  - Campus Placement Papers (TCS, Infosys, Wipro, Amazon, Cognizant, Accenture)
- **PYQ-3**: Live interactive search and filter by Subject, Company, and Year.
- **PYQ-4**: Direct one-click download of question papers (clean formatted document for printing and offline study).

## 3. AI Mock Interview & Generation Engine (AI)
- **AI-1**: AI question generation for selected job roles and specific student weak topics.
- **AI-2**: AI Interviewer evaluation mode: evaluates open-ended or technical answers with instant feedback, scoring, and corrections.
- **AI-3**: Gemini / REST endpoint integration with fallback offline intelligent generation engine so it never crashes if API key is not supplied.

## 4. Saved Papers Search & Review (SAVED)
- **SAVED-1**: Persistent saving of all taken mock exams into LocalStorage and backend storage.
- **SAVED-2**: Search and filter past papers by role, date, score range, or keyword.
- **SAVED-3**: Detailed modal / view to inspect previous paper questions, answers, and mistakes.
- **SAVED-4**: Seamless integration with dashboard KPIs and weak topic recalculation.
