# Suggested GitHub Repository Setup

This file is a publishing checklist for a fork or derivative repository.

## Repository description

Suggested short description:

> Local-first Fichero D11s label designer and printer tools with direct Web Bluetooth, batch image printing and no cloud backend.

## Suggested topics

- fichero
- fichero-d11s
- aiyin
- label-printer
- thermal-printer
- bluetooth
- web-bluetooth
- svelte
- fabricjs
- local-first
- offline
- printer

## Files to include at the repository root

Recommended:

- `README.md`
- `INSTALL.md`
- `TESTING.md`
- `CHANGELOG.md`
- `ATTRIBUTION.md`
- `PRIVACY.md`
- the upstream license file/license notice

Keep the original upstream protocol documentation and source attribution intact.

## README wording

Be explicit that this is a fork/modification of:

https://github.com/0xMH/fichero-printer

Do not describe it as the official Fichero project or imply endorsement by upstream.

## Development status

Until the v1.3 runtime has been verified on a real printer, mark the repository as **experimental** or **testing** rather than stable.

A useful release title would be:

```text
v1.3-test — local browser compatibility build
```

After the full checklist in `TESTING.md` passes, create a new stable tag/release rather than silently relabeling an unverified build.

## Suggested first commit message

```text
docs: document local Fichero fork, attribution and testing
```

If publishing the source modifications in the same commit, a clearer message is:

```text
feat: add local browser workflow and multi-image batch printing
```

## Releases

For each release, include:

- upstream commit/branch used as the base
- local version/tag
- Windows/macOS/Linux tested status
- Chrome/Edge versions tested
- printer model
- printer firmware
- single-label print result
- multi-image batch result
- CSV/multi-page result
- known limitations

## GitHub Pages

Do not enable GitHub Pages merely to satisfy local operation. The local project is designed to run from localhost.

If you later publish a hosted demo, document clearly that it is a separate deployment mode from the local-only workflow.

## Security/dependency maintenance

The npm dependency tree may contain audit findings inherited from current/upstream dependencies. Review fixes deliberately. Avoid committing forced major upgrades solely to make `npm audit` report zero findings unless the application has been regression-tested afterward.

## Attribution

Mention upstream and PR #18 in release notes when the corresponding functionality is included:

- Upstream: `0xMH/fichero-printer`
- Multiple-image CLI approach: Thijn, PR #18

See `ATTRIBUTION.md` for the full note.
