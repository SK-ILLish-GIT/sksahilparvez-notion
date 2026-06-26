#!/usr/bin/env node
/**
 * Fetches Codolio profile and writes a snapshot for static fallback.
 * Usage: npm run sync:codolio
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const USER_KEY = "RzgB5KfU";
const API_URL = `https://api.codolio.com/profile?userKey=${USER_KEY}`;
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "../src/data/content/codolio-snapshot.json");

const res = await fetch(API_URL, {
  headers: { referer: "https://codolio.com/" },
});

if (!res.ok) {
  console.error(`Codolio sync failed: HTTP ${res.status}`);
  process.exit(1);
}

const json = await res.json();

if (!json.status?.success) {
  console.error("Codolio sync failed: API returned failure");
  process.exit(1);
}

const snapshot = {
  syncedAt: new Date().toISOString(),
  data: json.data,
};

writeFileSync(OUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Wrote ${OUT_PATH}`);
