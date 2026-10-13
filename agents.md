# CLAUDE.md

This file provides context and guidance for Claude when interacting with this repository.

---

## 1. Project Overview

* **Project Name:** SKS
* **Description:** Mental Health hell yeah
* **Core Tech Stack:** 
    * **Frontend:**
        * React
        * Tailwindcss
    * **Backend:**
        * ExpressJS
        * NodeJS
        * Typescript
        * Supabase

---

## 2. Common Commands

Always run shell commands from the project root directory.

### Build & Run
* **Install dependencies:** `npm install` || `yarn get` || `yarn workspace <workspaceName> get`
* **Start dev server:** `npm run dev` || `yarn run dev` || `yarn workspace <workspaceName> run dev`
* **Production build:** `npm run build`

---

## 3. Code Style & Architecture Guidelines

### Folder Structure
* **Frontend**
  - `./my-app` - Frontend File
  - `./my-app/index.html` - html file
  - `./my-app/src` - Frontend source code
  - `./my-app/src/app` - we use layered system design so every pages and its service belong here 
  - `./my-app/src/lib` - reuseable logic component
  - `./my-app/src/hooks` - Custom react hooks
  - `./my-app/src/main` - Mainpages
  - `./my-app/src/styles` - Global css files
  - `./my-app/src/components/` - Reusable UI components.
  - `./my-app/src/App.tsx` - Entry point for react
  - `./my-app/src/main.tsx` - Entry point for script
* **Backend**
  - `./backend/` - Backend File
  - `./backend/src` 
  - `./backend/src/app` - layered service here (repository, services, and controllers for each services)
  - `./backend/src/config`
  - `./backend/src/config/config.ts`
  - `./backend/src/database`
  - `./backend/src/database/supabase.ts`
  - `./backend/src/middlewares`
  - `./backend/src/middlewares/auth.ts`
  - `./backend/src/middlewares/login_prison.ts`
  - `./backend/src/middlewares/rate_limiter.ts`
  - `./backend/src/middlewares/request_sanitation.ts`
  - `./backend/src/middlewares/validate.ts`
  - `./backend/src/error`
  - `./backend/src/models`
  - `./backend/src/models/education.ts`
  - `./backend/src/models/ph9.ts`
  - `./backend/src/models/quest.ts`
  - `./backend/src/models/streak.ts`
  - `./backend/src/models/token.ts`
  - `./backend/src/models/user.ts`
  - `./backend/src/services`
  - `./backend/src/services/migrator.ts`
  - `./backend/src/services/rbac.ts`
  - `./backend/src/services/logger.ts`
  - `./backend/src/services/jwt.ts`
  - `./backend/src/server`
  - `./backend/src/server/server.ts`
  - `./backend/src/server/routes.ts`
  - `./backend/src/types`
  - `./backend/src/types/express.d.ts`
  - `./backend/src/utils`

### Coding Conventions
* **Frontend**
  * **Language:** TypeScript (Strict mode enabled; avoid using `any`).
  * **Naming Conventions:**
    * Components & Interfaces: `PascalCase` (e.g., `UserProfile.tsx`, `UserProps`)
    * Functions & Variables: `camelCase` (e.g., `getUserData`, `isLoggedIn`)
    * Constants / Environment Variables: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`)
    * Files / Directories: `lower_snake_case`
  * **Exports:** Prefer named exports over default exports.
  * **Component Pattern:** Functional components with React hooks. Keep components focused on presentational logic where possible.
* **Backend**
* **Language:** TypeScript (Strict mode enabled; avoid using `any`).
  * **Naming Conventions:**
    * Components & Interfaces: `PascalCase` (e.g., `UserProfile.tsx`, `UserProps`)
    * Functions & Variables: `camelCase` (e.g., `getUserData`, `isLoggedIn`)
    * Constants / Environment Variables: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`)
    * Files / Directories: `point.case` and `lower_snake_case`.
  * **Exports:** Prefer named exports over default exports.

---

## 4. Workflows & Best Practices

* **Error Handling:** Wrap asynchronous code in `try/catch` blocks and use standard custom error classes or helper utilities.
* **State Management:** Keep state local whenever possible; lift state up only when shared across distinct components.
* **Imports:** Group imports by:
  1. External libraries / packages
  2. Internal components / modules
  3. Utilities and hooks
  4. Types and assets

---

## 5. Important Constraints & Gotchas

* **Environment Variables:** Never commit secrets or API keys. Access via process environment wrappers.
* **Do Not Modify:** Avoid manually editing auto-generated files (e.g., `build/`, `dist/`, generated API client files).
* **Performance:** Ensure heavy computations are memoized (`useMemo` / `useCallback`) when necessary.