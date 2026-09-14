# Attribution and Upstream Relationship

Fichero Local is based on the open-source [`0xMH/fichero-printer`](https://github.com/0xMH/fichero-printer) project.

## Upstream project

Repository:

https://github.com/0xMH/fichero-printer

The upstream project provides the core work that makes this fork possible, including:

- Reverse engineering of the Fichero D11s / AiYin printer protocol
- BLE communication implementation
- Python printer client and CLI
- Fichero protocol documentation
- Browser label designer
- Direct Web Bluetooth printing

The upstream README states that the web GUI is built with Svelte 5 and Fabric.js and was ported from the NiimBlue project, which is identified there as MIT licensed.

## Protocol documentation

Upstream protocol reference:

https://github.com/0xMH/fichero-printer/blob/main/docs/PROTOCOL.md

Do not remove upstream attribution from redistributed protocol/code documentation.

## Multiple-image CLI contribution

The Python CLI multiple-image behavior in this fork is based on the approach proposed by **Thijn** in upstream pull request #18:

https://github.com/0xMH/fichero-printer/pull/18

That pull request changes the image command so multiple image paths can be printed within one connected session, avoiding repeated Bluetooth disconnect/reconnect cycles.

If the corresponding code is distributed, preserve appropriate attribution to the contributor and upstream project.

## Local modifications

This fork/modification adds or changes, among other things:

- Local-only static serving workflow
- Browser multi-image batch-printing UI/flow
- Local diagnostics tooling
- Compatibility changes introduced during the v1.x local-browser work
- Documentation for local deployment/testing/privacy

## License

The upstream repository declares the project to be licensed under the MIT License.

When publishing a fork:

1. Preserve upstream copyright and license notices.
2. Preserve applicable third-party notices.
3. Do not imply that the upstream author endorses or supports this fork unless they explicitly do so.
4. Clearly distinguish local modifications from upstream behavior.

This attribution file is informational and is not a substitute for the actual license text shipped with the source tree.
