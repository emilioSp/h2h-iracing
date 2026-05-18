---
name: dependabot
description: Triage open dependabot PRs — dry-run report of CI status, then merge all green ones on confirmation.
---

# Dependabot PR Triage

## Overview

Check all open dependabot PRs, report which ones have green CI, and merge them after a single confirmation.

**Announce at start:** "I'm using the dependabot skill to triage open PRs."

## Step 1 — List open dependabot PRs

```bash
gh pr list --author app/dependabot --json number,title,headRefName
```

If the result is empty: report "No open dependabot PRs." and stop.

## Step 2 — Check CI for each PR

For every PR found:

```bash
gh pr checks <number> --json name,state,conclusion
```

Classify each PR as one of:
- **green** — checks list is non-empty AND all checks have `conclusion: SUCCESS`
- **failing** — at least one check has `conclusion: FAILURE`
- **pending** — at least one check has `state: IN_PROGRESS` or `conclusion: null`
- **no CI** — checks list is empty — treat as **skip**, do not merge

## Step 3 — Dry-run report

Display a table before doing anything:

```
#53  bump vite 8.0.0 → 8.0.5        ✓ green   → will merge
#54  bump typescript 5.7.2 → 5.7.3  ✗ failing → skip
#55  bump vitest 4.1.1 → 4.1.2      ⏳ pending → skip
#56  bump some-dep 1.0.0 → 1.0.1    — no CI   → skip
```

If no PRs are green: report "No green PRs to merge." and stop.

## Step 4 — Confirm

Ask the user:

> Merge N PR(s): #X, #Y, ...?

Wait for confirmation before proceeding.

## Step 5 — Merge sequentially

For each green PR, one at a time:

```bash
gh pr merge <number> --squash --delete-branch
```

Report ✓ or ✗ after each merge. If a merge fails, report the error and continue with the rest.

## Rules

- Never merge a PR with pending, failing, or missing CI — even if the user asks.
- Always dry-run first, always confirm once before merging.
- Merge sequentially, not in parallel.

## Troubleshooting — merge conflict in `package.json` / `package-lock.json`

When merging multiple dependabot PRs in sequence, later ones may conflict because earlier merges updated the lock file. Steps to resolve:

**1. Check out the conflicting branch:**
```bash
git fetch origin
git checkout <branch-name>
```

**2. Merge main and inspect the conflict:**
```bash
git merge origin/main --no-commit
git diff package.json
```

The conflict in `package.json` typically shows two dependency bumps from different PRs. The correct resolution is to keep **both** bumps — one from main (already merged) and one from this PR.

**3. Take main's files as the base:**
```bash
git checkout --theirs package.json
git checkout --theirs package-lock.json
```

**4. Re-apply this PR's version bump:**
```bash
npm install --save-exact <package>@<new-version>
```

This regenerates `package-lock.json` correctly with all changes from both branches.

**5. Verify `package.json` has both bumps, then commit and push:**
```bash
git add package.json package-lock.json
git commit -m "chore(deps): merge main and apply <package> bump"
git push
git checkout main && git pull
```

**6. Wait for CI to go green, then re-run `/dependabot` to merge.**