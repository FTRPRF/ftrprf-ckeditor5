# FTRPRF patches & overlay

This file is the canonical inventory of every divergence between
`upstream-master` (this fork's main branch) and `upstream/master` (CKSource's
`ckeditor/ckeditor5`). It exists to make upstream syncs predictable: every
sync pass should walk this file top-to-bottom.

If you add, remove, or change anything that diverges from upstream, update
the relevant section here in the same commit.

---

## 1. New files (FTRPRF-owned, no upstream counterpart)

These paths do not exist in `upstream/master`. They cannot conflict during a
merge; they only need to survive it. If `git merge upstream/master` deletes
any of them, something is wrong — investigate before resolving.

| Path | Purpose |
| --- | --- |
| `.github/workflows/update-blob-beta.yml` | Builds the decoupled UMD bundle on push to `upstream-master` and uploads `ckeditor.umd.js` + `ckeditor.css` to Azure blob (`ckeditor5_beta.{js,css}`). |
| `packages/ckeditor5-editor-decoupled/scripts/build-browser.mjs` | Wrapper around `@ckeditor/ckeditor5-dev-build-tools` that produces `dist/browser/ckeditor.{js,umd.js,css}` exposing global `DecoupledEditor`. |
| `packages/ckeditor5-editor-decoupled/sample/browser-bundle.html` | Standalone sample for smoke-testing the local build. Loads `../dist/browser/ckeditor.umd.js`. |
| `packages/ckeditor5-editor-decoupled/src/ckeditor.ts` | Build entry mirroring the legacy `ckeditor5-build-decoupled-document` package. Hosts the full `builtinPlugins` array and `defaultConfig`. |
| `packages/ckeditor5-editor-decoupled/src/plugins/index.ts` | Barrel re-exporting every FTRPRF plugin and the `ftrprfPlugins` array consumed by `ckeditor.ts` and `index.ts`. |
| `packages/ckeditor5-editor-decoupled/src/plugins/contentTemplates/` | Vendored from `@ftrprf/*` (JS). |
| `packages/ckeditor5-editor-decoupled/src/plugins/exercise/` | FTRPRF custom plugin. |
| `packages/ckeditor5-editor-decoupled/src/plugins/fullScreen/` | FTRPRF custom plugin. |
| `packages/ckeditor5-editor-decoupled/src/plugins/htmlInsert/` | FTRPRF custom plugin. |
| `packages/ckeditor5-editor-decoupled/src/plugins/iframe/` | Vendored from `@ftrprf/*` (JS). |
| `packages/ckeditor5-editor-decoupled/src/plugins/image/` | FTRPRF custom plugin (`OwnImagePlugin`). |
| `packages/ckeditor5-editor-decoupled/src/plugins/modal/` | FTRPRF custom plugin. |
| `packages/ckeditor5-editor-decoupled/src/plugins/removeBlockStyle/` | FTRPRF custom plugin. |
| `packages/ckeditor5-editor-decoupled/src/plugins/scratchBlocks/` | Vendored from `@ftrprf/*` (JS). |
| `packages/ckeditor5-editor-decoupled/src/plugins/source/` | FTRPRF custom plugin. |
| `packages/ckeditor5-editor-decoupled/src/plugins/styledLink/` | FTRPRF custom plugin. |

## 2. Patches to upstream-tracked files

These files exist upstream and we have edited them. During a sync, conflicts
on these paths are expected. After resolving, verify the patch listed here
is still applied.

| Path | Patch | Notes |
| --- | --- | --- |
| `packages/ckeditor5-editor-decoupled/src/index.ts` | Appended `export * from './plugins/index.js';` | Pure-append. Resolution: keep both ours and theirs. |
| `packages/ckeditor5-editor-decoupled/package.json` | Added `"build:browser": "node ./scripts/build-browser.mjs"` to `scripts`. | One-line append; conflict only if upstream adds a script on the same line. |
| `.gitignore` | Added a `# FTRPRF:` block with `!packages/ckeditor5-editor-decoupled/src/plugins/{iframe,contentTemplates,scratchBlocks}/**/*.js` negations. | Required so vendored JS plugins aren't ignored by the global `packages/*/src/**/*.js` rule. |

## 3. Patches to upstream package internals

Higher-risk patches: we modify upstream source inside another package.
**These are the entries to walk first** during a sync.

### `packages/ckeditor5-media-embed/src/mediaembedresize/mediaembedresizeediting.ts`

- **Patch:** removed the `licenseFeatureCode` getter (returned `'MER'`) and
  the `isPremiumPlugin` getter override (returned `true`).
- **Effect:** the plugin is no longer gated by the editor's premium-license
  check (see `ckeditor5-core/src/editor/editor.ts:865`), so it loads under
  any license key including `'GPL'`.
- **Why:** test patch — we want to evaluate `MediaEmbedResize` before
  committing to a license tier that includes `MER`.
- **Drop condition:** when we move to a license that covers `MER`, revert
  this patch (re-add both getters with their original values).
- **Heads-up:** `packages/ckeditor5-media-embed/tests/mediaembedresize/mediaembedresizeediting.js`
  asserts the original values and will fail if its suite is run against the
  patched source. We've intentionally left the tests untouched so the
  failure surfaces during sync as a reminder.

## 4. Cherry-picked upstream PRs

These are upstream commits we've pulled in ahead of their merge to
`upstream/master`. After each upstream sync, check whether the PR has landed
— if so, drop the cherry-pick **before** running `git merge upstream/master`
so the merge is clean.

### MediaEmbedResize feature

- **Commit:** `c3f508225d` ("grab resizable media embed PR can be
  overwritten once merged into remote master")
- **Source:** open upstream PR introducing the `MediaEmbedResize` plugin and
  surrounding config (`mediaembedresize/`, `mediaembedstyles`, etc.).
- **Touched files:** see `git show --stat c3f508225d` (32 files, ~2.3k lines).
- **Drop condition:** when the upstream PR merges, run
  `git revert c3f508225d` (or rebase to drop it) **before** the next
  `git merge upstream/master`. Note that the patch in §3 above sits on top
  of this commit; it must be reverted too if the merged upstream version
  remains premium-gated, or kept (and ported) if upstream loosens it.

---

## Sync ritual (per upstream sync)

1. `git fetch upstream`
2. `git checkout -b sync/upstream-master-$(date +%Y-%m) upstream-master`
3. **Walk this file top-to-bottom.** For each entry in §3 and §4, decide:
   - Drop now (drop condition met) → revert it before the merge.
   - Keep → expect to re-apply on conflict.
4. `git merge upstream/master`.
5. Resolve conflicts, guided by §1–§3.
6. Re-run `pnpm install --frozen-lockfile` (Node ≥24).
7. Build: `pnpm --filter @ckeditor/ckeditor5-editor-decoupled build:browser`.
8. Smoke-test by opening
   `packages/ckeditor5-editor-decoupled/sample/browser-bundle.html`.
9. Open PR `sync: upstream/master @ <upstream-sha>` into `upstream-master`.
10. Update this file in the same PR if the patch set changed.
