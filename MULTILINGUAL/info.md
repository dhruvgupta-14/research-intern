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
2. **1600 of `GENERATIVE.jsonl`'s 2000 labels were not produced by the
   3-model vote.** The file holds two splits on two different scales. The 400
   `abstractive_qa` rows are judge-measured like the rest of the corpus; the
   1600 AIKosh crosslingual rows are the vendor's own difficulty column,
   collapsed from five levels to three (`very hard`+`hard` -> Hard, `medium`
   -> Medium, `easy`+`very easy` -> Easy) and capitalised — which is why there
   is no notebook for this split. `crosslingual.jsonl` has since been normalised to
   `difficulty: null` and `eval_metric: llm_as_a_judge` like every other
   original, so the folder is internally consistent, but that also means the
   vendor scale no longer survives anywhere on disk and these labels cannot be
   re-derived. `eval_metric` declares how the crosslingual split should be
   evaluated; no judge has been run against it. The 400 rows dropped from the
   2000-row source are the English ones, leaving 10 Indic languages.

   Filter on `subcategory == "abstractive_qa"` to separate the measured rows
   from the vendor-supplied ones.

   This is the opposite of the choice made in LEGAL, where BhashaBench's own
   difficulty column was replaced by measured labels (the two agreed on 36% of
   rows). `Difficulty Label Datasets/` therefore mixes two scales: 3465
   model-measured rows (`MCQ.jsonl`, `TRANSLATION.jsonl`, `SHORT_ANSWER.jsonl`
   and the 400 abstractive rows here), and 1600 vendor-supplied rows.

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
4. **The crosslingual half of `GENERATIVE.jsonl` is a Romanised-output task,
   not a native-script one.** The prompts ask for "Romanised Oriya", "Romanised Tamil" and so on;
   answers are a median 77% Latin characters and 502 of 1600 are at least 95%
   Latin. Combined with subcategories like `Coding & Debugging` (266 rows) and
   `Math` (315), this sits closer to CODE_MIXED than to MULTILINGUAL. Worth a
   deliberate decision rather than leaving it by default.
5. **The crosslingual rows use display-name languages** (`Oriya`,
   `Gujarati`, `Hindi`) where every other file here — including the 400
   abstractive rows in the same file — uses ISO codes (`or`, `gu`, `hi`).
   Their `subcategory` is also untidy: 26 distinct values including 11 singletons
   such as `Genomic and Epigenetic Research`, 3 nulls, and both `Role playing`
   and `Role_playing`.
6. **`MCQ.jsonl` mixes three answer forms.** 1491 rows have a letter gold with
   4 options (indic-arc, mmlu, trivia-qa); 500 boolq rows have a text gold
   with 2 options; 474 LID rows have a text gold with 5 options and
   `language: "multi"`. `mcq_difficulty.ipynb` resolves all of them, but any
   consumer that assumes a letter gold will break.
7. **`TRANSLATION.jsonl` is a sample, not a full pass.** The CORIL and
   English-Manipuri runs are finished and merged, but they scored 150 rows per
   pair out of the ~500 available - 2847 of 9494 source rows. COMTAIL
   contributes 200 of 1961. Both IndicQA files have finished too: 400 of the
   1100 extractive rows are in `SHORT_ANSWER.jsonl` and 400 of the 900
   abstractive rows are in `GENERATIVE.jsonl`, leaving 1200 IndicQA rows
   unscored.

8. **Three CORIL rows were dropped, so `en_te`, `hi_or` and `te_en` hold 149
   rows rather than 150.** All three carried labels that measured the reference
   rather than the model, confirmed against the run's per-row audit:

   | id | was | why it was dropped |
   |---|---|---|
   | `coril_en_te_00426` | Easy | Not a translation pair - an OCR'd maths fragment in both fields, no Telugu present. All three judges echoed the source verbatim and each scored 0.384, above the 0.318 threshold, so `Easy` was a copy-the-source artifact. |
   | `coril_hi_or_00052` | Hard | Defective reference: the Odia target drops `Bengal` and `Bengali`, both present in the Hindi source. Llama and Gemma produced correct Odia and still scored only 0.289 / 0.474. |
   | `coril_te_en_00312` | Hard | Defective reference: the English target is code-mixed Hinglish (*Sugarcane ki fasal is usually a ten month ki fasal hoti hai*). Gemma's correct English scored 0.314 - four thousandths under the threshold. |

   The last two are repairable in principle, but only by hand-authoring a gold
   reference, and any reference written now would closely match a judge's own
   output and hand that judge a near-perfect score. Dropping was the cheaper
   error. Restoring 150 needs three replacement rows put through the three
   judges - 9 generations, minutes rather than the 5-7 hours of a full run.

9. **The Easy/Medium boundary on the CORIL split is a Mistral threshold, not a
   consensus.** The three judges are nowhere near equally capable on this task:

   | judge | mean chrF++ | rows passed (of 2847) |
   |---|---|---|
   | gemma-2-9b-it | 44.0% | 1975 (69%) |
   | Llama-3.1-8B-Instruct | 40.5% | 1748 (61%) |
   | Mistral-7B-Instruct-v0.3 | 20.9% | 548 (19%) |

   Mistral's mean sits close to the pair floors themselves. Because Easy
   requires 3/3, **every Easy row is a row Mistral happened to pass**, and
   **1081 of the 1107 Medium rows are Medium solely because Mistral failed**
   (16 are Llama, 10 are Gemma). The Medium band is therefore very nearly the
   set of rows the two stronger judges solved and the weak one did not, which
   is a statement about Mistral rather than about the items. The 40% Hard
   figure is sound - that band needs two failures - but the Easy/Medium split
   should not be read as a difficulty gradient without a re-run against a third
   judge of comparable strength.

10. **`en-mni` is 100% Hard and `hi-sd` / `hi-or` are 97%, so those three pairs
    are saturated.** English-Manipuri is a different corpus (Bible-heavy
    parallel text, `source: English-Manipuri Parallel Corpus`) crossing Latin
    to Bengali script, and no judge cleared 0.318 on a single one of its 150
    rows. A constant column carries no information: treat these pairs as "no
    model could do this" rather than as a graded scale. Note also that
    `hi-dg`'s copy-the-source floor is **27.2%** against a 0.318 threshold -
    4.6 points of headroom, the narrowest in the run - because Dogri is written
    in Devanagari and is close to Hindi. `dg-hi` sits at 23.3%. The Easy rows
    on both pairs deserve suspicion.

11. **The 150 `en-mni` ids were renamed** from `english_manipuri_00328` to
    `english_manipuri_en_mni_00328`, so every id in `TRANSLATION.jsonl` carries
    its own pair as the 18 CORIL sets do, while keeping the true (non-CORIL)
    provenance in both the id and `source`. Nothing in the repository parses
    ids - `schema.py` only requires uniqueness - so this is cosmetic.

12. **The run's per-row audit is not in the repository.** `coril_audit.jsonl`
    holds each judge's raw translation, its chrF++, the votes and the pair floor
    for all 2847 rows, and it is what issues 8-10 were established from.
    `.gitignore` excludes `*_audit.jsonl`, so it survives only where the run
    produced it. Keep it: from the labelled file alone, a saturated pair and a
    broken reference look identical.
