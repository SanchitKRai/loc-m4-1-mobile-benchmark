# LOC M4.1 — Live Mobile Benchmark Runs & Device Metadata

This directory stores the nine empirical Argon2id key derivation benchmark reports captured from the live deployment at [https://sanchitkrai.github.io/loc-m4-1-mobile-benchmark/](https://sanchitkrai.github.io/loc-m4-1-mobile-benchmark/).

---

## 1. Hardware & Environment Metadata

To ensure reproducibility without recording personal identifiers or serial numbers, the measured profiles correspond to the following device classes and runtimes:

| Profile Label | Device Model / Class | OS Version | Browser Runtime |
| :--- | :--- | :--- | :--- |
| **Android phone · Chrome** | Modern Android smartphone (ARM64 architecture) | Android 14+ | Chrome Mobile 120+ / Chromium modern engine |
| **iPhone or iPad · Safari** | Apple mobile device (A-series / M-series silicon) | iOS 17+ / iPadOS 17+ | Mobile Safari (WebKit runtime) |
| **Other mobile browser** | Mobile device (alternative mobile browser) | Mobile operating system | Alternative mobile browser engine |

---

## 2. Benchmark Protocol & Candidate Parameters

- **KDF Algorithm:** Argon2id v1.3 (WebAssembly via `hash-wasm`)
- **Memory Cost:** `19,456 KiB` (~19 MiB)
- **Time Cost (Iterations):** `2`
- **Parallelism (Threads):** `1`
- **Output Key Length:** `32 bytes` (256-bit AES-GCM Key)
- **Salt:** Fresh cryptographic 16-byte random salt per sample
- **Measured Scope:** 1 warm-up iteration + 5 timed iterations per session
- **Timed Work:** Argon2id passphrase derivation + Web Crypto non-extractable AES-GCM key import

---

## 3. Performance Summary (9 Sessions)

| Device Profile | Run | Warmup | Sample 1 | Sample 2 | Sample 3 | Sample 4 | Sample 5 | **Session Median** | Min | Max |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Android phone · Chrome** | **Run 1** | 57.4 ms | 48.4 ms | 43.5 ms | 53.6 ms | 42.0 ms | 41.8 ms | **43.5 ms** | 41.8 ms | 53.6 ms |
| | **Run 2** | 47.2 ms | 44.0 ms | 43.8 ms | 45.2 ms | 42.6 ms | 42.7 ms | **43.8 ms** | 42.6 ms | 45.2 ms |
| | **Run 3** | 45.4 ms | 43.2 ms | 44.9 ms | 43.5 ms | 43.4 ms | 43.9 ms | **43.5 ms** | 43.2 ms | 44.9 ms |
| **iPhone or iPad · Safari** | **Run 1** | 45.1 ms | 46.7 ms | 55.6 ms | 46.4 ms | 52.5 ms | 44.1 ms | **46.7 ms** | 44.1 ms | 55.6 ms |
| | **Run 2** | 46.5 ms | 43.7 ms | 44.0 ms | 45.1 ms | 47.3 ms | 51.0 ms | **45.1 ms** | 43.7 ms | 51.0 ms |
| | **Run 3** | 43.5 ms | 43.7 ms | 43.9 ms | 44.9 ms | 43.6 ms | 42.6 ms | **43.7 ms** | 42.6 ms | 44.9 ms |
| **Other mobile browser** | **Run 1** | 42.8 ms | 43.6 ms | 43.1 ms | 43.7 ms | 41.7 ms | 45.1 ms | **43.6 ms** | 41.7 ms | 45.1 ms |
| | **Run 2** | 42.8 ms | 46.0 ms | 47.9 ms | 43.9 ms | 43.9 ms | 41.7 ms | **43.9 ms** | 41.7 ms | 47.9 ms |
| | **Run 3** | 43.3 ms | 42.7 ms | 41.7 ms | 42.8 ms | 41.0 ms | 41.3 ms | **41.7 ms** | 41.0 ms | 42.8 ms |

- **Comparison to Desktop Baseline:**
  - Desktop baseline (Windows development laptop): **~48.9 ms**
  - Android Chrome average median: **43.6 ms** (~5.3 ms lower)
  - iPhone Safari average median: **45.2 ms** (~3.7 ms lower)
  - Other mobile average median: **43.1 ms** (~5.8 ms lower)

---

## 4. Privacy & Network Boundary

> **Privacy Note:** The benchmark page does not upload benchmark results, and **no benchmark data or health data is transmitted**. Loading the public GitHub Pages site necessarily involves static asset network requests to GitHub.

---

## 5. M4.1 Milestone Status

- **Mobile performance measurements:** **Collected and arithmetically validated** (9 sessions; each 1 warm-up + 5 measured derivation/key-import samples)
- **Independent cryptographic review:** **Pending**
- **Production dependency lockfile:** **Pending**
- **M4.2 encrypted persistence:** **Blocked** (IndexedDB persistence remains blocked until independent cryptographic review and production lockfile gates are satisfied)


## 6. Interpretation & validation notes

- The timed operation is **Argon2id v1.3 passphrase derivation plus Web Crypto import of a non-extractable AES-GCM key**. These figures are not full vault-unlock latency and do not include IndexedDB, record decryption, application rendering or user interaction.
- All nine JSON files were checked against their five `samplesMs` values. Every stored `medianMs`, `minMs` and `maxMs` matches the values recalculated from its samples.
- Average of the three session medians:
  - Android Chrome: **43.57 ms** (reported as **43.6 ms**)
  - iPhone / iPad Safari: **45.17 ms** (reported as **45.2 ms**)
  - Other mobile browser: **43.07 ms** (reported as **43.1 ms**)
  - All nine mobile sessions combined: **43.93 ms** (reported as **43.9 ms**)
- Across all 45 mobile samples, the pooled median is **43.8 ms**, with a lowest sample of **41.0 ms** and highest sample of **55.6 ms**. Warm-up measurements are excluded from these aggregates.
- The desktop reference of **48.9 ms** is the average of its three session medians (45.5, 53.8 and 47.3 ms). The desktop raw five-sample sessions are not stored in this directory, so the desktop comparison is a supplied reference rather than a revalidated pooled comparison.
- Device descriptions are intentionally broad and do not include exact model identifiers, exact OS build numbers or exact browser build numbers. The "Other mobile browser" profile is not sufficiently identified to add a named browser/engine to the support matrix. These reports demonstrate measurements from the labelled browser profiles, but do not prove compatibility across all devices in those categories.
- The mobile numbers are lower than the desktop reference in these observed sessions. This should not be interpreted as evidence that mobile devices are generally faster; the devices, OS versions and runtime configurations are not matched head-to-head.
- The candidate Argon2id parameters remain unchanged: **19,456 KiB memory, 2 iterations, parallelism 1, 32-byte output**. Performance observations alone do not establish password-guessing resistance or security suitability.

