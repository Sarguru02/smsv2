# Agent Instructions

## Git Workflow

**NEVER commit changes.** The user will handle all git commits. Do not mutate the git repository state (no git add, git commit, etc).

## Terminal Commands

Never use `| tail` or `| head` - run commands directly in terminal so the user can see output in real-time.

Always use `git --no-pager` for git commands that produce output (e.g. `git --no-pager diff`, `git --no-pager log`). The default pager will hang.

## GitHub CLI

Always write bodies to a temp file first, then use `--body-file`. Do not pass bodies inline — long bodies break in the shell.

```bash
# Issues
gh issue create --title "Title" --body-file /tmp/issue-body.md

# PRs
gh pr create --base <base> --title "Title" --body-file /tmp/pr-body.md
```

## Project Structure

Monorepo with two apps:
- `apps/api` — Rust backend (Axum, Diesel, PostgreSQL)
- `apps/web` — Next.js frontend

## Development Commands

```bash
just frontend     # Run Next.js dev server (apps/web)
just backend      # Run Rust API server (apps/api)
just services     # Start PostgreSQL via nix process-compose
```

## Database

- Database name: `sms`
- PostgreSQL runs on port 5432
- `DATABASE_URL` required in `apps/api/.env`
- Diesel migrations are embedded and run automatically on API startup

## API Testing

Use `hurl` with `hurl/variables.env`:
```bash
hurl --variables-file hurl/variables.env hurl/login.hurl
```
