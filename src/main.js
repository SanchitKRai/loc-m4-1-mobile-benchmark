import { argon2id } from "hash-wasm";

const BENCHMARK_PASSPHRASE =
  "LOC synthetic Argon2id benchmark only - never a real user credential";

const PARAMETERS = Object.freeze({
  algorithm: "Argon2id v1.3",
  memorySizeKiB: 19_456,
  iterations: 2,
  parallelism: 1,
  hashLengthBytes: 32,
  saltBytes: 16,
  measuredSamples: 5,
});

const runButton = document.querySelector("#run-benchmark");
const downloadButton = document.querySelector("#download-report");
const deviceLabelInput = document.querySelector("#device-label");
const statusElement = document.querySelector("#status");
const metricGrid = document.querySelector("#metric-grid");
const medianElement = document.querySelector("#median");
const minimumElement = document.querySelector("#minimum");
const maximumElement = document.querySelector("#maximum");
const reportElement = document.querySelector("#report");

if (
  !runButton ||
  !downloadButton ||
  !deviceLabelInput ||
  !statusElement ||
  !metricGrid ||
  !medianElement ||
  !minimumElement ||
  !maximumElement ||
  !reportElement
) {
  throw new Error("Benchmark page is missing a required element.");
}

let latestReport = null;

function randomBytes(length) {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("A cryptographically secure random generator is unavailable.");
  }
  return globalThis.crypto.getRandomValues(new Uint8Array(length));
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function roundMilliseconds(value) {
  return Math.round(value * 10) / 10;
}

async function deriveAndImportKey() {
  if (!globalThis.isSecureContext || !globalThis.crypto?.subtle) {
    throw new Error("Web Crypto is unavailable. Open this page using HTTPS or localhost.");
  }

  const salt = randomBytes(PARAMETERS.saltBytes);
  let derivedKeyBytes;

  const startedAt = performance.now();
  try {
    derivedKeyBytes = await argon2id({
      password: BENCHMARK_PASSPHRASE,
      salt,
      parallelism: PARAMETERS.parallelism,
      iterations: PARAMETERS.iterations,
      memorySize: PARAMETERS.memorySizeKiB,
      hashLength: PARAMETERS.hashLengthBytes,
      outputType: "binary",
    });

    if (!(derivedKeyBytes instanceof Uint8Array) ||
        derivedKeyBytes.byteLength !== PARAMETERS.hashLengthBytes) {
      throw new Error("Argon2id returned an unexpected output.");
    }

    // Match the LOC spike's measured work: KDF plus non-extractable AES key import.
    const key = await globalThis.crypto.subtle.importKey(
      "raw",
      derivedKeyBytes,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"],
    );
    void key;

    return performance.now() - startedAt;
  } finally {
    derivedKeyBytes?.fill(0);
    salt.fill(0);
  }
}

async function runSession() {
  const warmupMs = await deriveAndImportKey();
  const samples = [];

  for (let index = 0; index < PARAMETERS.measuredSamples; index += 1) {
    statusElement.textContent =
      "Measuring Argon2id · sample " +
      (index + 1) +
      " of " +
      PARAMETERS.measuredSamples +
      "…";

    samples.push(await deriveAndImportKey());
  }

  return {
    warmupMs: roundMilliseconds(warmupMs),
    samplesMs: samples.map(roundMilliseconds),
    minMs: roundMilliseconds(Math.min(...samples)),
    medianMs: roundMilliseconds(median(samples)),
    maxMs: roundMilliseconds(Math.max(...samples)),
  };
}

runButton.addEventListener("click", async () => {
  runButton.disabled = true;
  downloadButton.disabled = true;
  latestReport = null;
  metricGrid.hidden = true;
  reportElement.hidden = true;
  statusElement.textContent = "Warming up the Argon2id engine…";

  try {
    const result = await runSession();
    const report = {
      benchmark: "LOC M4.1 Argon2id passphrase derivation",
      dataClassification: "Synthetic benchmark only; no health data or user credential",
      generatedAt: new Date().toISOString(),
      deviceLabel: deviceLabelInput.value.trim() || "Not supplied",
      parameters: {
        algorithm: PARAMETERS.algorithm,
        memorySizeKiB: PARAMETERS.memorySizeKiB,
        iterations: PARAMETERS.iterations,
        parallelism: PARAMETERS.parallelism,
        hashLengthBytes: PARAMETERS.hashLengthBytes,
        saltBytes: PARAMETERS.saltBytes,
      },
      warmupMs: result.warmupMs,
      repetitions: result.samplesMs.length,
      samplesMs: result.samplesMs,
      minMs: result.minMs,
      medianMs: result.medianMs,
      maxMs: result.maxMs,
      localOnly: true,
      interpretation:
        "Performance measurement only. Not a cryptographic audit or production KDF approval.",
    };

    latestReport = report;
    medianElement.textContent = result.medianMs.toFixed(1) + " ms";
    minimumElement.textContent = result.minMs.toFixed(1) + " ms";
    maximumElement.textContent = result.maxMs.toFixed(1) + " ms";
    metricGrid.hidden = false;
    reportElement.textContent = JSON.stringify(report, null, 2);
    reportElement.hidden = false;
    downloadButton.disabled = false;
    statusElement.textContent =
      "Complete. Results are shown locally; no report was uploaded or saved by the page.";
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown benchmark error.";
    statusElement.textContent = "Benchmark failed: " + message;
  } finally {
    runButton.disabled = false;
  }
});

downloadButton.addEventListener("click", () => {
  if (!latestReport) return;

  const blob = new Blob([JSON.stringify(latestReport, null, 2)], {
    type: "application/json",
  });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = "loc-m4-1-argon2id-benchmark.json";
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
});
