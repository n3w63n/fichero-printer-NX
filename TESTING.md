# Testing Checklist

Use this checklist before describing a release as working or production-ready.

## A. Clean build

- [ ] Start from a clean checkout of the intended branch/commit.
- [ ] Run `npm ci` in `web`.
- [ ] Run `npm run build`.
- [ ] Confirm Vite completes without errors.
- [ ] Confirm expected assets are present in `web/dist`.

## B. Local server

- [ ] Run `npm run serve:local`.
- [ ] Confirm it listens on `127.0.0.1` / `localhost:4174`.
- [ ] Confirm the application loads without Internet access after build.
- [ ] Confirm there are no unexpected startup requests to remote application/CDN assets.

## C. Diagnostics

Open `http://localhost:4174/local-diagnostics.html`.

- [ ] Secure context reports available/true.
- [ ] `navigator.bluetooth` is available.
- [ ] Canvas 2D is available.
- [ ] localStorage read/write succeeds.
- [ ] No stale/unexpected service worker controls the v1.3 origin.
- [ ] Direct Bluetooth-picker test opens a browser device chooser.

## D. Label editor without printer

- [ ] Create a new label.
- [ ] Add text.
- [ ] Edit text properties.
- [ ] Add an image.
- [ ] Add a QR code.
- [ ] Add a barcode.
- [ ] Drag/resize/rotate supported objects.
- [ ] Delete an object.
- [ ] Save/export a label.
- [ ] Import the saved label.
- [ ] Imported content appears correctly.
- [ ] Reload the page and confirm expected local persistence behavior.

## E. Printer connection

With a real Fichero D11s/AiYin printer:

- [ ] Printer appears in the Web Bluetooth chooser.
- [ ] Connection succeeds.
- [ ] Connection state is reflected in the UI.
- [ ] A simple label prints.
- [ ] Printer remains usable for a second print without reloading the page.
- [ ] Disconnect/reconnect works.

## F. Browser multi-image printing

- [ ] Select two image files.
- [ ] Confirm both appear in the intended batch order.
- [ ] Start batch printing.
- [ ] Confirm image 1 prints completely.
- [ ] Confirm image 2 prints completely.
- [ ] Confirm the browser does not deliberately disconnect Bluetooth between images.
- [ ] Test 5+ images.
- [ ] Test cancellation/error behavior if available.
- [ ] Test an invalid/unsupported image and confirm the UI reports a useful error.

## G. Existing CSV / multi-page flow

- [ ] Existing upstream CSV/multi-page workflow still opens.
- [ ] A small batch renders correctly.
- [ ] Multiple generated pages print correctly.
- [ ] No regression is introduced by the multi-image feature.

## H. Python CLI multi-image flow

If using the CLI changes based on PR #18:

- [ ] One image path still works.
- [ ] Two image paths work in one invocation.
- [ ] Several image paths work in one invocation.
- [ ] The printer connection remains open across the image sequence as intended.
- [ ] Failure of one image produces understandable behavior/output.

## I. Browser matrix

At minimum test:

- [ ] Current Chrome on Windows
- [ ] Current Edge on Windows

If claiming broader support, test those platforms explicitly rather than assuming Chromium behavior is identical everywhere.

## J. Release gate

A release should not be marked stable until sections A-G pass on a real printer. If CLI changes are part of the release claim, section H must also pass.

Record the tested browser version, operating system, printer model and printer firmware in the release notes.
