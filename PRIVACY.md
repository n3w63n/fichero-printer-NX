# Privacy and Local-Only Model

The purpose of Fichero Local is to make normal label design and printing possible without relying on a cloud application backend.

## Normal browser operation

When using the locally built application:

- The web UI is loaded from the computer running the local server.
- The local server binds to `127.0.0.1`.
- Label editing takes place in the browser.
- Printer communication takes place directly through Web Bluetooth.
- Saved browser labels/preferences use browser-local storage mechanisms provided by the application.
- No account is required by this local modification.

## What “local” does and does not mean

“Local” here means that the application does not need a remote application server to design and print labels.

It does **not** mean that the computer can never make a network request. Examples of actions that can use the Internet include:

- `npm ci` when dependencies are not already installed/cached
- Git clone/pull/fetch operations
- opening GitHub or other external links manually
- checking for dependency updates
- browser/vendor network behavior outside the control of this project

## Static local server

The Node local server serves files from the built `web/dist` directory. It is not intended to receive label contents, upload files, proxy printer commands or provide an API backend.

## Bluetooth permission

The browser controls Web Bluetooth permission. Connecting to a printer requires user interaction and browser permission. The application cannot silently pair with arbitrary Bluetooth devices.

## Browser storage

Labels/preferences stored in browser-local storage remain associated with that browser profile and origin. Clearing browser/site data can remove them.

Export important labels if you need durable backups.

## External links

The upstream interface may contain links to GitHub/project resources. Those links do not need to be opened for local printing, but following them will naturally make a network request.

## No privacy guarantee for modified distributions

Anyone can fork and modify this project. If you download a build from a third party, inspect the source/build or build it yourself if you need confidence that the distributed version preserves the local-only behavior described here.
