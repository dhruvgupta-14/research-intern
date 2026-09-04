# BIAS

Political discourse from Indian social media, labelled for abusive, spam and
promotional content.

## Contents

```
Bias/
├── Original Datasets/
│   └── poliwam.jsonl              2000 rows, difficulty = null
├── Difficulty Label Datasets/
│   └── MCQ.jsonl                   200 rows, difficulty filled
└── Scripts/
    └── poliwam_difficulty.ipynb    scoring notebook
```

`MCQ.jsonl` is a 200-row random draw (`SEED = 42`) from `poliwam.jsonl`.
Only `difficulty`, `task_type` and `options` differ from the source.

## Dataset

| | |
|---|---|
| Source | PoliWAM |
| Subcategory | `political_discourse` |
| Region | India |
| Languages | Hindi 1429, English 404, Others 167 |
| Task | classify a message as Advertisement / Offensive / Others / Spam (labels may combine) |
| Metric | `accuracy` |

`explanation` carries the original annotation fields — `favour`, `against`,
`isPolitical` — not a written explanation.

## Difficulty protocol

Three models answer each row as a strict multiple choice, constrained to the
option letters by argmax over their token ids, so an off-list answer is
impossible. Votes sum: 3/3 Easy, 2/3 Medium, 0-1/3 Hard.

Result: **Easy 51 · Medium 58 · Hard 91**.

## Known issues

1. **The option list is sample-derived, not the label set.** The 5 options come
   from what appeared in the 200 drawn rows. The source has 10 distinct golds;
   `Spam,Advertisement`, `Spam,Offensive`, `Offensive,Others`,
   `Advertisement,Others` and `Spam,Advertisement,Offensive` are never offered,
   covering 48 source rows. `Spam,Others` is on the list from a single row.
2. **`language` uses display names** (`Hindi`, `English`, `Others`) where the
   rest of the corpus uses ISO codes. `Others` is not a language.
3. **The majority-class baseline is 47%**, not the 20% a 5-way choice implies —
   always answering `Others` gets 94/200. Easy rows skew accordingly: 36% of
   `Others` rows are Easy against 6% of `Advertisement` rows, so some of the
   Easy class is majority-class luck rather than item difficulty.
4. The label distribution is steep (Others 941, Spam 701, Offensive 185,
   Advertisement 121, then six combinations under 30 each). Report per-class
   accuracy, not just overall.
