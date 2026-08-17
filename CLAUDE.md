# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Head-to-head overlay for iRacing. Node.js backend service using TypeScript (strict mode, ESM only) with Hono HTTP framework and SSE support. Reads real-time racing telemetry via `@emiliosp/node-iracing-sdk`.

## Commands

```bash
npm run dev          # Start dev server with --watch (live reload)
npm start            # Production server
npm run lint         # Biome check (linting + formatting)
npm run build        # TypeScript type-check only (noEmit)
```

## Workflow

@rules/principles.md
@rules/architecture.md
@rules/typescript.md
@rules/server.md
@rules/frontend.md
@rules/testing.md
@rules/readme.md
@rules/feature-workflow.md
