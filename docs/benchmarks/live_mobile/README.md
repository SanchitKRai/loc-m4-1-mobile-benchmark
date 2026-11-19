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
  - Android Chrome average median: **43.6 ms** (~5.3 ms faster)
  - iPhone Safari average median: **45.2 ms** (~3.7 ms faster)
  - Other mobile average median: **43.1 ms** (~5.8 ms faster)

---

## 4. Privacy & Network Boundary

> **Privacy Note:** The benchmark page does not upload benchmark results, and **no benchmark data or health data is transmitted**. Loading the public GitHub Pages site necessarily involves static asset network requests to GitHub.

---

## 5. M4.1 Milestone Status

- **Mobile performance measurements:** **Promising** (~41–47 ms unlock latency observed across profiles)
- **Independent cryptographic review:** **Pending**
- **Production dependency lockfile:** **Pending**
- **M4.2 encrypted persistence:** **Blocked** (IndexedDB persistence remains blocked until independent cryptographic review and production lockfile gates are satisfied)
