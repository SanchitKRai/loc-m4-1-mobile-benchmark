# Third-party notices

This temporary benchmark bundles the following third-party packages:

- **hash-wasm 4.13.0** — MIT License. Used for the Argon2id v1.3 WebAssembly implementation.
  - Project: https://github.com/Daninet/hash-wasm
  - Package: https://www.npmjs.com/package/hash-wasm
- **Vite 8.3.8** — MIT License. Build-time tooling only.
  - Project: https://github.com/vitejs/vite

No LOC proprietary code, internal API implementation, credentials, keys, health data or production records are included in this repository.

The benchmark uses the browser's built-in Web Crypto API for generating fresh salts and importing the derived output as a non-extractable AES-GCM key.
