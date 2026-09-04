/**
 * Seed data/users.json from the USER* environment variables.
 *
 * Runs automatically before `npm start` (see the prestart script). That matters
 * on Render: users.json is gitignored, so a deployed instance would otherwise
 * boot with no accounts to log in with.
 *
 *   node utils/seedUsers.js           create the file if it is missing
 *   node utils/seedUsers.js --force   rewrite it even if it already exists
 *
 * Without --force an existing file is left alone, so running this on every
 * start does not churn the hashes or surprise anyone locally.
 */

const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;
const DATA_DIR = path.join(__dirname, "..", "data");
const OUT_PATH = path.join(DATA_DIR, "users.json");
const force = process.argv.includes("--force");

function writeJSON(filePath, data) {
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmp, filePath);
}

function existingCount() {
  try {
    const users = JSON.parse(fs.readFileSync(OUT_PATH, "utf-8"));
    return Array.isArray(users) ? users.length : 0;
  } catch {
    return 0;
  }
}

function seed() {
  const already = existingCount();
  if (already && !force) {
    console.log(`users.json already has ${already} account(s) - leaving it alone.`);
    console.log("Run with --force to rewrite it from the environment.");
    return;
  }

  const pairs = [
    { username: process.env.USER1_NAME, password: process.env.USER1_PASS },
    { username: process.env.USER2_NAME, password: process.env.USER2_PASS },
  ].filter((u) => u.username && u.password);

  if (!pairs.length) {
    console.error("No USER1_NAME/USER1_PASS (or USER2_*) set - cannot seed.");
    console.error("Set them in .env locally, or in the Render dashboard.");
    process.exit(1);
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  writeJSON(
    OUT_PATH,
    pairs.map((u) => ({
      username: u.username,
      passwordHash: bcrypt.hashSync(u.password, SALT_ROUNDS),
    }))
  );
  console.log(
    `Seeded ${pairs.length} user(s) to ${OUT_PATH}: ` +
    pairs.map((u) => u.username).join(", ")
  );
}

seed();
