# PRE-TRAINING AND INSTRUCTION-TUNING CORPORA

Corpora intended for training rather than for scored evaluation: monolingual
text, translated Wikipedia, an alignment set, and one domain-classification
benchmark.

## Contents

```
Pretrained/
├── Original Datasets/
│   ├── bhashawiki_domain.jsonl        500 rows   5-way domain classification
│   ├── bhasha_wiki_en.jsonl           500 rows   English Wikipedia
│   ├── bhasha_wiki_kn.jsonl           500 rows   Kannada Wikipedia
│   ├── bhasha_wiki_ta.jsonl           500 rows   Tamil Wikipedia
│   ├── bodo_monolingual.jsonl         414 rows   raw Bodo text
│   └── Deliberative_Alignment.jsonl   500 rows   adversarial prompts + responses
├── Difficulty Labelled Data/
│   └── MCQ.jsonl                      500 rows   from bhashawiki_domain
└── Scripts/
    └── domain_difficulty.ipynb
```

## Only one file in this category is scored, and that is deliberate

`bhashawiki_domain.jsonl` is a genuine benchmark item: it shows a passage and
asks which of five academic domains it belongs to, with a single correct answer
and `accuracy` as the metric. It is labelled.

The other five are training material, and difficulty labelling does not apply
to them:

| file | why it is not labelled |
|---|---|
| `bodo_monolingual.jsonl` | Raw text with no question at all. There is nothing to answer. |
| `bhasha_wiki_en / kn / ta` | The question is a template wrapper - "What do you know about X?" - and the answer is a full article, median ~1,200 characters and up to 94,000. Scoring that against the prompt would produce a number that measures nothing. |
| `Deliberative_Alignment.jsonl` | Adversarial prompts with reference responses. This is scoreable in principle, but what it would measure is alignment, not difficulty. Labelling it would put an unrelated axis under the same column name. |

This is a decision, not an omission. Anyone extending the benchmark should
leave these four unlabelled unless the difficulty scale is redefined.

## Domain classification

| | |
|---|---|
| Source | Bhashik-Domain-Corpora |
| Task | 5-way classification, gold is the option text |
| Options | Computer Science, Chemistry, Physics, Law, Mathematics |
| Metric | `accuracy` |
| Baselines | random 20%, majority class 22% (Physics, 110/500) |

Three models classify each passage; votes sum to 3/3 Easy, 2/3 Medium, 0-1/3
Hard. **Option order is shuffled per row**, seeded from the row id. This
matters more here than anywhere else in the corpus: the source file offers the
same five options in the same order on every row, so without shuffling the gold
position would be fixed by the domain and any letter preference a model has
would be recorded as that domain being easy. The shuffle is applied at scoring
time only - the stored file keeps the original option order and answer.

Result: **Easy 277 · Medium 54 · Hard 169**.

| domain | n | Easy | Medium | Hard | %Hard |
|---|---|---|---|---|---|
| Physics | 110 | 29 | 11 | 70 | 64% |
| Computer Science | 99 | 49 | 14 | 36 | 36% |
| Chemistry | 93 | 54 | 7 | 32 | 34% |
| Law | 89 | 66 | 8 | 15 | 17% |
| Mathematics | 109 | 79 | 14 | 16 | 15% |

## Known issues

1. **The Medium band is unusually thin - 54 rows, 11%.** Models either all
   agree or mostly fail, with little middle ground. For a 5-way choice this is
   expected rather than alarming: a passage is either recognisably from a
   domain or the models are guessing, and a 2-1 split is the rarer outcome. It
   does mean the three-level scale carries less information here than on the
   generative splits.
2. **Physics is four times harder to identify than Mathematics** (64% vs 15%
   Hard). The passages are transcript fragments, and mathematical and physical
   language overlap heavily - the audit showed Physics being read as Law and as
   Chemistry most often. Treat the per-domain figures as a property of this
   text collection, not of the domains themselves.
3. **The post-shuffle position check was verified at run time and passed.**
   `domain_difficulty.ipynb` writes `MCQ_audit.jsonl` with every model's pick
   and the shuffle applied to each row; that file was not kept alongside the
   output, so the check cannot be repeated from the repository alone. Keep it
   on any re-run. Note that the gold position as stored here is the *source*
   order, in which position and domain are the same thing - that column
   restates the per-domain table above and is not a bias check.
4. **`eval_metric` is inconsistent across the unlabelled files.** The three
   Wikipedia files carry `rouge_l`, while `bodo_monolingual` and
   `Deliberative_Alignment` carry null. If none of the four is ever scored,
   null is the more honest value for all of them.
5. **The Wikipedia content is not India-specific.** Sampled articles cover
   Pakistani cricket in Ceylon, an Arizona wilderness area and an American
   musician. These files test language generation, not Indian knowledge, and
   should not be read as cultural content.

## Corrections applied

Three defects were found and fixed; the untouched originals are kept as
`*.jsonl.bak` beside each file.

| file | field | was | now |
|---|---|---|---|
| `bhasha_wiki_kn.jsonl` | `source` | `nickfuryavg/bhasha-wiki-en` | `nickfuryavg/bhasha-wiki-kn` |
| `bhasha_wiki_ta.jsonl` | `subcategory` | `wikipedia_en` | `wikipedia_ta` |

Each file had exactly one field wrong, and a different field in each, so these
were two independent copy-paste slips rather than one systematic error. The
Kannada file's `source` was the more costly of the two: it claimed provenance
from the English dataset, which both merged 1000 rows across two languages
under one source string and left the actual upstream Kannada dataset
unrecorded. Grouping by `source` now yields three clean sets of 500.

**`bodo_monolingual.jsonl`: 500 -> 414 rows.** 86 rows had `question: null`
(correct for a monolingual corpus, where the text lives in `answer`) *and* an
empty `answer`, making them records with no content at all - 17% of the file.
They are preserved in `bodo_monolingual_removed_rows.json`. Surviving rows were
verified byte-identical to the original. 12 rows remain under 20 characters,
which are short but not empty.
