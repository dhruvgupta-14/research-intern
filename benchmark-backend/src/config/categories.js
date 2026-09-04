/**
 * The six benchmark categories.
 *
 * This is the single source of truth. The API validates against it and the
 * build step emits it for the frontend, so the list cannot drift between the
 * two the way it did when six files each kept their own copy.
 *
 * `dir` is the folder name in the corpus root; `name` is what the UI shows and
 * what is stored on a dataset record.
 */

const CATEGORIES = [
  {
    slug: "multilingual",
    dir: "MULTILINGUAL",
    name: "Multilingual Understanding and Generation Benchmarks",
    short: "Multilingual",
  },
  {
    slug: "cultural",
    dir: "Cultural",
    name: "Cultural Knowledge and Reasoning Datasets",
    short: "Cultural",
  },
  {
    slug: "bias",
    dir: "Bias",
    name: "Social Bias and Stereotype Evaluation Datasets",
    short: "Bias",
  },
  {
    slug: "legal",
    dir: "Legal",
    name: "Legal, Governance, and Institutional Datasets",
    short: "Legal",
  },
  {
    slug: "code-mixed",
    dir: "Code-Mixed",
    name: "Code-Switching and Informal Language Datasets",
    short: "Code-Switching",
  },
  {
    slug: "pretrained",
    dir: "Pretrained",
    name: "Pre-training and Instruction-Tuning Corpora",
    short: "Pre-training",
  },
];

const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

const bySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));
const byDir = new Map(CATEGORIES.map((c) => [c.dir.toLowerCase(), c]));
const byName = new Map(CATEGORIES.map((c) => [c.name, c]));

module.exports = {
  CATEGORIES,
  CATEGORY_NAMES,
  categoryBySlug: (slug) => bySlug.get(slug) || null,
  categoryByDir: (dir) => byDir.get(String(dir).toLowerCase()) || null,
  categoryByName: (name) => byName.get(name) || null,
  isValidCategory: (name) => byName.has(name),
};
