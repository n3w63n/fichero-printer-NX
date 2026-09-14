# Fichero Local

A local-first fork/modification of [`0xMH/fichero-printer`](https://github.com/0xMH/fichero-printer) for the Fichero D11s / AiYin D11s Bluetooth thermal label printer.

The goal of this fork is to keep the existing browser label designer while making it convenient to run entirely from your own computer, with direct browser-to-printer Bluetooth communication and no cloud backend.

## What this fork adds

- Local-only browser hosting on `127.0.0.1`
- No application backend or account requirement
- No CDN/runtime dependency for the built web application
- Browser batch printing of multiple image files while keeping the Bluetooth connection open
- Existing upstream CSV / multi-page batch workflow retained
- Python CLI support for printing multiple image paths in one connected session, based on upstream [PR #18](https://github.com/0xMH/fichero-printer/pull/18)
- A local diagnostics page for checking Web Bluetooth, secure-context support, Canvas and browser storage

## What remains upstream

This project is based on the original Fichero work by [`0xMH`](https://github.com/0xMH/fichero-printer), including:

- Reverse-engineered Fichero/AiYin D11s BLE protocol
- Svelte 5 + Fabric.js label designer
- Text, image, barcode and QR-code label editing
- Direct Web Bluetooth printing
- Python CLI and printer protocol implementation
- Protocol documentation

See [ATTRIBUTION.md](ATTRIBUTION.md) for details.

## Current status

The local modification line is currently **v1.3**.

### Verified

- Dependencies install successfully with `npm ci`
- Production web build completes successfully with Vite
- Local static server starts and binds only to `127.0.0.1`
- Built application assets are served locally
- Installer can be applied repeatedly without intentionally duplicating patches

### Still requiring real-device confirmation

The v1.3 browser runtime and Bluetooth printing should be tested on a real Fichero printer before this fork is described as production-ready. Earlier v1.2 testing exposed a browser initialization regression caused by an added CSP/service-worker layer; v1.3 removes that layer and returns to the upstream browser runtime model.

If you are evaluating the project, see [TESTING.md](TESTING.md).

## Requirements

For the browser application:

- Windows, macOS or Linux desktop
- A Bluetooth adapter supported by the operating system/browser
- Chrome or Edge with Web Bluetooth support
- Node.js and npm for building/serving the local web application
- Fichero D11s / compatible AiYin printer

Firefox and Safari do not currently provide the Web Bluetooth support required by this application.

## Quick start

From the `web` directory:

```text
npm ci
npm run build
npm run serve:local
```

Then open:

```text
http://localhost:4174
```

For a complete clean-install procedure, see [INSTALL.md](INSTALL.md).

## Local diagnostics

When the local server is running, open:

```text
http://localhost:4174/local-diagnostics.html
```

The diagnostics page checks:

- whether the page is a secure context
- whether `navigator.bluetooth` is available
- whether Canvas 2D is available
- whether `localStorage` works
- whether an old service worker controls the origin
- whether the browser can open a Bluetooth device picker

## Privacy model

Normal use of the local build does not require a cloud service. The browser communicates with the printer directly through Web Bluetooth, while the Node process serves static files from the local `web/dist` directory.

See [PRIVACY.md](PRIVACY.md) for the exact scope and caveats.

## Documentation

- [INSTALL.md](INSTALL.md) — installation, build and local launch
- [TESTING.md](TESTING.md) — browser and printer verification checklist
- [CHANGELOG.md](CHANGELOG.md) — local modification history
- [ATTRIBUTION.md](ATTRIBUTION.md) — upstream and contributor attribution
- [PRIVACY.md](PRIVACY.md) — local/privacy model
- [GITHUB.md](GITHUB.md) — suggested GitHub repository setup

## Upstream project

Original project:

https://github.com/0xMH/fichero-printer

Protocol documentation:

https://github.com/0xMH/fichero-printer/blob/main/docs/PROTOCOL.md

Multiple-image CLI work used as a basis:

https://github.com/0xMH/fichero-printer/pull/18

## License

The upstream project identifies itself as **MIT licensed**. Preserve the upstream copyright/license notices and any third-party notices when redistributing this fork.

This repository contains modifications and documentation around the upstream project; it does not change the license of upstream or third-party code.
