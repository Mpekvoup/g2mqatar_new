# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a business consulting website for G2M International Consulting - Qatar Business Gateway. The main application is located in `g2mqatar_new/` and is built with React 19, TypeScript, Vite, and Tailwind CSS 4. The site features server-side rendering (SSR) for SEO optimization and supports bilingual content (English/Russian).

## Core Architecture

### Application Structure

- **Entry Points:**
  - `index.tsx` - Client-side entry point that mounts the React app with BrowserRouter
  - `src/entry-server.tsx` - Server-side rendering entry point using StaticRouter
  - `App.tsx` - Main application component with routing configuration

- **Routing:**
  - Home page (`/`) - Multi-section landing page with all business services
  - Case studies list (`/case-studies`) - Portfolio showcase
  - Case study detail (`/case-studies/:slug`) - Individual case study pages
  - Legal pages (`/privacy`, `/terms`)
  - 404 handler

- **Component Organization:**
  - All React components live in `components/` directory (NOT `src/components/`)
  - Components are co-located with the main app files at root level
  - Major components: Header, Hero, Services, Team, ContactForm, CaseStudies, etc.

- **Data Layer:**
  - `constants.tsx` - Static content configuration (services, navigation, partners, clients)
  - `caseStudiesData.ts` - Case study portfolio data
  - `types.ts` - TypeScript type definitions
  - All content is bilingual with `{ en: string, ru: string }` structure

### Build System

- **Development:** Vite dev server on port 3000
- **Production Build Process:**
  1. Client build: `vite build`
  2. SSR build: `vite build --ssr src/entry-server.tsx --outDir dist-server`
  3. Pre-rendering: `node scripts/prerender.mjs` - Generates static HTML for all routes
  4. Cleanup: Removes `dist-server` after pre-rendering

- **Pre-rendering:**
  - `scripts/prerender.mjs` generates static HTML for SEO
  - Routes to pre-render are hardcoded in the script
  - **IMPORTANT:** When adding new routes or case studies, update the `ROUTES` array in `prerender.mjs`

### Styling

- Tailwind CSS 4 via `@tailwindcss/vite` plugin
- Custom brand colors defined in `index.css` (qatar-maroon, etc.)
- Mobile-first responsive design
- Custom fonts and CSS variables for theming

### Path Aliases

- `@/*` maps to project root (configured in both vite.config.ts and tsconfig.json)
- Allows imports like `@/components/Header` or `@/types`

## Common Development Commands

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Full production build (client + SSR + pre-rendering)
npm run build

# Client-only build (no SSR)
npm run build:client

# Preview production build
npm run preview

# Start production server (requires 'serve' package)
npm run start
```

## Key Development Patterns

### Adding New Content

1. **New Service:** Add to `SERVICES` array in `constants.tsx` with bilingual content
2. **New Case Study:**
   - Add to `CASE_STUDIES` array in `caseStudiesData.ts`
   - Update `ROUTES` array in `scripts/prerender.mjs` with new slug
   - Follow the slug pattern: `/case-studies/{slug}`
3. **New Route:**
   - Add route to `App.tsx`
   - Update `scripts/prerender.mjs` ROUTES array for SSR
   - Ensure Header component is included for language toggle

### Language Support

- All user-facing text uses the `Language` type (`'en' | 'ru'`)
- Content objects use `{ en: string, ru: string }` pattern
- Language state is managed at App level and passed down via props
- Language toggle lives in Header component

### Email Integration

- Contact form uses EmailJS (@emailjs/browser)
- Configuration via `.env.local` (see `.env.example`)
- Form is in `components/ContactForm.tsx`

### Asset Management

- Static assets in `public/` directory (served at root)
- Component-specific assets in `src/assets/`
- Client logos stored in `src/assets/clients/`
- Partner logos in `public/images/partners/`

## Build Configuration Details

### Vite Configuration

- React plugin with fast refresh enabled
- Tailwind CSS 4 via official Vite plugin
- Code splitting: separate chunks for React core and react-router
- SSR support with `noExternal` config for react-router packages
- Development server accessible on network (host: '0.0.0.0')
- Preview server configured with production domain allowlist

### TypeScript Configuration

- Target: ES2022 with ESNext modules
- JSX: react-jsx (no import React needed)
- Experimental decorators enabled
- Module resolution: bundler
- Path aliases configured to match Vite

## Deployment Notes

- The application is configured for Railway deployment (see `railway.json`)
- Preview server has allowed hosts configured for production domains
- Static file serving via `serve` package with custom config (`serve.json`)
- SSR pre-rendering ensures all pages are SEO-friendly out of the box

## Important Development Constraints

1. **Component Location:** Components are NOT in `src/components/`, they're in root-level `components/`
2. **Pre-rendering:** Always update `scripts/prerender.mjs` when adding routes
3. **Bilingual Content:** All new content must include both English and Russian versions
4. **Build Process:** Full build includes three steps - don't skip the SSR build or pre-rendering
5. **Asset Imports:** WebP images are used for optimization - maintain this pattern
6. **TypeScript Strictness:** `allowImportingTsExtensions` is enabled, use `.tsx` extensions in imports when needed
