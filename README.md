# Vue 3 Template

A clean, minimal Vue 3 starter template with modern defaults:

- Vue 3 + Composition API
- TypeScript
- Vite
- Vue Router
- Pinia
- Axios with a centralized HTTP client

## Quick Start

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run type-check
npm run build
npm run preview
```

## Environment

Create a `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

## Project Structure

```text
src/
  assets/
  features/
    health/
      api/
  lib/
    api/
  router/
  stores/
  views/
  App.vue
  main.ts
```

## API Layer Best Practice

- Keep HTTP setup in one place: `src/lib/api/httpClient.ts`
- Keep feature-specific API calls in `src/features/<feature>/api/*.ts`
- Do not call APIs directly from many components
- Never expose external API secrets in frontend code

## Notes

- This repository is intended as a reusable frontend starter.
- If you use third-party APIs, keep secrets on the backend side only.
