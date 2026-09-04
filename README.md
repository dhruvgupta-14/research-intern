# Indic LLM Benchmark Corpus

A benchmark corpus for evaluating language models on Indian languages and
contexts, plus a dashboard for tracking what has been built.

**Dashboard** — https://benchmark-frotend.vercel.app
**API** — https://benchmark-backend-u5on.onrender.com/api

---

## What is here

Six categories. Each holds its source datasets, the rows that have been
assigned a difficulty label, the notebooks that produced them, and an
`info.md` recording what was decided and what is known-broken.

| category | what it covers |
|---|---|
| `MULTILINGUAL/` | MCQ, translation, reading comprehension across 11 Indian languages |
| `Cultural/` | Sanskrit, Vedic and classical text; NCERT and heritage QA |
| `Legal/` | Indian law and finance exam questions (BhashaBench) |
| `Code-Mixed/` | Hinglish translation and POS tagging |
| `Bias/` | political discourse from Indian social media |
| `Pretrained/` | pre-training and instruction-tuning corpora |

```
<Category>/
├── Original Datasets/            the source data as ingested
├── Difficulty Label Datasets/    rows with Easy / Medium / Hard assigned
├── Scripts/                      the notebooks that assigned them
└── info.md                       decisions, caveats, known issues
```

Every row follows one 14-field schema — see `schema.py`.

---

## Difficulty labelling

Three models attempt each row; the votes sum to a label.

| models correct | label |
|---|---|
| 3 / 3 | Easy |
| 2 / 3 | Medium |
| 0–1 / 3 | Hard |

MCQ rows are answered by taking an argmax over the option-letter token ids, so
an off-list answer is impossible. Translation is scored with chrF++ against a
per-pair floor; generation and open QA are graded by an independent judge model.

Current totals, by task type:

| task | Easy | Medium | Hard | total |
|---|---|---|---|---|
| MCQ | 1394 | 1317 | 2454 | 5165 |
| TRANSLATION | 936 | 1837 | 2672 | 5445 |
| GENERATIVE | 477 | 623 | 900 | 2000 |
| SHORT_ANSWER | 158 | 181 | 356 | 695 |
| POS_TAGGING | 0 | 0 | 200 | 200 |
| **total** | **2965** | **3958** | **6582** | **13505** |

**Read each category's `info.md` before using its labels.** Several splits are
saturated or measure something other than difficulty — `POS_TAGGING` above is
200/200 Hard because of an output-format failure, not because the task is hard;
Code-Mixed's HinGE split scores below its own copy-the-source baseline;
MULTILINGUAL's `en-mni` and Cultural's Odia heritage split are 100% Hard; and
the Easy/Medium boundary on the 2847 CORIL translation rows is set almost
entirely by one weak judge of the three. Those caveats are written down where
the data lives.

`TRANSLATION` is the largest task type as of 4 September 2026, when the CORIL
and English-Manipuri runs finished and merged 2847 rows across 19 directed
pairs into `MULTILINGUAL/Difficulty Label Datasets/TRANSLATION.jsonl`.

---

## Dashboard

`benchmark-backend/` serves a read-only API; `benchmark-frontend/` renders it.

The repository is the source of truth. The API scans the six category folders
on disk, tallies the labelled data, and links every file back to GitHub.
Nothing is stored in a database and nothing is editable through the UI —
adding a dataset means committing a file, and updating the notes means editing
an `info.md`.

Statistics come **only** from `Difficulty Label Datasets/`. Row counts, coverage
percentages and any difficulty column that shipped inside a source file are
deliberately not shown, so nothing on the dashboard can be mistaken for a
figure we did not measure.

### Running locally

```bash
cd benchmark-backend  && npm install && npm start      # → :5000
cd benchmark-frontend && npm install && npm run dev    # → :5173
```

Copy both `.env.example` files to `.env` first. The backend refuses to start
without `JWT_SECRET` and `FRONTEND_ORIGIN`.

### Deployment

Backend on Render, frontend on Vercel, both from this repository. See
[DEPLOYMENT.md](DEPLOYMENT.md) — including why the backend's Render **Root
Directory must be left blank**, and why a corpus change needs a redeploy
before it shows up.

---

## Files

```
schema.py             the 14-field row schema
description.md        dataset review and category definitions
models_for_eval.md    models considered for evaluation
DEPLOYMENT.md         Git → GitHub → Render → Vercel
render.yaml           Render Blueprint / record of the service config
```
