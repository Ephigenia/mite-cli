# GitHub Copilot Instructions for mite-cli

## Project Overview

**mite-cli** is a Node.js command-line tool for interacting with the [mite.de](https://mite.de) time-tracking REST API. It is published as an npm package and targets Node.js ≥20 (CI runs on Node 22).

## Repository Layout

```
source/                    # All application source files (flat, no subdirectory for commands)
  mite-*.js                # One file per CLI command (e.g. mite-list.js, mite-customers.js)
  mite.js                  # Main entry point / Commander root
  config.js                # nconf-based configuration (API key, account name)
  lib/
    mite-api.js            # mite-api client factory
    formater.js            # Output formatting helpers
    data-output.js         # Table/JSON/CSV output logic
    errors.js              # Shared error types
    commands/              # Shared command helpers (list, customers, projects, services, users)
    auto-complete/         # Shell tab-completion support
.github/
  workflows/               # GitHub Actions CI/CD
  copilot-instructions.md  # This file
AGENTS.md                  # Full AI agent persona definitions (see below)
```

## Key Dependencies

| Package | Purpose |
|---|---|
| `commander` | CLI framework — all commands use Commander.js |
| `mite-api` | npm client for the mite.de REST API |
| `nconf` | Config storage (API key, account name, stored in `~/.mite`) |
| `inquirer` | Interactive prompts |
| `table` | Tabular output in the terminal |
| `ansi-colors` | Terminal color output |
| `node-fetch` | HTTP requests for API calls not covered by mite-api |

## Coding Conventions

- **Commands:** Each CLI command lives in `source/mite-<name>.js`. Use `commander` `.command()`, `.description()`, `.option()`, and `.action()`.
- **Flag naming:** Use existing patterns — `--format` (json/csv/table), `--columns`, `--sort`, `--order`, `--limit`, `--note`, `--duration`.
- **Output:** Use `source/lib/data-output.js` for table/JSON/CSV rendering. Use `ansi-colors` for colored status messages.
- **Error handling:** Throw or propagate errors using types from `source/lib/errors.js`. Print actionable messages to stderr.
- **Config:** Read API credentials via `source/config.js` (nconf). Never hard-code credentials.
- **API calls:** Use the `mite-api` client from `source/lib/mite-api.js`. For endpoints not in the SDK, use `node-fetch` with the stored API key.
- **Commits:** Follow [Angular conventional commit format](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`. This drives semantic-release versioning.

## Testing

- **Framework:** Mocha + Chai. Test files are colocated (e.g. `source/lib/formater.test.js`) or in `source/test/`.
- **Coverage:** NYC (Istanbul). Run `npm test` to execute tests with coverage.
- **Rule:** Never hit the live mite API in tests. Mock all `mite-api` responses.
- **Watch mode:** `npm run tdd` for test-driven development.

## Release

- **Tool:** semantic-release. A `feat:` commit triggers a minor release; `fix:` triggers a patch.
- **Branches:** Releases are cut from the default branch.
- **Do not** manually edit `CHANGELOG.md` — it is auto-generated.

## AI Agent Roles (summary)

Full definitions and prompt templates are in [`AGENTS.md`](../AGENTS.md). Use these role hints as a shorthand:

- **`@cli-architect`** — Command structure, Commander.js patterns, flag/UX design
- **`@api-integrator`** — mite-api SDK usage, pagination, error handling, auth
- **`@testing-qa`** — Mocha/Chai test writing, mocking, NYC coverage
- **`@doc-engineer`** — README updates, `--help` text, JSDoc, CONTRIBUTING
- **`@release-devops`** — semantic-release, GitHub Actions workflows, Node.js compatibility
