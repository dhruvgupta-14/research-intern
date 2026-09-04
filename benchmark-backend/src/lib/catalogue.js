/**
 * Catalogue cache.
 *
 * There is no datastore. The corpus checkout is the only state, so this holds
 * one scan in memory and rebuilds it when the files on disk change.
 *
 * Staleness is decided by the newest mtime across the six category folders,
 * which is far cheaper than rescanning and means an edit to any tracked file
 * is picked up on the next request without a restart.
 */

const fs = require("fs");
const path = require("path");
const { CATEGORIES } = require("../config/categories");
const { scanCorpus } = require("./scan");

const BACKEND_ROOT = path.resolve(__dirname, "..", "..");
const CORPUS_ROOT = process.env.CORPUS_ROOT || path.resolve(BACKEND_ROOT, "..");

let cache = null;

function fingerprint() {
  let newest = 0;
  const walk = (dir, depth) => {
    if (depth > 2) return;
    for (const e of (() => {
      try {
        return fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        return [];
      }
    })()) {
      const p = path.join(dir, e.name);
      try {
        const st = fs.statSync(p);
        if (st.mtimeMs > newest) newest = st.mtimeMs;
        if (e.isDirectory()) walk(p, depth + 1);
      } catch {
        /* vanished mid-walk; ignore */
      }
    }
  };
  for (const c of CATEGORIES) walk(path.join(CORPUS_ROOT, c.dir), 0);
  return newest;
}

function build() {
  const catalogue = scanCorpus(CORPUS_ROOT);
  cache = { catalogue, fingerprint: fingerprint() };
  return catalogue;
}

function getCatalogue({ force = false } = {}) {
  if (force || !cache) return build();
  if (fingerprint() !== cache.fingerprint) return build();
  return cache.catalogue;
}

function getCategory(slug) {
  return getCatalogue().categories.find((c) => c.slug === slug) || null;
}

module.exports = { getCatalogue, getCategory, CORPUS_ROOT, BACKEND_ROOT };
