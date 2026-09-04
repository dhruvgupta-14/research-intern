const express = require("express");
const fs = require("fs");
const path = require("path");
const verifyToken = require("../middleware/auth");
const { HttpError, asyncRoute } = require("../middleware/errors");
const { CATEGORIES, categoryBySlug } = require("../config/categories");
const { getCatalogue, getCategory, CORPUS_ROOT } = require("../lib/catalogue");

const router = express.Router();

/**
 * GET /api/categories
 * All six with their file sections and stats - everything the dashboard needs
 * to render every category page in one call.
 */
router.get("/", verifyToken, asyncRoute((req, res) => {
  const catalogue = getCatalogue();
  const scanned = new Map(catalogue.categories.map((c) => [c.slug, c]));
  res.json({
    generatedAt: catalogue.generatedAt,
    repo: catalogue.repo,
    categories: CATEGORIES.map((c) => scanned.get(c.slug) || {
      ...c, status: "missing",
      links: {}, info: { present: false },
      sections: {
        original: { folder: null, files: [] },
        labelled: { folder: null, files: [] },
        scripts: { folder: null, files: [] },
      },
      stats: {},
    }),
  });
}));

/** GET /api/categories/:slug */
router.get("/:slug", verifyToken, asyncRoute((req, res) => {
  const meta = categoryBySlug(req.params.slug);
  if (!meta) throw new HttpError(404, `Unknown category "${req.params.slug}"`);
  const category = getCategory(meta.slug);
  if (!category) throw new HttpError(404, `${meta.dir}/ is not present in the corpus`);
  res.json({
    ...category,
    warnings: getCatalogue().warnings.filter((w) => w.category === meta.slug),
  });
}));

/**
 * GET /api/categories/:slug/info
 * info.md as written. It is the handover document - what was decided and what
 * is known-broken - so the dashboard renders it rather than sending anyone to
 * find the file.
 */
router.get("/:slug/info", verifyToken, asyncRoute((req, res) => {
  const meta = categoryBySlug(req.params.slug);
  if (!meta) throw new HttpError(404, `Unknown category "${req.params.slug}"`);

  const file = path.join(CORPUS_ROOT, meta.dir, "info.md");
  let markdown;
  try {
    markdown = fs.readFileSync(file, "utf-8");
  } catch (err) {
    if (err.code === "ENOENT") throw new HttpError(404, `No info.md for ${meta.name}`);
    throw err;
  }
  const category = getCategory(meta.slug);
  res.json({
    slug: meta.slug,
    path: `${meta.dir}/info.md`,
    url: category ? category.links.info : null,
    updatedAt: fs.statSync(file).mtime.toISOString(),
    markdown,
  });
}));

module.exports = router;
