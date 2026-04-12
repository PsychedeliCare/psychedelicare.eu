# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm generate-types  # Generate Cloudflare worker types (wrangler types)
```

## Architecture

This is an [Astro](https://astro.build) site deployed to **Cloudflare Workers** via the `@astrojs/cloudflare` adapter.

- **SSR mode**: Server-rendered via Cloudflare Workers (`wrangler.jsonc` defines the worker)
- **Content**: MDX supported via `@astrojs/mdx`
- **Sitemap**: Auto-generated via `@astrojs/sitemap`
- **TypeScript**: Strict mode (`astro/tsconfigs/strict`)

Pages live in `src/pages/` using Astro's file-based routing. Worker types (from `wrangler types`) are output to `worker-configuration.d.ts` and included in `tsconfig.json`.

Deployment targets Cloudflare Workers with observability enabled. The `wrangler.jsonc` `name` field must be alphanumeric lowercase with dashes only.
