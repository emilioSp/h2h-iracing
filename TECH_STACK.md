# Tech Stack

This document describes technologies used in the current repository, including development tools. It does not introduce new mandatory technology constraints. Future UI
work in the [roadmap](ROADMAP.md) is not yet implemented.

## Application

| Technology                   | Role                                                                                                                         | Evidence                                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Node.js                      | Runs the local backend and TypeScript source with native type stripping. Development and packaging currently select 24.14.1. | [.nvmrc](.nvmrc), [package scripts](package.json), [packager](scripts/package.ts)              |
| TypeScript                   | Application language with strict checking, ESM, and erasable TypeScript syntax.                                              | [compiler configuration](tsconfig.json), [package manifest](package.json)                      |
| `@emiliosp/node-iracing-sdk` | Reads live iRacing telemetry on Windows; loads binary dumps for development without the simulator.                           | [SDK repository](src/server/repository/irsdk.repository.ts)                                    |
| Hono and `@hono/node-server` | Serve local HTTP routes, built dashboard pages, and SSE connections.                                                         | [server](src/server/server.ts), [H2H router](src/server/router/h2h.router.ts)                  |
| Server-Sent Events (SSE)     | Push dashboard payloads from the backend to subscribed browser overlays.                                                     | [broadcaster](src/server/broadcaster.ts)                                                       |
| React and React DOM          | Render the browser dashboards and update them from SSE messages.                                                             | [H2H application](src/h2h-dashboard/src/App.tsx), [entrypoint](src/h2h-dashboard/src/main.tsx) |
| Tailwind CSS                 | Styles dashboards and the project website.                                                                                   | [Vite configuration](vite.h2h.config.ts), [site stylesheet](site/_css/site.css)                |
| Lucide React                 | Supplies dashboard icons.                                                                                                    | [car dashboard](src/car-dashboard/src/App.tsx)                                                 |
| Zod                          | Defines dashboard schemas and validates telemetry test fixtures.                                                             | [schemas](src/schema), [fixture mock](src/server/repository/irsdk-mock.ts)                     |

The server currently binds to `127.0.0.1`. SimHub and OBS are existing hosts for the browser overlays, not backend dependencies. See [architecture](docs/architecture.md)
and [usage](README.md).

## Development and distribution

| Technology                              | Role                                                                                                                                                                                 | Evidence                                                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| npm                                     | Dependency management and project commands.                                                                                                                                          | [manifest](package.json), [lockfile](package-lock.json)                                             |
| Vite and its React and Tailwind plugins | Develop and build each browser dashboard.                                                                                                                                            | [H2H Vite configuration](vite.h2h.config.ts), [package scripts](package.json)                       |
| TypeScript compiler                     | Checks source types without emitting JavaScript through `npm run typecheck`.                                                                                                         | [compiler configuration](tsconfig.json), [package scripts](package.json)                            |
| Vitest and V8 coverage                  | Run tests and enforce coverage thresholds. Fixture-backed `IRSDKMock` is selected with `NODE_ENV=test`; development dump mode is separate.                                           | [test configuration](vitest.config.ts), [SDK repository](src/server/repository/irsdk.repository.ts) |
| Playwright and Chromium                 | Run real-browser tests for all six overlays against one dump-backed development server, checking displayed telemetry and screenshot baselines.                                       | [browser test configuration](playwright.config.ts), [browser tests](tests/e2e)                      |
| Oxfmt                                   | Formats repository files through `npm run fmt`.                                                                                                                                      | [formatter configuration](.oxfmtrc.json), [package scripts](package.json)                           |
| Oxlint and `oxlint-anti-slop`           | Check and automatically fix configured lint rules through `npm run lint`.                                                                                                            | [lint configuration](.oxlintrc.json), [package scripts](package.json)                               |
| Eleventy and Tailwind CLI               | Build the static project website.                                                                                                                                                    | [Eleventy configuration](eleventy.config.js), [package scripts](package.json)                       |
| `@yao-pkg/pkg` and resedit              | Build the Windows launcher and embed its icon and version metadata. The distribution also includes a separate Node.js runtime, server source, browser assets, and SimHub dashboards. | [packager](scripts/package.ts), [launcher](scripts/launcher.cjs)                                    |
| GitHub Actions                          | Runs project checks on pull requests and builds/deploys the website.                                                                                                                 | [CI workflow](.github/workflows/ci.yml), [site workflow](.github/workflows/site.yml)                |

`npm run check` runs type checking, formatting, linting, and tests. Formatting and linting can modify files.

Exact dependency versions are maintained in the manifest and lockfile rather than repeated here. Biome remains declared in the manifest, but the current formatting and
lint scripts use Oxfmt and Oxlint.
