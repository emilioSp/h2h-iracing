# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Head-to-head overlay for iRacing. Node.js backend service using TypeScript (strict mode, ESM only) with Hono HTTP framework and WebSocket support. Reads real-time racing telemetry via `@emiliosp/node-iracing-sdk`.

## Commands

```bash
npm run dev          # Start dev server with --watch (live reload)
npm start            # Production server
npm run test         # Vitest with coverage (85% minimum)
npm run lint         # Biome check (linting + formatting)
npm run build        # TypeScript type-check only (noEmit)
```

## General Principles

- KISS: Keep It Simple, Stupid. Code must be readable without comments.
- Write code that a human can maintain.
- Solve only the problem at hand. No future-proofing. No Chinese boxes.
- Do not solve problems that you don't have. Don't add features that you don't need. Don't add abstractions that you don't need.
- Avoid comments unless absolutely necessary for clarity.
- Use descriptive variable and function names.

## Communication Rules

- Ask for confirmation on design decisions.
- Ask for clarification when requirements are unclear.
- When in doubt, ask.

## Architecture

Layered architecture with strict separation of concerns:

```
src/
├── router/       # Route handlers, request/response validation with zod, no business logic
├── service/      # Business logic
├── repository/   # External data sources (SDK, APIs, filesystem)
├── schema/       # Zod validation schemas
├── error/        # Custom error classes extending Error
├── config.ts     # Env var validation with zod (fail-fast at startup)
└── server.ts      # Server entry point, used only for wiring up the routes, and starting the server. No business logic
```

Module naming convention: suffix indicates layer (e.g., `user.service.ts`, `user.repository.ts`).

## Path Aliases

Defined in `package.json` `imports` field:
- `#service/*` -> `./src/service/*`
- `#schema/*` -> `./src/schema/*`
- `#error/*` -> `./src/error/*`
- `#config` -> `./src/config.ts`

## Code Style & Conventions

- **ESM only** - CommonJS is forbidden. Use `import`/`export`, never `require`/`module.exports`.
- **`type` over `interface`** for TypeScript types.
- **Zod type inference** for types shared across layers; dedicated types for layer-internal use.
- **Arrow functions** preferred over classes. Classes only when maintaining internal state.
- **Named exports** preferred. Default exports only for app entrypoint, singletons, and db connection.
- **Pure functions** preferred. Functions should do one thing only.
- **Small functions** - when they grow beyond ~40 lines, consider breaking them down.
- **`async/await` always** - never use callbacks. If forced, wrap with `node:util` `promisify`.
- **API responses**: `{ data: T }` for success, `{ error: { code, message } }` for errors.
- **Error handling**: Custom Error classes in `src/error/`, discriminated via `instanceof`.
- **Logging**: `console`-based with `LOG_LEVEL` env var (debug, info, warn, error).
- Run `npm run lint` to check; Biome handles both linting and formatting.

## Testing

- Vitest with 1:1 test file mapping (e.g., `foo.service.ts` -> `foo.service.test.ts`)
- Unit tests only for complex pure functions/algorithms
- Integration tests for feature flows (prefer over unit tests)
- Never mock the DB client - use real test database
- Mock external API calls in integration tests
- Ask before adding new dependencies

## Documentation

The `README.md` must include:

1. What the software does.
2. Prerequisites.
3. Local development setup.
4. Local testing instructions.
5. Deployment instructions (if applicable).