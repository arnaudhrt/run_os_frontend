# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev          # Start Vite dev server

# Build
pnpm build        # TypeScript check + Vite production build

# Lint
pnpm lint         # Run ESLint

# Preview production build
pnpm preview
```

## Architecture

This is a React 19 + TypeScript frontend using Vite 7 with SWC for fast compilation. Uses pnpm as package manager.

### Tech Stack
- **React 19** with react-router-dom v7 for routing
- **Tailwind CSS v4** with `@tailwindcss/vite` plugin
- **Zustand** for state management
- **Radix UI** primitives for accessible components
- **Tone.js** / `@tonejs/midi` for audio/MIDI functionality

### Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── logs/
│   │   ├── stores/     # Zustand stores (logs.store.ts)
│   │   └── views/      # Page components (LogsPage.tsx)
│   ├── week/views/
│   ├── year/views/
│   └── records/views/
├── lib/
│   ├── ui/             # Reusable UI components (shadcn/ui style)
│   ├── hooks/          # Custom hooks (use-mobile.ts)
│   ├── shared/pages/   # Shared pages (NotFoundPage.tsx)
│   └── utils.ts        # Utility functions (cn for class merging)
├── router.tsx          # Route definitions
├── App.tsx             # Root component with RouterProvider
├── main.tsx            # Entry point
└── index.css           # Tailwind config + CSS custom properties
```

### Conventions

- **Path alias**: Use `@/` to import from `src/` (configured in tsconfig.json and vite.config.ts)
- **Feature organization**: Each feature has its own folder under `src/features/` with `stores/` and `views/` subdirectories
- **Zustand stores**: Named `*.store.ts`, export hooks like `useLogsStore`
- **UI components**: Located in `src/lib/ui/`, follow shadcn/ui patterns with CVA for variants
- **Styling**: Dark-mode first theme using CSS custom properties (HSL format) with Tailwind
- **Class merging**: Use `cn()` utility from `@/lib/utils` for combining Tailwind classes
