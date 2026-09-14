# Installation and Local Use

This document describes the local browser build of Fichero Local.

## 1. Prerequisites

Install:

- Git
- Node.js with npm
- Chrome or Edge
- Bluetooth support on the computer

For the Python CLI, also install the tools required by the upstream project (Python 3.10+ and `uv`).

## 2. Get the repository

Clone your fork or local repository and enter it.

The browser application lives in the `web` directory.

## 3. Install web dependencies

From `web`:

```text
npm ci
```

`npm ci` uses the repository lockfile and is preferred over `npm install` for a reproducible checkout.

### npm audit notices

The current upstream dependency tree may report npm audit findings. Do not automatically run `npm audit fix --force` before confirming that the application builds and works, because forced upgrades can introduce breaking dependency changes.

Review security updates separately and test them before committing them.

## 4. Build the browser application

From `web`:

```text
npm run build
```

A successful build creates the local production application in `web/dist`.

The build should not require remote runtime assets after it has completed.

## 5. Start the local server

From `web`:

```text
npm run serve:local
```

The v1.3 local server listens on:

```text
http://localhost:4174
```

It binds to `127.0.0.1`, so it is intended to be accessible only from the same computer.

This server is a static file server, not an application backend. Printer communication occurs directly between the browser and printer through Web Bluetooth.

## 6. Open the application

Use current desktop Chrome or Edge and navigate to:

```text
http://localhost:4174
```

Do not test v1.3 in an old `localhost:4173` tab from v1.0-v1.2. The port was intentionally changed to avoid stale service-worker/cache state from earlier experimental versions.

## 7. Run diagnostics first

Open:

```text
http://localhost:4174/local-diagnostics.html
```

Confirm that:

- Secure context: available/true
- Web Bluetooth: available
- Canvas: available
- localStorage: available
- No unexpected service worker controls the page

Use the diagnostics Bluetooth test to confirm that the browser is capable of presenting a device picker.

## 8. Test the editor

Before connecting a printer, verify that you can:

1. Create a new label.
2. Add text.
3. Add an image.
4. Add a QR code or barcode.
5. Move/resize objects.
6. Export a label.
7. Import the exported label again.

If these controls do not work, treat the problem as a browser initialization/editor issue rather than a Bluetooth problem.

## 9. Test Bluetooth printing

Turn on the Fichero printer, then:

1. Click the Bluetooth/connect control.
2. Select the Fichero/D11s device.
3. Confirm connection state in the UI.
4. Print a simple text label.
5. Print a single image.
6. Test multiple-image batch printing.
7. Test an existing CSV/multi-page batch workflow if you use it.

See [TESTING.md](TESTING.md) for the full test matrix.

## Offline/local behavior

Once the dependencies have already been installed and the application has been built, normal use of `web/dist` through the local server does not require the application to contact a cloud backend.

A fresh `npm ci`, Git operations, opening external GitHub links, or obtaining dependency/security updates can of course require Internet access.

## Troubleshooting

### Bluetooth control is disabled

Check `local-diagnostics.html` first. Web Bluetooth requires browser support and a secure context. `localhost` is treated as a potentially trustworthy local origin by Chromium-based browsers.

### The UI renders but editor controls do nothing

Open the browser Developer Tools console and look for the first runtime exception. This symptom usually indicates application initialization failed before event handlers/editor state finished loading.

### Old behavior appears after rebuilding

Close old localhost tabs and make sure you are using port `4174`. Clear site data for previous localhost origins if necessary.

### Build succeeds but printing fails

Separate browser/editor testing from printer testing. Confirm the editor works, then confirm the Bluetooth picker works, then test a minimal print job.
