---
name: release
description: Use when releasing a new version of h2h-iracing - bumps npm version, pushes tag, collects PR descriptions, and creates a GitHub release
---

# Release h2h-iracing

## Overview

Automates the full release flow: version bump → git push → PR-description changelog → GitHub release.

**Announce at start:** "I'm using the release skill to publish a new version."

**Core principle:** Collect PR descriptions for a descriptive changelog. Never use `--generate-notes` alone.

## Step 1: Pre-flight Checks

```bash
git fetch origin
git status -sb
git branch --show-current
```

Stop and tell the user if the working tree is dirty, the branch is not `main`, or the branch is
behind `origin/main` — tagging while behind puts the release on the wrong commit.

`npm run package` copies `.env` into the bundle, so a missing one fails the release halfway
through, after it has already reinstalled dependencies:

```bash
test -f .env || echo "MISSING .env — packaging will fail"
```

Every SimHub dashie and every built dashboard has to be referenced in `scripts/package.ts`, or
the overlay ships without its SimHub dashboard and nobody notices until a user complains. The
dashies are copied with a glob, but the per-dashboard build steps and `dist/` copies are still
listed by hand:

```bash
ls simhub_dashies/
grep -c "dashboard'" scripts/package.ts   # one dist copy per dashboard
```

Then show what's changed since the last release:

```bash
git log $(git describe --tags --abbrev=0)..HEAD --oneline
```

## Step 2: Determine Version Bump

Ask the user:

> Is this a **patch** (fixes/chores), **minor** (new features), or **major** (breaking changes)?

Convention: patch is most common for fixes and chores; minor for new features; major is rare.

```bash
npm version <patch|minor|major>
```

`npm version` creates both the bump commit and the tag (e.g. `v1.31.0`). Capture the new version:

```bash
node -p "require('./package.json').version"
```

## Step 3: Push Commit and Tag

```bash
git push
git push origin v<new-version>
```

## Step 4: Collect PR Descriptions

Find the previous release tag:

```bash
git describe --tags --abbrev=0 HEAD~1
```

Extract PR numbers from commits between the previous tag and the new one:

```bash
git log <prev-tag>..<new-tag> --oneline
```

Look for `(#NNN)` patterns in the commit subjects. For each PR number found:

```bash
gh pr view <N> --json number,title,body
```

If a PR body is empty, use the title only. Skip bots and chore-only PRs at your discretion.

## Step 5: Preview Release Notes

Format the changelog as:

```
## What's Changed

### <PR title> (#N)
<PR body>

---

### <PR title> (#N)
<PR body>
```

Show the preview to the user and ask for confirmation before publishing.

## Step 6: Package

```bash
npm run package
```

This takes a while and is destructive: it deletes `node_modules`, runs `npm ci`, builds every
dashboard, reinstalls with `--omit=dev`, assembles the bundle, then reinstalls dev dependencies
at the very end. If it throws anywhere after the `--omit=dev` step, you are left with
production-only dependencies — no biome, no vitest, no tsc — and the cause is not obvious. The
recovery is simply:

```bash
npm ci
```

Confirm the zip actually exists before trying to upload it:

```bash
ls -la h2h-iracing-<version>.zip
```

## Step 7: Create the Release

Write the changelog to a file and pass `--notes-file`. Never interpolate it into `--notes`:
PR bodies routinely contain backticks, and a body such as ``Fixes the `npm run build` step``
will execute that command in your shell and splice its output into the release notes.

```bash
cat > /tmp/release-notes.md <<'EOF'
<formatted changelog>
EOF

gh release create v<version> "./h2h-iracing-<version>.zip" \
  --title "v<version>" \
  --notes-file /tmp/release-notes.md
```

The quoted `<<'EOF'` matters too — unquoted, the heredoc still expands backticks and `$`.

Do **not** use `--generate-notes`; it ignores the PR bodies collected in Step 4.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using `npm run release` directly | It uses `--generate-notes`, which skips PR bodies. Run `npm run package` + `gh release create` separately. |
| Passing the changelog via `--notes "..."` | Backticks in PR bodies execute as shell commands. Use `--notes-file` with a quoted heredoc. |
| Pushing tag before `npm version` | `npm version` creates the tag — run it first, push after. |
| Empty release notes sections | If a PR has no body, use the title only — don't leave blank sections. |
| Missing the previous tag | Use `git describe --tags --abbrev=0 HEAD~1` (note the `HEAD~1`) to get the tag before the new bump. |
| Releasing from a branch behind origin | `git fetch` first — tagging while behind releases the wrong commit. |
| A new overlay missing from the bundle | Check `scripts/package.ts` lists a build step and a `dist/` copy for every dashboard. |
| Dev tooling broken after a failed package | `npm run package` leaves `--omit=dev` deps behind. Run `npm ci`. |
