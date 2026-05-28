# AI Customer Service Vue Project

This is the frontend of an AI-powered customer service system built with Vue 3, TypeScript, and Vite. It features a conversational interface where AI can execute business operations based on user intent.

## Project Overview

- **Purpose**: A modern, interactive AI customer service platform.
- **Main Technologies**:
  - **Framework**: Vue 3 (Composition API)
  - **Language**: TypeScript
  - **Build Tool**: Vite
  - **State Management**: Pinia
  - **Routing**: Vue Router
  - **Styling**: UnoCSS (Atomic CSS)
  - **HTTP Client**: Axios
  - **Markdown Parsing**: Marked & DOMPurify

## Building and Running

### Development
```bash
npm run dev
```
Starts the Vite development server with host access enabled.

### Production Build
```bash
npm run build
```
Runs `vue-tsc` for type checking followed by `vite build`.

### Preview Build
```bash
npm run preview
```
Previews the locally built production version.

## Project Structure

- `src/api/`: API interface definitions using Axios. Includes DTO interfaces for requests and responses.
- `src/components/`: Reusable Vue components (e.g., `ConfirmModal.vue`, `Navbar.vue`).
- `src/stores/`: Pinia state management using the Setup Store pattern.
- `src/views/`: Page-level components.
- `src/types/`: Centralized TypeScript type definitions for API responses, user models, etc.
- `src/utils/`: Utility functions, including a centralized `http.ts` with interceptors for token management.
- `src/constants/`: Application-wide constants.

## Development Conventions

### Script Setup & TypeScript
- Always use `<script setup lang="ts">` in Vue components.
- Maintain strict typing using interfaces defined in `src/types/` or locally in API files.

### Styling (UnoCSS)
- Use UnoCSS utility classes for styling.
- Check `uno.config.ts` for safelisted icons (mostly `i-carbon-*`).
- Prefer atomic CSS over custom CSS unless complex animations are required (see `HomeView.vue` for animation examples).

### API Pattern
- Define API calls in `src/api/` using the `authApi` object pattern seen in `auth.ts`.
- Use JSDoc comments to document API methods and parameters.
- Handle authentication via the `Authorization: Bearer <token>` header, managed automatically by `src/utils/http.ts`.

### State Management
- Use Pinia Setup Stores (using `ref`, `computed`, and `function`).
- Persist critical state (like `token` and `user`) to `localStorage` within the store's actions.

### Routing & Guards
- Defined in `src/router/index.ts`.
- Implement navigation guards for protected routes (e.g., `/chat`, `/profile`).

## Environment Configuration
- Uses `.env.development` and `.env.production`.
- `VITE_API_BASE_URL` defines the backend endpoint.
