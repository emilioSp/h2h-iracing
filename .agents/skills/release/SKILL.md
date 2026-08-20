---
name: release
description: Use when releasing a new version of h2h-iracing - previews and confirms release notes, then creates the version tag and GitHub release
---

# Release h2h-iracing

## Overview

Automates the full release flow: pre-flight → changelog preview and confirmation → version bump → package → push → GitHub release.

**Announce at start:** "I'm using the release skill to publish a new version."

**Core principles:**

- Collect PR descriptions for a descriptive changelog. Never use `--generate-notes` alone.
- Do not create or push a version tag before the user confirms the release notes.
- After confirmation, complete the package and GitHub release flow. Do not stop after pushing the tag.

## Step 1: Pre-flight Checks

```bash
git fetch origin --tags
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

Find the most recent GitHub release, not merely the most recent local tag. A tag without a
release must not become the changelog baseline:

```bash
LATEST_RELEASE_TAG=$(gh release view --json tagName --jq .tagName)
git log "$LATEST_RELEASE_TAG"..HEAD --oneline
```

## Step 2: Determine Version Bump

Ask the user:

> Is this a **patch** (fixes/chores), **minor** (new features), or **major** (breaking changes)?

Convention: patch is most common for fixes and chores; minor for new features; major is rare.

Do not run `npm version` yet. It creates the tag, which must wait for release-notes confirmation.

## Step 3: Collect PR Descriptions and Preview Release Notes

Extract PR numbers from the commits after the latest GitHub release:

```bash
git log "$LATEST_RELEASE_TAG"..HEAD --oneline
```

Look for `(#NNN)` patterns in the commit subjects. For each PR number found:

```bash
gh pr view <N> --json number,title,body
```

If a PR body is empty, use the title only. Skip bots and chore-only PRs at your discretion.

Format the changelog as:

```
## What's Changed

### <PR title> (#N)
<PR body>

---

### <PR title> (#N)
<PR body>
```

Show the full notes and ask explicitly:

> Confirm the selected version bump, these release notes, and publication of the GitHub release.

Stop here until the user confirms. Do not run `npm version`, push a tag, package, or create a
release before confirmation.

## Step 4: Create the Version Commit and Package

After confirmation:

```bash
npm version <patch|minor|major>
NEW_VERSION=$(node -p "require('./package.json').version")
npm run package
ls -la "build/h2h-iracing-$NEW_VERSION.zip"
```

`npm version` creates the version-bump commit and local tag (for example, `v1.31.0`).

`npm run package` takes a while and is destructive: it deletes `node_modules`, runs `npm ci`,
builds every dashboard, reinstalls with `--omit=dev`, assembles the bundle, then reinstalls dev
dependencies at the end. If it throws anywhere after the `--omit=dev` step, you are left with
production-only dependencies. Recover with:

```bash
npm ci
```

Stop and report the failure if packaging fails. Do not push the commit or tag.

## Step 5: Push and Create the GitHub Release

Only after the zip exists:

```bash
git push origin main
git push origin "v$NEW_VERSION"
```

Write the approved changelog to a file and pass `--notes-file`. Never interpolate it into
`--notes`: PR bodies can contain backticks and `$` characters.

```bash
cat > /tmp/release-notes.md <<'EOF'
<formatted changelog approved by the user>
EOF

gh release create "v$NEW_VERSION" "./build/h2h-iracing-$NEW_VERSION.zip" \
  --title "v$NEW_VERSION" \
  --notes-file /tmp/release-notes.md

gh release view "v$NEW_VERSION" --json url,isDraft
```

The quoted `<<'EOF'` prevents shell expansion. Do **not** use `--generate-notes`; it ignores the
PR bodies collected in Step 3.

Report the release URL only after `gh release view` confirms that the release exists and is not a
draft.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Creating or pushing a tag before notes confirmation | Collect and preview notes first. Run `npm version` only after explicit approval. |
| Stopping after pushing the tag | Continue immediately with `gh release create` and verify it with `gh release view`. |
| Using the latest local tag as the changelog baseline | Use `gh release view --json tagName --jq .tagName`; a tag may exist without a release. |
| Using `npm run release` directly | It uses `--generate-notes`, which skips PR bodies. Run `npm run package` and `gh release create` separately. |
| Passing the changelog via `--notes "..."` | Backticks in PR bodies execute as shell commands. Use `--notes-file` with a quoted heredoc. |
| Empty release notes sections | If a PR has no body, use the title only. Do not leave blank sections. |
| Releasing from a branch behind origin | Fetch first. Do not tag an outdated commit. |
| A new overlay missing from the bundle | Check `scripts/package.ts` lists a build step and a `dist/` copy for every dashboard. |
| Dev tooling broken after a failed package | `npm run package` leaves `--omit=dev` dependencies behind. Run `npm ci`. |
