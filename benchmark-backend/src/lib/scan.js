/**
 * Corpus scanner.
 *
 * The repository is the source of truth. For each of the six category folders
 * this lists the files in three fixed sections, notes the info.md, and reads
 * one thing only: the labelled data, tallied as task_type -> Easy/Medium/Hard.
 *
 * Deliberately not derived: row counts of the originals, coverage, or the
 * difficulty column that ships inside a source file. The labelled data is the
 * only statistic, so the dashboard cannot present a vendor's grading or a
 * half-finished coverage figure as if it were ours.
 *
 * Nothing here writes to the corpus.
 */

const fs = require("fs");
const path = require("path");
const { CATEGORIES } = require("../config/categories");
const gh = require("./github");

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

/** The three folders a category is expected to contain, and how to spot them. */
const SECTIONS = {
  original: { label: "Original Datasets", match: (d) => /^original/i.test(d) },
  labelled: { label: "Difficulty Labelled Data", match: (d) => /^difficulty/i.test(d) },
  scripts: { label: "Scripts", match: (d) => /^scripts$/i.test(d) },
};

// artifacts that sit beside the data but are not data
const SKIP_FILE = /(_removed_rows|_audit|_original_task_types)\b|\.(bak|tmp)$/i;
const DATA_EXT = /\.jsonl$/i;
const SCRIPT_EXT = /\.(ipynb|py)$/i;

function listDir(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function statOf(abs) {
  try {
    const s = fs.statSync(abs);
    return { sizeKB: Math.round(s.size / 1024), updatedAt: s.mtime.toISOString() };
  } catch {
    return { sizeKB: 0, updatedAt: null };
  }
}

function fileEntry(repoPath, absPath) {
  return {
    name: path.basename(repoPath),
    path: repoPath,
    ...statOf(absPath),
    url: gh.blobUrl(repoPath),
    raw: gh.rawUrl(repoPath),
  };
}

const emptyBucket = () => ({ Easy: 0, Medium: 0, Hard: 0 });

/** Merge `from` into `into`, keyed by task type. */
function mergeStats(into, from) {
  for (const [task, counts] of Object.entries(from)) {
    if (!into[task]) into[task] = emptyBucket();
    for (const level of DIFFICULTIES) into[task][level] += counts[level] || 0;
  }
  return into;
}

/**
 * Tally one labelled file as task_type -> Easy/Medium/Hard.
 * `task_type` is read from the rows, not the filename: the rows are the truth,
 * and a file holding two task types simply produces two keys.
 */
function readLabelled(absPath) {
  const stats = {};
  const problems = [];
  let text;
  try {
    text = fs.readFileSync(absPath, "utf-8");
  } catch (err) {
    return { stats, problems: [`unreadable (${err.code || err.message})`] };
  }

  let badJson = 0;
  let unlabelled = 0;
  let unknownTask = 0;

  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    let row;
    try {
      row = JSON.parse(t);
    } catch {
      badJson += 1;
      continue;
    }

    const task = row.task_type || "(no task_type)";
    if (!row.task_type) unknownTask += 1;
    const level = row.difficulty;
    if (!DIFFICULTIES.includes(level)) {
      unlabelled += 1;
      continue;
    }
    if (!stats[task]) stats[task] = emptyBucket();
    stats[task][level] += 1;
  }

  if (badJson) problems.push(`${badJson} malformed JSON line(s)`);
  if (unlabelled) problems.push(`${unlabelled} row(s) with no Easy/Medium/Hard difficulty`);
  if (unknownTask) problems.push(`${unknownTask} row(s) with no task_type`);
  return { stats, problems };
}

/**
 * Walk the corpus.
 * @param {string} corpusRoot absolute path to the repository checkout
 */
function scanCorpus(corpusRoot) {
  const warnings = [];
  const categories = [];
  const totalStats = {};

  for (const cat of CATEGORIES) {
    const catDir = path.join(corpusRoot, cat.dir);
    if (!fs.existsSync(catDir)) {
      warnings.push({ level: "warn", category: cat.slug,
                      message: `folder ${cat.dir}/ not found` });
      continue;
    }

    const entries = listDir(catDir);
    const dirNames = entries.filter((e) => e.isDirectory()).map((e) => e.name);

    // resolve the three section folders by name; anything else is ignored, so
    // leftovers like Cultural_Difficulty/ simply do not appear
    const found = {};
    for (const [key, spec] of Object.entries(SECTIONS)) {
      found[key] = dirNames.find(spec.match) || null;
      if (!found[key]) {
        warnings.push({ level: "warn", category: cat.slug,
                        message: `no "${spec.label}" folder` });
      }
    }

    const collect = (dirName, extFilter) => {
      if (!dirName) return [];
      return listDir(path.join(catDir, dirName))
        .filter((e) => e.isFile() && extFilter.test(e.name) && !SKIP_FILE.test(e.name))
        .map((e) => fileEntry(
          path.posix.join(cat.dir, dirName, e.name),
          path.join(catDir, dirName, e.name)
        ))
        .sort((a, b) => a.name.localeCompare(b.name));
    };

    const original = collect(found.original, DATA_EXT);
    const scripts = collect(found.scripts, SCRIPT_EXT);

    // labelled files are the only ones whose contents we read
    const labelled = collect(found.labelled, DATA_EXT).map((f) => {
      const abs = path.join(corpusRoot, f.path);
      const { stats, problems } = readLabelled(abs);
      for (const p of problems) {
        warnings.push({ level: "warn", category: cat.slug, file: f.path, message: p });
      }
      return { ...f, stats };
    });

    const catStats = labelled.reduce((acc, f) => mergeStats(acc, f.stats), {});
    mergeStats(totalStats, catStats);

    const infoAbs = path.join(catDir, "info.md");
    const infoPresent = fs.existsSync(infoAbs) && fs.statSync(infoAbs).size > 0;
    if (!infoPresent) {
      warnings.push({ level: "warn", category: cat.slug, message: "no info.md" });
    }
    if (!original.length) {
      warnings.push({ level: "warn", category: cat.slug, message: "no original datasets found" });
    }

    categories.push({
      slug: cat.slug,
      dir: cat.dir,
      name: cat.name,
      short: cat.short,
      status: labelled.length ? "labelled" : "pending",
      links: {
        folder: gh.treeUrl(cat.dir),
        info: infoPresent ? gh.blobUrl(`${cat.dir}/info.md`) : null,
      },
      info: {
        present: infoPresent,
        path: infoPresent ? `${cat.dir}/info.md` : null,
        updatedAt: infoPresent ? statOf(infoAbs).updatedAt : null,
      },
      sections: {
        original: { folder: found.original, files: original },
        labelled: { folder: found.labelled, files: labelled },
        scripts: { folder: found.scripts, files: scripts },
      },
      stats: catStats,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    repo: gh.repoInfo,
    totals: {
      categories: categories.length,
      labelledFiles: categories.reduce((a, c) => a + c.sections.labelled.files.length, 0),
      stats: totalStats,
    },
    categories,
    warnings,
  };
}

module.exports = { scanCorpus, SECTIONS, DIFFICULTIES, mergeStats };
