# Changelog

This changelog covers the local/offline modification work layered on top of `0xMH/fichero-printer`. It is separate from upstream history.

## v1.3

### Changed

- Removed the custom Content Security Policy introduced by the earlier local modkit.
- Removed the explicit Bluetooth Permissions-Policy override.
- Removed generated service-worker registration and generated service-worker build output.
- Returned the browser runtime environment closer to upstream behavior for compatibility with Svelte, Fabric.js, file import and Web Bluetooth.
- Changed the default local origin from `localhost:4173` to `localhost:4174` so testing does not inherit service-worker/cache state from v1.0-v1.2.

### Kept

- Local-only static serving on `127.0.0.1`.
- Browser multi-image printing support.
- Existing upstream CSV/multi-page printing behavior.
- Python CLI multi-image printing based on upstream PR #18.

### Added

- `local-diagnostics.html` for checking secure context, Web Bluetooth, Canvas, localStorage and service-worker state.

### Validation status

- Production build: verified.
- Local static server: verified.
- Real-device/browser runtime after the v1.3 compatibility changes: requires confirmation on hardware.

## v1.2

- Stopped modifying `PrintPreview.svelte`.
- Preserved upstream CSV/multi-page batch printing unchanged.
- Adjusted browser multi-image printing to use the normal print lifecycle for each image while maintaining the Bluetooth connection across the batch.
- Retained Python CLI multi-image support based on PR #18.

## v1.1

- Fixed installer matching on Windows CRLF source files.
- Improved repeatability/idempotency of the patching process.
- Fixed additional line-ending-sensitive patch steps.

## v1.0

Initial local-browser modkit experiment:

- Added local static serving.
- Added browser multi-image printing UI.
- Added PR #18-inspired CLI multi-image support.
- Added experimental CSP/service-worker hardening.

The CSP/service-worker approach was later removed because it changed the upstream browser runtime and contributed to a GUI initialization regression during testing.
