const express = require("express");
const verifyToken = require("../middleware/auth");
const { asyncRoute } = require("../middleware/errors");
const { getCatalogue } = require("../lib/catalogue");
const { DIFFICULTIES } = require("../lib/scan");

const router = express.Router();

/** Easy/Medium/Hard totals across every task type. */
function flatten(stats) {
  const out = { Easy: 0, Medium: 0, Hard: 0, total: 0 };
  for (const counts of Object.values(stats)) {
    for (const level of DIFFICULTIES) {
      out[level] += counts[level] || 0;
      out.total += counts[level] || 0;
    }
  }
  return out;
}

/**
 * GET /api/stats
 *
 * The landing page in one call. Every number comes from the labelled data -
 * there are no row counts, no coverage and no source difficulty, so nothing
 * here can be mistaken for a figure we did not measure.
 */
router.get("/", verifyToken, asyncRoute((req, res) => {
  const catalogue = getCatalogue();
  res.json({
    generatedAt: catalogue.generatedAt,
    repo: catalogue.repo,
    totals: {
      ...catalogue.totals,
      overall: flatten(catalogue.totals.stats),
    },
    categories: catalogue.categories.map((c) => ({
      slug: c.slug,
      short: c.short,
      name: c.name,
      status: c.status,
      hasInfo: c.info.present,
      files: {
        original: c.sections.original.files.length,
        labelled: c.sections.labelled.files.length,
        scripts: c.sections.scripts.files.length,
      },
      stats: c.stats,
      overall: flatten(c.stats),
    })),
    warnings: catalogue.warnings,
  });
}));

module.exports = router;
