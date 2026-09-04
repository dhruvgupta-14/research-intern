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
│   ├── GENERATIVE.jsonl               2000      AIKosh crosslingual + IndicQA abstractive
│   ├── SHORT_ANSWER.jsonl              400      IndicQA extractive
│   └── TRANSLATION.jsonl              3047      COMTAIL 200 + CORIL 2697 + en-mni 150
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
| GENERATIVE | 477 | 623 | 900 |
| SHORT_ANSWER | 102 | 145 | 153 |
| TRANSLATION | 544 | 1194 | 1309 |

Per source, the gradient is coherent — the harder the task, the more Hard:

| source | n | %Hard |
|---|---|---|
| Indo-Aryan-LID | 474 | 76% |
| mmlu-indic | 493 | 68% |
| indic-arc | 498 | 50% |
| trivia-qa-indic | 500 | 34% |
| boolq-indic | 500 | 25% |

## Translation

`TRANSLATION.jsonl` is complete. The CORIL and English-Manipuri runs finished on
4 September 2026 and merged, so the file now holds three sources on one metric
(chrF++) across 40 directed pairs.

| source | n | Easy | Medium | Hard | %Hard |
|---|---|---|---|---|---|
| CoRil-Parallel (18 pairs) | 2697 | 517 | 1107 | 1073 | 40% |
| COMTAIL (21 pairs) | 200 | 27 | 87 | 86 | 43% |
| English-Manipuri (`en-mni`) | 150 | 0 | 0 | 150 | 100% |

`coril_difficulty.ipynb` scored 150 rows per pair with three judges at a
pooled-median threshold of **0.318 chrF++**, each pair measured against its own
copy-the-source and unrelated-translation floors. Per pair, ordered by %Hard:

| pair | n | Easy | Medium | Hard | %Hard |
|---|---|---|---|---|---|
| en-mni | 150 | 0 | 0 | 150 | 100% |
| hi-sd | 150 | 2 | 3 | 145 | 97% |
| hi-or | 149 | 0 | 5 | 144 | 97% |
| hi-dg | 150 | 5 | 23 | 122 | 81% |
| hi-kn | 150 | 4 | 40 | 106 | 71% |
| en-te | 149 | 2 | 58 | 89 | 60% |
| dg-hi | 150 | 30 | 35 | 85 | 57% |
| hi-te | 150 | 7 | 68 | 75 | 50% |
| or-hi | 150 | 15 | 78 | 57 | 38% |
| te-hi | 150 | 10 | 92 | 48 | 32% |
| hi-gu | 150 | 13 | 95 | 42 | 28% |
| hi-pa | 150 | 8 | 107 | 35 | 23% |
| hi-ur | 150 | 54 | 61 | 35 | 23% |
| te-en | 149 | 9 | 112 | 28 | 19% |
| en-hi | 150 | 62 | 67 | 21 | 14% |
| kn-hi | 150 | 39 | 92 | 19 | 13% |
| ur-hi | 150 | 45 | 90 | 15 | 10% |
| pa-hi | 150 | 86 | 59 | 5 | 3% |
| hi-en | 150 | 126 | 22 | 2 | 1% |

The direction asymmetry is the clearest signal here, and it is coherent: every
pair is easier *into* Hindi than out of it (`hi-en` 1% Hard against `en-hi` 14%,
`pa-hi` 3% against `hi-pa` 23%, `kn-hi` 13% against `hi-kn` 71%), which is what
the training-data imbalance of these models predicts. Read **Known issues 8-10**
before treating any single pair's number as a difficulty measurement.


