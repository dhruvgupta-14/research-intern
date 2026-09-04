# MULTILINGUAL

Indian-language understanding and generation across 11 languages: multiple
choice, translation between Indic pairs, reading comprehension, and open
generation.

## Contents

```
MULTILINGUAL/
├── Original Datasets/
│   ├── boolq_indic.jsonl              2000      yes/no reading comprehension
│   ├── comtail.jsonl                  1961      21 translation pairs
│   ├── crosslingual.jsonl             2000      open generation, AIKosh
│   ├── coril_*.jsonl  (18 files)      8994      one file per directed pair
│   ├── english_manipuri.jsonl          500      en-mni translation
│   ├── indic_arc.jsonl                5481      grade-school science MCQ
│   ├── indicqa_abstractive.jsonl       900      open-book QA, composed answer
│   ├── indicqa_extractive.jsonl       1100      open-book QA, span answer
│   ├── indo_aryan_lid.jsonl            500      language identification
│   ├── mmlu_indic.jsonl               5392      MMLU translated
│   └── trivia_qa_indic.jsonl          1100      general-knowledge MCQ
├── Difficulty Label Datasets/
│   ├── MCQ.jsonl                      2465      5 sources merged
│   ├── GENERATIVE.jsonl               1600      AIKosh crosslingual
│   └── TRANSLATION.jsonl               200      COMTAIL only
└── Scripts/
    ├── mcq_difficulty.ipynb                     registry of 5 MCQ datasets
    ├── comtail_difficulty.ipynb                 21 pairs, chrF++
    ├── coril_difficulty.ipynb                   19 pairs incl. en-mni
    └── indicqa_difficulty.ipynb                 SPLIT = extractive | abstractive
```

## Difficulty protocol

Three models attempt each row; votes sum 3/3 Easy, 2/3 Medium, 0-1/3 Hard.
MCQ rows are answered by argmax over the option-letter token ids, so an
off-list answer is impossible. Translation uses chrF++ against a per-pair
floor; generation uses an LLM judge.

| file | Easy | Medium | Hard |
|---|---|---|---|
| MCQ | 513 | 710 | 1242 |
| GENERATIVE | 382 | 486 | 732 |
| TRANSLATION | 27 | 87 | 86 |

Per source, the gradient is coherent — the harder the task, the more Hard:

| source | n | %Hard |
|---|---|---|
| Indo-Aryan-LID | 474 | 76% |
| mmlu-indic | 493 | 68% |
| indic-arc | 498 | 50% |
| trivia-qa-indic | 500 | 34% |
| boolq-indic | 500 | 25% |

## Known issues

1. **`indic_arc.jsonl` and `mmlu_indic.jsonl` are filtered, not raw.**
   Both shipped at 5500 rows containing items whose gold option string is
   duplicated, which makes them unanswerable — a model picking the identical
   other option is marked wrong for the same answer. `indic_arc` is cut to
   **5481** (18 ambiguous golds, plus `Mercury_400440_gu`, a Gujarati-labelled
   row containing no Gujarati text); `mmlu_indic` to **5392** (98 ambiguous
   golds and 10 distractor-only repeats, 91 of them from the
   `moral_scenarios` subset collapsing in Kannada and Tamil translation). The
   removed rows are kept in `indic_arc_removed_rows.json` and
   `mmlu_indic_removed_rows.json`.
2. **`GENERATIVE.jsonl`'s difficulty was not produced by the 3-model vote.**
   Its 1600 labels are AIKosh's own difficulty column, collapsed from five
   levels to three (`very hard`+`hard` -> Hard, `medium` -> Medium,
   `easy`+`very easy` -> Easy) and capitalised — which is why there is no
   notebook for this split. `crosslingual.jsonl` has since been normalised to
   `difficulty: null` and `eval_metric: llm_as_a_judge` like every other
   original, so the folder is internally consistent, but that also means the
   vendor scale no longer survives anywhere on disk and these labels cannot be
   re-derived. `eval_metric` declares how the split should be evaluated; no
   judge has been run against it. The 400 rows dropped from the 2000-row
   source are the English ones, leaving 10 Indic languages.

   This is the opposite of the choice made in LEGAL, where BhashaBench's own
   difficulty column was replaced by measured labels (the two agreed on 36% of
   rows). `Difficulty Label Datasets/` therefore mixes two scales: 2665
   model-measured rows in `MCQ.jsonl` and `TRANSLATION.jsonl`, and 1600
   vendor-supplied rows here.

3. **trivia-qa has the worst position bias in the corpus — 53 points.**

   | gold | n | %Easy | %Hard |
   |---|---|---|---|
   | A | 137 | **59.1** | 12.4 |
   | B | 121 | 5.8 | 55.4 |
   | C | 123 | 13.0 | 28.5 |
   | D | 119 | 8.4 | 43.7 |

   **81 of its 114 Easy rows have gold=A, against 31.2 expected by chance.**
   `indic_arc` (14 points) and `mmlu_indic` (16 points) show the same effect
   more mildly. None of the three notebooks shuffles option order, so part of
   the Easy class records the models' default letter rather than item
   difficulty. The fix is cyclic option permutation and a re-run.
4. **`GENERATIVE.jsonl` is a Romanised-output task, not a native-script one.**
   The prompts ask for "Romanised Oriya", "Romanised Tamil" and so on;
   answers are a median 77% Latin characters and 502 of 1600 are at least 95%
   Latin. Combined with subcategories like `Coding & Debugging` (266 rows) and
   `Math` (315), this sits closer to CODE_MIXED than to MULTILINGUAL. Worth a
   deliberate decision rather than leaving it by default.
5. **`GENERATIVE.jsonl` uses display-name languages** (`Oriya`, `Gujarati`,
   `Hindi`) where every other file here uses ISO codes (`or`, `gu`, `hi`). Its
   `subcategory` is also untidy: 26 distinct values including 11 singletons
   such as `Genomic and Epigenetic Research`, 3 nulls, and both `Role playing`
   and `Role_playing`.
6. **`MCQ.jsonl` mixes three answer forms.** 1491 rows have a letter gold with
   4 options (indic-arc, mmlu, trivia-qa); 500 boolq rows have a text gold
   with 2 options; 474 LID rows have a text gold with 5 options and
   `language: "multi"`. `mcq_difficulty.ipynb` resolves all of them, but any
   consumer that assumes a letter gold will break.
7. **`TRANSLATION.jsonl` holds COMTAIL alone so far.** The 18 CORIL files
   (8994 rows), `english_manipuri.jsonl` (500) and both IndicQA files (2000)
   are **currently being scored on Kaggle**; their labels will merge into
   `TRANSLATION.jsonl` and a new `SHORT_ANSWER.jsonl` / `GENERATIVE.jsonl`
   when those runs finish. Until then the row counts above are partial.
