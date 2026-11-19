# LOC M4.1 — isolated Argon2id mobile benchmark

A temporary, standalone benchmark page for measuring the LOC M4.1 Argon2id candidate on desktop and mobile browsers.

**This repository is intentionally separate from LOC.** It must contain only the synthetic benchmark, its pinned build dependencies, deployment workflow and documentation. Do not add the LOC application, health API, production records, credentials, recovery phrases, secrets or benchmark reports.

## Privacy and safety boundary

- The benchmark uses one fixed synthetic passphrase compiled into the benchmark code.
- It never asks for a real passphrase, recovery phrase, health data or other user data.
- It does not call an application API or any external runtime endpoint.
- It does not use cookies, localStorage, sessionStorage, IndexedDB, analytics, telemetry or background uploads.
- Benchmark results are shown in the page and downloaded locally by an explicit user action. They are not transmitted.
- The optional device label is selected from fixed broad device/browser categories. There is no free-text field and no device fingerprint or personal identifier is collected.
- The benchmark measures Argon2id derivation plus non-extractable AES-GCM key import. It does not measure a full vault unlock, record decryption or storage performance.
- Results are performance observations, not a security audit or production KDF approval.

## Parameters

| Parameter | Candidate |
|---|---:|
| Algorithm | Argon2id v1.3 |
| Memory | 19,456 KiB |
| Iterations | 2 |
| Parallelism | 1 |
| Output | 32 bytes |
| Salt | Fresh random 16 bytes per sample |
| Samples | 1 warm-up + 5 measured |

Do not lower these settings based on a slow device result. Use slow results to review the supported-device matrix and usability target.

## Local run

Requires Node.js 24.

```bash
npm install
npm run dev
```

Open the local Vite URL and select **Run 5 measurements**. Run three independent sessions per device, allowing the device to cool between sessions. Close browser developer tools before measurement; they can distort WebAssembly benchmark results.

Android can use USB reverse port forwarding to access the host's loopback-only Vite server:

```bash
adb reverse tcp:5173 tcp:5173
```

Then open `http://localhost:5173/` on the Android device. Do not expose the dev server on a public or Wi-Fi interface.

For iPhone testing, use the temporary HTTPS GitHub Pages deployment described below. A local HTTPS preview requires a certificate trusted by the iPhone; simply enabling HTTPS with an untrusted self-signed certificate is not sufficient.

## Temporary GitHub Pages deployment

1. In this repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Open **Actions → Publish temporary benchmark to GitHub Pages**.
4. Select **Run workflow** manually from the `main` branch.
5. Open the page URL shown by the completed deployment job.

The workflow is manual-only. A normal push does not publish or update the public page. The workflow grants Pages deployment permissions only to its deployment job and uses no repository secrets.

## Cleanup when mobile benchmarking is complete

1. Stop using the public page and remove the Pages deployment in **Settings → Pages** (use GitHub's unpublish/disable control if shown).
2. Disable or remove the Pages workflow so it cannot be redeployed accidentally.
3. Keep any benchmark reports locally; do not commit them to this public repository.
4. Archive this temporary repository, or delete it from **Settings → General → Danger Zone** if you no longer need its source.

This cleanup applies only to `SanchitKRai/loc-m4-1-mobile-benchmark`. Do not archive or delete the main `future-health-male-triage` LOC repository.

## Third-party code

The only runtime dependency is `hash-wasm` 4.13.0 (MIT), bundled into the static site at build time. Vite 8.3.8 is a build-time dependency. The deployed page loads its own bundled assets from the same GitHub Pages origin; it does not load a third-party CDN at runtime.

## Scope

This is a short-lived benchmarking aid, not a production application. No LOC health data is ever required or accepted.
