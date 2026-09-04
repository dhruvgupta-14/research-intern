# CULTURAL

Sanskrit, Vedic and classical Indian text: translation between Sanskrit and
the modern Indian languages, and comprehension questions on Indian school and
heritage material.

## Contents

```
Cultural/
├── Original Datasets/
│   ├── ova_temples.jsonl                       37 rows   Odia heritage prose
│   ├── heritage_factual_short_answer.jsonl     95 rows   cloze, derived from it
│   ├── itihasa.jsonl                         2000 rows   Sanskrit -> English
│   ├── ncert_qa.jsonl                         939 rows   NCERT humanities QA
│   ├── santham_anvaya.jsonl                  2538 rows   Sanskrit -> Tamil
│   ├── santham_parallel.jsonl                4974 rows   Sanskrit -> Tamil
│   ├── vedic_hi_kn.jsonl                     1935 rows   Hindi -> Kannada
│   └── vedic_hi_sa.jsonl                     1983 rows   Hindi -> Sanskrit
├── Difficulty Label Datasets/
│   ├── SHORT_ANSWER.jsonl                     295 rows   NCERT 200 + heritage 95
│   └── TRANSLATION.jsonl                     1898 rows   4 corpora merged
└── Scripts/
    ├── heritage_difficulty.ipynb
    ├── ncert_qa_difficulty.ipynb
    ├── santham_difficulty.ipynb              DATASET = anvaya | parallel
    └── vedic_difficulty.ipynb                DATASET = hi_sa | hi_kn
```

## Datasets

`TRANSLATION.jsonl` merges four scored corpora, all Sanskrit-centred:

| source | pair | rows | metric |
|---|---|---|---|
| Itihasa | `sa-en` | 499 | `llm_as_a_judge` |
| Santham-Parallel | `sa-ta` | 400 | `chrF++` |
| Santham-Anvaya-Parallel | `sa-ta` | 399 | `chrF++` |
| Sanskrit-Interlingua | `hi-sa` / `hi-kn` | 300 + 300 | `chrF++` |

`SHORT_ANSWER.jsonl` holds two splits: 200 NCERT textbook QA rows (source
`Gurukul`, 131 English and 69 Hindi, judged against the official answer) and
the 95 Odia heritage rows scored on exact match. Like `TRANSLATION.jsonl` it
therefore carries two metrics - the files group by `task_type`, not by
metric.

**The Odia heritage split is a two-stage derivation.** `ova_temples.jsonl`
holds 37 prose passages about Odia heritage sites; `heritage_factual_short_
answer.jsonl` turns 34 of them into 95 cloze questions, 1-6 per passage, each
keeping its source passage in `explanation`. All 95 gold answers appear
verbatim in the passage, so it is an open-book task - `OPEN_BOOK` in
`heritage_difficulty.ipynb` controls whether the passage is supplied.

The file names group by `task_type`, not by metric — so `TRANSLATION.jsonl`
deliberately carries two metrics, chrF++ on 1399 rows and a judge on Itihasa's
499.

## Difficulty protocol

Three models attempt each row and a threshold turns the score into a pass;
votes sum: 3/3 Easy, 2/3 Medium, 0-1/3 Hard. Sanskrit and the modern Indian
scripts share no characters, so copying the source scores near 0% chrF++ and
the binding reference is the unrelated-translation floor at roughly 15%.

| file | Easy | Medium | Hard |
|---|---|---|---|
| SHORT_ANSWER | 56 | 36 | 108 |
| TRANSLATION | 310 | 567 | 1021 |

Per source, the gradient is even and plausible — Itihasa 62% Hard, then
Santham 52% / 51%, Sanskrit-Interlingua 50% on both pairs. No split is
saturated.

## Known issues

1. **`ncert_qa.jsonl` is a rebuild, not the set the labels were drawn from.**
   The 946-row curated file was lost in the folder restructure and is not
   reconstructible - its cut was made row by row, not by rule. What is here is
   a 939-row equivalent from a stated rule: keep the six humanities families
   (`english_lit` 318, `hindi_lit` 286, `civics` 129, `geography` 108,
   `history` 60, `economics` 38), drop everything else. The 2061 dropped rows
   - 1623 maths/science plus 438 physics and chemistry - are in
   `ncert_qa_removed_rows.jsonl`, and the full 3000-row file is kept as
   `ncert_qa.jsonl.bak`.
2. **The two Santham splits are not independent.** They are two views of the
   same corpus - `parallel` is the verse, `anvaya` the prose-reordered form of
   the same verse - so they share Tamil targets while the Sanskrit sources
   differ. 433 targets overlap across the full files; in the labelled sample
   only 4 collide, so the practical effect is small, but the splits should not
   be treated as separate evidence.
