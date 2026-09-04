/**
 * GitHub link building.
 *
 * The repository is the source of truth, so every file the dashboard shows
 * links back to it. We read the working copy from disk and only use GitHub to
 * address it - no API calls, no rate limits, no token.
 *
 * Paths contain spaces ("Original Datasets/"), so each segment is encoded
 * individually: encodeURIComponent on the whole path would eat the slashes.
 */

const OWNER = process.env.GITHUB_OWNER || "";
const REPO = process.env.GITHUB_REPO || "";
const BRANCH = process.env.GITHUB_BRANCH || "main";

const configured = Boolean(OWNER && REPO);

function encodePath(repoPath) {
  return String(repoPath)
    .split("/")
    .map(encodeURIComponent)
    .join("/");
}

/** Link to a file's rendered page on github.com. */
function blobUrl(repoPath) {
  if (!configured) return null;
  return `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${encodePath(repoPath)}`;
}

/** Link to the file's raw bytes - what you fetch or curl. */
function rawUrl(repoPath) {
  if (!configured) return null;
  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${encodePath(repoPath)}`;
}

/** Link to a folder listing. */
function treeUrl(repoPath) {
  if (!configured) return null;
  return `https://github.com/${OWNER}/${REPO}/tree/${BRANCH}/${encodePath(repoPath)}`;
}

const repoInfo = { owner: OWNER, name: REPO, branch: BRANCH, configured };

module.exports = { blobUrl, rawUrl, treeUrl, repoInfo };
