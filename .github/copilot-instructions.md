# Copilot Instructions for mcp-test

## Project Overview

This is a **TypeScript Node.js project** in early development, set up as an Express-based backend service with Google Cloud logging integration. The codebase is minimal but has infrastructure for a production-grade service.

## Architecture

- **Entry Point**: `src/index.ts` → compiles to `lib/index.js`
- **Build Output**: `lib/` (debug builds with source maps), `dist/` (production builds)
- **Runtime**: Node.js with CommonJS modules (ES2018 target)

## Build & Development Commands

```bash
npm run debugbuild    # TypeScript compile with source maps → lib/
npm run deploybuild   # TypeScript compile → dist/
npm run lint          # ESLint check on src/
```

### Debugging in VS Code
1. Press F5 to launch "LOCAL" configuration
2. This automatically runs `debugbuild` task first, then starts debugger
3. Requires `SECRETSPATH` environment variable pointing to credentials directory

## Code Conventions

### TypeScript Rules (from `.eslintrc.js`)
- `@typescript-eslint/no-explicit-any`: **allowed** - use `any` when needed
- `@typescript-eslint/no-non-null-assertion`: **allowed** - `!` assertions permitted
- `@typescript-eslint/no-shadow`: **warn** - avoid variable shadowing
- Strict mode enabled - handle null/undefined explicitly

### Dependencies Pattern
The project uses specific libraries for:
- **HTTP**: Express 5.x with CORS
- **Logging**: Bunyan with Google Cloud Logging integration (`@google-cloud/logging-bunyan`)
- **Validation**: validatorjs
- **Database**: MySQL (raw driver, not ORM)
- **Config**: js-yaml for YAML configuration files
- **HTTP Client**: Axios for external API calls

## File Structure Conventions

```
src/
  index.ts              # Express app entry point (middleware, route mounting)
  config/
    database.ts         # MySQL connection pool configuration
  controllers/
    *Controller.ts      # Request handlers (business logic)
  routes/
    *Routes.ts          # Route definitions (URL → controller mapping)
  repositories/
    *Repository.ts      # Data access layer (one per table/entity)
lib/                    # Debug build output (gitignored)
dist/                   # Production build output (gitignored)
.vscode/                # VS Code debug and task configurations
```

## Router → Controller Pattern

Use layered architecture for all endpoints:
- **Routes** (`src/routes/`): Define URL paths and HTTP methods, delegate to controllers
- **Controllers** (`src/controllers/`): Handle request/response, call repositories
- **Repositories** (`src/repositories/`): Database queries only

```typescript
// src/routes/contextRoutes.ts
import { Router } from "express";
import { fetchContext } from "../controllers/contextController";

const router = Router();
router.get("/fetch-context", fetchContext);
export default router;

// src/controllers/contextController.ts
import { Request, Response } from "express";
import { getAllContexts } from "../repositories/contextRepository";

export async function fetchContext(_req: Request, res: Response): Promise<void> {
    const contexts = await getAllContexts();
    res.json({ success: true, data: contexts });
}
```

## Database Access Pattern

Use the **Repository Pattern** for all database operations:
- Connection pool configured in `src/config/database.ts`
- Each table gets a repository file in `src/repositories/`
- Use the `query<T>()` helper for type-safe queries with parameterized SQL

```typescript
// Example: src/repositories/contextRepository.ts
import { query } from "../config/database";

export interface Context {
    context_id_no: number;
    context_desc: string | null;
}

export async function getAllContexts(): Promise<Context[]> {
    return query<Context[]>("SELECT context_id_no, context_desc FROM context");
}
```

## Environment Variables

- `GOOGLE_APPLICATION_CREDENTIALS`: Path to GCP service account JSON
- `WORKING_DIR`: Working directory for file operations (default: `./tmp`)
- `DB_HOST`: MySQL host (default: `localhost`)
- `DB_USER`: MySQL username (default: `root`)
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: Database name (default: `mcp_test`)
- `DB_CONNECTION_LIMIT`: Pool size (default: `10`)
- `PORT`: Server port (default: `3000`)

## Key Patterns to Follow

1. **New source files** go in `src/` with `.ts` extension
2. **Imports** use CommonJS style due to `esModuleInterop: true`
3. **Type definitions** are available for all dependencies via `@types/*` packages
4. **Logging** should use Bunyan logger (not console.log in production code)
