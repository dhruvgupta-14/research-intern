require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const { CATEGORIES } = require("./src/config/categories");
const { getCatalogue, CORPUS_ROOT } = require("./src/lib/catalogue");
const gh = require("./src/lib/github");
const { notFound, errorHandler } = require("./src/middleware/errors");

const authRoutes = require("./src/routes/auth");
const categoryRoutes = require("./src/routes/categories");
const statsRoutes = require("./src/routes/stats");

// ---- fail at boot rather than on the first request -----------------------
function assertEnv() {
  const problems = [];
  if (!process.env.JWT_SECRET) {
    problems.push("JWT_SECRET is not set - login would throw on first use");
  }
  if (!process.env.FRONTEND_ORIGIN) {
    // cors({ origin: undefined }) allows every origin; a missing value must
    // not quietly open the API to the world
    problems.push("FRONTEND_ORIGIN is not set - refusing to start with open CORS");
  }
  if (!fs.existsSync(path.join(CORPUS_ROOT, CATEGORIES[0].dir))) {
    problems.push(`CORPUS_ROOT (${CORPUS_ROOT}) does not contain the category folders`);
  }
  if (problems.length) {
    console.error("Refusing to start:");
    for (const p of problems) console.error("  - " + p);
    process.exit(1);
  }
  if (!gh.repoInfo.configured) {
    console.warn("WARNING: GITHUB_OWNER / GITHUB_REPO are not set - file links will be null.");
  }
}
assertEnv();

const app = express();
app.disable("x-powered-by");

app.use(cors({ origin: process.env.FRONTEND_ORIGIN.split(",").map((s) => s.trim()) }));
app.use(express.json({ limit: "64kb" }));

app.use("/api", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stats", statsRoutes);

/** POST /api/refresh - rescan now, without waiting for the mtime check. */
app.post("/api/refresh", require("./src/middleware/auth"), (req, res) => {
  const t0 = Date.now();
  const c = getCatalogue({ force: true });
  res.json({
    refreshed: true,
    ms: Date.now() - t0,
    generatedAt: c.generatedAt,
    labelledFiles: c.totals.labelledFiles,
    warnings: c.warnings.length,
  });
});

app.get("/api/health", (req, res) => {
  const usersExist = fs.existsSync(path.join(__dirname, "data", "users.json"));
  try {
    const c = getCatalogue();
    res.json({
      status: usersExist ? "ok" : "no-users",
      corpusRoot: CORPUS_ROOT,
      repo: c.repo,
      generatedAt: c.generatedAt,
      categories: c.totals.categories,
      labelledFiles: c.totals.labelledFiles,
      warnings: c.warnings.length,
    });
  } catch (err) {
    res.status(503).json({ status: "degraded", error: err.message });
  }
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// warm the cache so the first dashboard load is not the one that pays for it
const t0 = Date.now();
try {
  const c = getCatalogue({ force: true });
  const tasks = Object.entries(c.totals.stats)
    .map(([t, s]) => `${t} ${s.Easy}/${s.Medium}/${s.Hard}`)
    .join("  ");
  console.log(`Catalogue built in ${Date.now() - t0} ms | ` +
              `${c.totals.categories} categories, ${c.totals.labelledFiles} labelled files, ` +
              `${c.warnings.length} warning(s)`);
  console.log(`Easy/Medium/Hard by task: ${tasks}`);
} catch (err) {
  console.error("Catalogue build failed at boot:", err.message);
}

app.listen(PORT, () => {
  console.log(`Corpus : ${CORPUS_ROOT}`);
  console.log(`GitHub : ${gh.repoInfo.configured
    ? `${gh.repoInfo.owner}/${gh.repoInfo.name}@${gh.repoInfo.branch}`
    : "(not configured)"}`);
  console.log(`Server running on http://localhost:${PORT}`);
});
