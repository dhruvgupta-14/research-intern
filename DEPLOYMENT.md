# Deployment

One repository holds everything: the benchmark corpus, the API, and the
dashboard.

```
research_intern/                 the repo root, and CORPUS_ROOT
├── Bias/ Code-Mixed/ Cultural/ Legal/ MULTILINGUAL/ Pretrained/
├── benchmark-backend/           → Render   (build/start cd into it)
├── benchmark-frontend/          → Vercel   (Root Directory)
├── render.yaml                  optional Render Blueprint
└── .gitignore
```

**Why one repository.** The API reads the corpus off disk — it walks the six
category folders and tallies the labelled data. Both Render and Vercel clone
the whole repository regardless of which subfolder they build, so keeping the
corpus alongside the backend is what makes `CORPUS_ROOT` resolve without any
extra plumbing. Splitting them would mean a submodule, a
build-time clone with a token, or rewriting the scanner to fetch over the
GitHub API.

The corpus is ~104 MB with a largest file of 8.7 MB, comfortably inside
GitHub's limits. No Git LFS required.

---

## 1. GitHub

Commit with the root `.gitignore` in place, then push. **Private** is the right
default for unpublished research data; Render and Vercel both read private
repositories once you authorise their GitHub app.

Before the first push, confirm `git status` shows none of these:

```
benchmark-backend/.env               JWT secret and both passwords
benchmark-frontend/.env              API URL
benchmark-backend/data/users.json    bcrypt hashes
*.bak                                corpus cleanup backups
```

If a secret does get committed, rotating `JWT_SECRET` and both passwords is
faster and safer than rewriting history.

---

## 2. Render — the backend, first

Render's URL is needed by Vercel, so deploy it first.

**New → Web Service → your repository**

| setting | value |
|---|---|
| Root Directory | **leave blank** |
| Build Command | `cd benchmark-backend && npm install` |
| Start Command | `cd benchmark-backend && npm start` |
| Health Check Path | `/api/health` |

**Do not set Root Directory**, even though it looks like the obvious choice.
Render's own description explains why:

> If set, Render runs commands from this directory instead of the repository
> root. *Additionally, code changes outside of this directory do not trigger an
> auto-deploy.*

The corpus lives outside `benchmark-backend/`, so with Root Directory set,
pushing new labelled data would **not** redeploy — the dashboard would keep
serving stale numbers until someone clicked Manual Deploy. Running from the
repo root instead means every push redeploys, which is what you want, since
the corpus is the thing that changes. The cost is that a frontend-only commit
also rebuilds the backend; on the free tier that is a minute of build time and
nothing else.

Environment variables — see `benchmark-backend/.env.example` for the full list
with comments:

```
NODE_VERSION=22
JWT_SECRET=<long random string>
JWT_EXPIRES_IN=8h
USER1_NAME / USER1_PASS
USER2_NAME / USER2_PASS
GITHUB_OWNER=<your github username>
GITHUB_REPO=research-intern
GITHUB_BRANCH=main
FRONTEND_ORIGIN=http://localhost:5173      ← placeholder, fixed in step 4
```

**Leave `CORPUS_ROOT` unset.** The backend derives it from `__dirname`, not
from the working directory, so it resolves to the repo root whether commands
run there or inside `benchmark-backend/`:

```
/opt/render/project/src/          the whole repo is always cloned
├── Bias/ Cultural/ MULTILINGUAL/ …     ← CORPUS_ROOT points here
└── benchmark-backend/                  ← where the commands run
```

Root Directory only ever changed *where commands run* — Render clones the
entire repository regardless. That is what makes one repo work.

`npm start` runs a `prestart` hook that seeds `data/users.json` from the
`USER*` variables. That file is gitignored, so without the hook a deployed
instance would have no accounts. Changing a password later means editing the
env var, deleting `data/users.json`, and restarting — or running
`npm run seed` (which forces a rewrite).

---

## 3. Vercel — the frontend

**Add New → Project → the same repository**

| setting | value |
|---|---|
| Root Directory | `benchmark-frontend` |
| Framework | Vite (detected) |
| Build Command | `npm run build` |
| Output Directory | `dist` |

One environment variable:

```
VITE_API_URL = https://<your-service>.onrender.com/api
```

It is read at **build time**, so changing it later needs a redeploy, not just a
restart.

`benchmark-frontend/vercel.json` provides the SPA fallback rewrite. Without it,
loading a deep link such as `/c/cultural` returns 404, because only `/` exists
as a real file.

---

## 4. Close the loop

Back on Render, set `FRONTEND_ORIGIN` to the Vercel production URL and
redeploy. A comma-separated list works, so

```
FRONTEND_ORIGIN=https://<your-app>.vercel.app,http://localhost:5173
```

keeps local development pointed at the deployed API as well.

---

## Things that will surprise you

**Corpus changes need a backend redeploy.** The API reads files from disk, so
new labelled data only appears once Render has pulled the commit. Push to
`main` → Render auto-deploys → the dashboard updates. The **Rescan** button
re-reads the disk; it cannot pull from GitHub. This is also why Root Directory
is left blank — see step 2.

**Render's free tier sleeps after ~15 minutes idle.** The next request takes
30–60 s while the service wakes, and the dashboard will show *"Could not reach
the API"* because the request times out first. Not broken — cold.

**Vercel preview deployments get unique URLs** that will not match
`FRONTEND_ORIGIN`, so previews fail CORS. Either accept that only production
works, or add the preview domain when you need it.

---

## Running locally

```
benchmark-backend    npm install && npm start     → :5000
benchmark-frontend   npm install && npm run dev   → :5173
```

Copy both `.env.example` files to `.env` and fill them in first. The backend
refuses to start if `JWT_SECRET` or `FRONTEND_ORIGIN` is missing — a missing
`FRONTEND_ORIGIN` would otherwise open CORS to every origin.
