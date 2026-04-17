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
git status
git branch --show-current
```

If working tree is dirty or branch is not `main`: stop and tell the user.

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

## Step 6: Package and Release

```bash
npm run package
```

Then create the release with the custom notes (do **not** use `--generate-notes`):

```bash
gh release create v<version> "./h2h-iracing-<version>.zip" \
  --title "v<version>" \
  --notes "<formatted changelog>"
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using `npm run release` directly | It uses `--generate-notes`, which skips PR bodies. Run `npm run package` + `gh release create` separately. |
| Pushing tag before `npm version` | `npm version` creates the tag — run it first, push after. |
| Empty release notes sections | If a PR has no body, use the title only — don't leave blank sections. |
| Missing the previous tag | Use `git describe --tags --abbrev=0 HEAD~1` (note the `HEAD~1`) to get the tag before the new bump. |
