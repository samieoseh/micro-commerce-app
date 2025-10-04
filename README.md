# Micro Commerce App

A monorepo for a micro-commerce platform consisting of a TypeScript/Express API server and a client application. Use the per-app READMEs to set up, run, and develop each part independently.

## Apps
- [Server (Express + TypeScript + PostgreSQL via Drizzle)](apps/server/README.md)
- [Client](apps/client/README.md)

## Getting Started (monorepo)
- Install dependencies at the root with your package manager (pnpm recommended):
  - pnpm install
- Then follow the instructions in each app’s README to run that app.

## Notes
- This repository uses a workspace-based setup; commands can be filtered to a specific app (e.g., pnpm --filter server dev).
- See each README for environment variables, scripts, and troubleshooting.
