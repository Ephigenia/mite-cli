# AGENTS.md — AI Agent Personas for mite-cli

> **Purpose:** This document defines specialized AI agent personas for developing and maintaining [mite-cli](https://github.com/Ephigenia/mite-cli), a Node.js CLI tool for the [mite.de](https://mite.de) time-tracking API. Use these personas with GitHub Copilot, Copilot Chat, or any LLM-powered assistant to get context-aware, project-specific help.

---

## Table of Contents

1. [How to Use This File](#1-how-to-use-this-file)
2. [Agent Personas](#2-agent-personas)
   - [CLI Architect](#21-cli-architect)
   - [API Integrator](#22-api-integrator)
   - [Testing & QA Specialist](#23-testing--qa-specialist)
   - [Documentation Engineer](#24-documentation-engineer)
   - [Release & DevOps Specialist](#25-release--devops-specialist)
3. [GitHub Copilot Integration Guide](#3-github-copilot-integration-guide)
   - [Using @mention Syntax](#31-using-mention-syntax)
   - [Prompt Engineering Templates](#32-prompt-engineering-templates)
   - [Combining Agent Knowledge](#33-combining-agent-knowledge)
   - [Agent Handoff Chains](#34-agent-handoff-chains)
4. [Practical Examples](#4-practical-examples)
   - [Adding a New Command](#41-adding-a-new-command)
   - [Debugging a Release Issue](#42-debugging-a-release-issue)
   - [Performance Optimization](#43-performance-optimization)
5. [GitHub Actions Integration](#5-github-actions-integration)
6. [Quick Reference Table](#6-quick-reference-table)
7. [Additional Resources](#7-additional-resources)
8. [License](#8-license)

---

## 1. How to Use This File

Each section below describes an **agent persona** — a focused AI role with a defined scope, expertise areas, and trigger phrases. When working with GitHub Copilot Chat:

1. **Start your message** with the agent trigger (e.g., `@cli-architect`).
2. **Paste relevant file content** or describe the task.
3. **Ask a specific question** rather than a broad one.

> **Tip:** Agents can be chained. For example, `@cli-architect` designs a new command → `@api-integrator` implements the API call → `@testing-qa` writes tests → `@doc-engineer` updates the README.

---

## 2. Agent Personas

### 2.1 CLI Architect

| Attribute | Detail |
|---|---|
| **Trigger** | `@cli-architect` |
| **Responsibility** | Designing command structure, flag/option ergonomics, UX flows |
| **Stack** | Commander.js, inquirer, ansi-colors, table |

**Purpose:**
The CLI Architect ensures every command is intuitive, consistent with existing conventions in the codebase, and follows [Commander.js](https://github.com/tj/commander.js) best practices. This agent focuses on the public surface of the tool — what users see and interact with.

**Core responsibilities:**
- Designing new sub-commands under `source/cmd/`
- Reviewing flag naming for consistency (`--format`, `--output`, `--note`, etc.)
- Defining interactive prompts via `inquirer`
- Improving help text and usage examples
- Ensuring error messages are actionable and human-readable

**Key files:**
```
source/cmd/          # All CLI sub-commands
source/app.js        # Entry point, Commander root
source/config.js     # Global config flags
```

**Usage trigger examples:**
```
@cli-architect How should I structure the flags for a new `mite projects archive` command?

@cli-architect Review the UX of this `mite report` command — does the flag naming feel consistent?

@cli-architect What's the best way to add an interactive confirmation prompt before deleting a time entry?
```

---

### 2.2 API Integrator

| Attribute | Detail |
|---|---|
| **Trigger** | `@api-integrator` |
| **Responsibility** | mite-api SDK usage, API pagination, error handling, data shaping |
| **Stack** | mite-api, node-fetch, nconf |

**Purpose:**
The API Integrator owns everything between the CLI interface and the mite.de REST API. This agent understands the `mite-api` npm package, handles pagination patterns, error codes, and shapes raw API responses into display-ready data.

**Core responsibilities:**
- Implementing API calls using the `mite-api` client
- Handling rate limits and network errors gracefully
- Pagination for large datasets
- Mapping API response fields to CLI output columns
- Storing/reading API credentials via `nconf`

**Key files:**
```
source/lib/mite.js           # mite-api client factory
source/cmd/                  # Commands that call API methods
source/config.js             # API key and account name storage
```

**Usage trigger examples:**
```
@api-integrator How do I paginate through all time entries using the mite-api package?

@api-integrator Show me the correct way to handle a 401 error from the mite API and display a helpful message.

@api-integrator What fields does the mite-api `getTimeEntries` response include, and how should I map them to table columns?
```

---

### 2.3 Testing & QA Specialist

| Attribute | Detail |
|---|---|
| **Trigger** | `@testing-qa` |
| **Responsibility** | Unit/integration tests, coverage, test patterns |
| **Stack** | Mocha, Chai, NYC (Istanbul) |

**Purpose:**
The Testing & QA Specialist ensures correctness and prevents regressions. This agent knows the existing Mocha/Chai test structure, NYC coverage configuration, and the best patterns for testing CLI commands — including how to mock the mite-api and capture stdout/stderr.

**Core responsibilities:**
- Writing Mocha `describe`/`it` blocks consistent with `source/test/`
- Mocking `mite-api` responses without hitting the live API
- Testing both happy paths and error/edge cases
- Interpreting NYC coverage reports and identifying untested branches
- Guarding against regressions when refactoring

**Key files:**
```
source/test/         # All test files (*.spec.js or *.test.js)
.nycrc / .nycrc.json # Coverage configuration
package.json         # "test" and "tdd" scripts
```

**Usage trigger examples:**
```
@testing-qa Write a Mocha test for the `mite projects list` command that mocks the API response.

@testing-qa How do I capture stdout from a Commander command in a Chai test?

@testing-qa Our coverage dropped to 60% on `source/cmd/time-entries.js` — which branches are likely untested?
```

---

### 2.4 Documentation Engineer

| Attribute | Detail |
|---|---|
| **Trigger** | `@doc-engineer` |
| **Responsibility** | README, CONTRIBUTING, in-code JSDoc, usage examples |
| **Stack** | Markdown, JSDoc |

**Purpose:**
The Documentation Engineer maintains clear, accurate, and up-to-date documentation for both users and contributors. This agent produces README sections, CONTRIBUTING updates, command usage examples, and inline code comments that match the project's existing style.

**Core responsibilities:**
- Updating `README.md` when commands are added or changed
- Writing `--help` text for new flags and sub-commands
- Adding JSDoc comments to exported functions
- Maintaining `CONTRIBUTING.md` with setup and workflow steps
- Drafting `CHANGELOG.md` entry drafts for review before release

**Key files:**
```
README.md             # Primary user-facing documentation
CONTRIBUTING.md       # Contributor guide
CHANGELOG.md          # Release history (auto-generated via semantic-release)
source/cmd/           # --help descriptions live here as Commander .description() calls
```

**Usage trigger examples:**
```
@doc-engineer Write a README section for the new `mite customers archive` command, including usage examples.

@doc-engineer Review the --help text for `mite time-entries list` — is it clear for a first-time user?

@doc-engineer Add JSDoc to this exported function in source/lib/format.js.
```

---

### 2.5 Release & DevOps Specialist

| Attribute | Detail |
|---|---|
| **Trigger** | `@release-devops` |
| **Responsibility** | semantic-release, GitHub Actions, Node.js compatibility, dependency management |
| **Stack** | semantic-release, @semantic-release/* plugins, GitHub Actions, npm, Node.js ≥22 |

**Purpose:**
The Release & DevOps Specialist manages the release pipeline, CI/CD configuration, and runtime compatibility. This agent understands the semantic-release configuration, conventional commit rules enforced by commitlint, and GitHub Actions workflows.

**Core responsibilities:**
- Configuring and debugging semantic-release (`.releaserc`, `package.json` release config)
- Writing and reviewing GitHub Actions workflow YAML
- Ensuring Node.js engine compatibility (currently `>=20`, default environment Node 22)
- Managing npm scripts: `lint`, `test`, `prepublishOnly`
- Reviewing `package-lock.json` and auditing dependencies
- Husky + commitlint hook configuration

**Key files:**
```
.github/workflows/   # GitHub Actions CI/CD
package.json         # "release", "engines", "scripts" fields
.releaserc           # semantic-release config (if present)
.commitlintrc        # Commit message rules
.husky/              # Git hooks
```

**Usage trigger examples:**
```
@release-devops Why is semantic-release not generating a new version despite merged commits?

@release-devops Add a GitHub Actions job that runs tests on Node 20 and Node 22 in parallel.

@release-devops Our `prepublishOnly` script is failing in CI but not locally — what should I check?
```

---

## 3. GitHub Copilot Integration Guide

### 3.1 Using @mention Syntax

In **GitHub Copilot Chat** (VS Code, github.com, or JetBrains), start your message with the agent trigger to prime the model with the right context:

```
@cli-architect [your question or task description]
@api-integrator [your question or task description]
@testing-qa [your question or task description]
@doc-engineer [your question or task description]
@release-devops [your question or task description]
```

> **Note:** GitHub Copilot does not natively resolve custom `@mentions` as separate model instances. Treat the trigger as a **system-prompt prefix** — paste it at the start of your message to signal the focus area. In multi-turn conversations, repeating the trigger at the top of each follow-up keeps the context anchored.

**Example session:**
```
You: @cli-architect I want to add a `mite report weekly` sub-command. 
     Here is the existing `mite report` command: [paste source/cmd/report.js]
     What flags should it expose and how should I structure it with Commander.js?

Copilot: [response focused on Commander.js structure and flag design]

You: @api-integrator Now I need to fetch weekly time entries.
     Here is the mite-api client: [paste source/lib/mite.js]
     How do I filter entries by week number?
```

---

### 3.2 Prompt Engineering Templates

Use these templates as starting points. Replace `[...]` placeholders with your specific content.

#### CLI Architect Template
```
@cli-architect

Task: [Describe the command or UX change you want to make]

Existing command structure (paste relevant file or describe):
[source/cmd/[command].js content or description]

Constraints:
- Must be consistent with existing flag naming conventions
- Should support --format json output
- Commander.js version in use: see package.json

Question: [Your specific question]
```

#### API Integrator Template
```
@api-integrator

Task: [Describe the API interaction needed]

Relevant mite-api methods available:
[List or describe the API methods]

Current mite client setup:
[paste source/lib/mite.js or relevant snippet]

Error/behavior observed:
[Describe what's happening]

Question: [Your specific question]
```

#### Testing & QA Template
```
@testing-qa

Task: Write tests for [feature/function name]

Function/module under test:
[paste the code]

Existing test style (for reference):
[paste a similar test file from source/test/]

Requirements:
- Mock the mite-api, do not hit live API
- Cover happy path and at least two error cases
- Follow existing describe/it naming conventions

Question: [Your specific question or "generate the tests"]
```

#### Documentation Engineer Template
```
@doc-engineer

Task: [Document a new command / update README / write JSDoc]

Command/function details:
[paste the command implementation or function signature]

Existing documentation style:
[paste a similar README section or JSDoc block]

Target audience: [end users / contributors / both]

Question: [Your specific question or "write the documentation"]
```

#### Release & DevOps Template
```
@release-devops

Task: [Describe the CI/CD or release issue]

Current configuration:
[paste relevant package.json release config, .releaserc, or workflow YAML]

Observed behavior:
[What is happening]

Expected behavior:
[What should happen]

Node.js version in use: 22 (engines: >=20)

Question: [Your specific question]
```

---

### 3.3 Combining Agent Knowledge

For cross-cutting changes, invoke multiple agents in sequence within the same Copilot Chat session:

```
# Step 1 — Design
@cli-architect Design the flag interface for `mite budgets alert`

# Step 2 — Implementation  
@api-integrator Implement the API call to fetch budget data for the command above

# Step 3 — Testing
@testing-qa Write Mocha tests for the budget alert command and its API integration

# Step 4 — Documentation
@doc-engineer Write README documentation and --help text for the budget alert feature

# Step 5 — Release
@release-devops Does this change require a minor or patch version bump per semantic-release rules?
```

---

### 3.4 Agent Handoff Chains

**Standard feature development chain:**
```
@cli-architect → @api-integrator → @testing-qa → @doc-engineer → @release-devops
```

**Bug fix chain:**
```
@testing-qa (reproduce) → @api-integrator or @cli-architect (fix) → @testing-qa (verify) → @release-devops (patch release)
```

**Documentation-only chain:**
```
@doc-engineer → @release-devops (docs-only release or skip)
```

**Refactoring chain:**
```
@testing-qa (baseline coverage) → @cli-architect or @api-integrator (refactor) → @testing-qa (verify coverage) → @doc-engineer (update if API changed)
```

---

## 4. Practical Examples

### 4.1 Adding a New Command

**Scenario:** Add `mite customers archive <id>` to archive a customer by ID.

**Step 1 — @cli-architect**
```
@cli-architect

I want to add `mite customers archive <id>` to the CLI.
Here is the existing customers command: [paste source/cmd/customers.js]

- Should confirm before archiving (unless --force flag is passed)
- Should support --format json for scripting
- Should print success/failure to stdout

Design the Commander.js sub-command structure.
```

**Step 2 — @api-integrator**
```
@api-integrator

The mite-api package needs to archive a customer.
Here is the mite client: [paste source/lib/mite.js]

Does mite-api expose an archive method for customers?
If not, how do I call the REST endpoint directly using node-fetch with the stored API key?
```

**Step 3 — @testing-qa**
```
@testing-qa

Write Mocha + Chai tests for the new `mite customers archive` command:
[paste the implemented command code]

Cover:
1. Successful archive with confirmation
2. Aborted by user (no --force, declined prompt)
3. API returns 404
4. API returns 401 (invalid credentials)
```

**Step 4 — @doc-engineer**
```
@doc-engineer

Write the README section for `mite customers archive`.
Match the style of the existing customers section in README.md: [paste section]
Include: usage, flags table, examples.
```

---

### 4.2 Debugging a Release Issue

**Scenario:** `semantic-release` ran but did not publish a new version.

```
@release-devops

semantic-release completed without publishing. CI log output:
[paste the GitHub Actions job log]

Our release config from package.json:
[paste the "release" section]

Recent commits since last tag:
[paste `git log --oneline v1.x.x..HEAD`]

Why was no release triggered, and what do I need to change?
```

**Common causes the agent will check:**
- Commit messages don't match the Angular conventional commit format
- Branch name not in the release branches list
- `GITHUB_TOKEN` / `NPM_TOKEN` not set in repository secrets
- All commits are `docs:` or `chore:` type (no release trigger)

---

### 4.3 Performance Optimization

**Scenario:** `mite time-entries list` is slow when returning thousands of records.

**Step 1 — @api-integrator**
```
@api-integrator

`mite time-entries list` is slow for large date ranges.
Here is the current implementation: [paste source/cmd/time-entries.js]

How does mite-api paginate results?
Are we fetching all pages serially? Can we parallelize or stream?
```

**Step 2 — @cli-architect**
```
@cli-architect

Given that fetching is slow, should we:
a) Add a --limit flag to cap results
b) Add a progress indicator using ansi-colors
c) Stream results to stdout as they arrive rather than buffering all

What is the best UX approach here?
```

**Step 3 — @testing-qa**
```
@testing-qa

After optimizing the pagination, how do I write a performance regression test
that fails if fetching 500 mocked records takes more than 500ms?
```

---

## 5. GitHub Actions Integration

### Suggested Workflow Enhancements

Add these jobs to your existing GitHub Actions workflows to incorporate AI-assisted quality gates:

#### AI-Assisted Code Review Job
```yaml
# .github/workflows/ai-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  copilot-review:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - name: Request Copilot Review
        # Copilot for PRs will auto-review when enabled in repository settings.
        # This step is a placeholder for custom review scripts or other AI tools.
        run: echo "Copilot PR review requested via repository settings."
```

#### Semantic Release Pre-Check Job
```yaml
# Add to your existing CI workflow
- name: Validate Commit Messages
  uses: actions/setup-node@v4
  with:
    node-version: 22
- run: npm ci
- run: npx commitlint --from ${{ github.event.pull_request.base.sha }} --to HEAD --verbose
```

#### Coverage Reporting Job
```yaml
# Add to your existing test workflow
- name: Run Tests with Coverage
  run: npm test
  env:
    NODE_ENV: test
- name: Upload Coverage Report
  uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: coverage/
- name: Coverage Summary
  run: npx nyc report --reporter=text-summary
```

#### Node.js Compatibility Matrix
```yaml
strategy:
  matrix:
    node-version: [20, 22]
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
  - run: npm ci
  - run: npm test
```

---

## 6. Quick Reference Table

| Agent | Trigger | Use When You Need... | Key Files |
|---|---|---|---|
| CLI Architect | `@cli-architect` | Command design, flag naming, UX, Commander.js structure | `source/cmd/`, `source/app.js` |
| API Integrator | `@api-integrator` | mite-api calls, pagination, error handling, auth | `source/lib/mite.js`, `source/cmd/` |
| Testing & QA Specialist | `@testing-qa` | Mocha/Chai tests, mocking, coverage analysis | `source/test/`, `.nycrc` |
| Documentation Engineer | `@doc-engineer` | README updates, JSDoc, --help text, CONTRIBUTING | `README.md`, `CONTRIBUTING.md`, `source/cmd/` |
| Release & DevOps Specialist | `@release-devops` | semantic-release, GitHub Actions, Node.js compat, npm | `.github/workflows/`, `package.json` |

---

## 7. Additional Resources

- **mite-cli Repository:** <https://github.com/Ephigenia/mite-cli>
- **mite API Documentation:** <https://mite.de/api/index.html>
- **mite-api npm Package:** <https://www.npmjs.com/package/mite-api>
- **Commander.js Documentation:** <https://github.com/tj/commander.js>
- **Mocha Documentation:** <https://mochajs.org/>
- **Chai Assertion Library:** <https://www.chaijs.com/>
- **NYC / Istanbul Coverage:** <https://github.com/istanbuljs/nyc>
- **semantic-release:** <https://github.com/semantic-release/semantic-release>
- **Conventional Commits Specification:** <https://www.conventionalcommits.org/>
- **GitHub Copilot Chat Documentation:** <https://docs.github.com/en/copilot/github-copilot-chat>
- **Angular Commit Message Convention:** <https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit>

---

## 8. License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

---

*This file is maintained as part of the mite-cli developer experience. Update it when new commands, dependencies, or workflows are added.*
