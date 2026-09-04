# CODE_MIXED

Hindi-English code-mixed text: POS tagging over mixed-script tokens, and
translation into and out of Hinglish.

## Contents

```
Code-Mixed/
├── Original Datasets/
│   ├── comi_lingua.jsonl          2000 rows   POS tagging
│   ├── hinge.jsonl                1973 rows   English -> Hinglish
│   └── phinc.jsonl                2000 rows   Hinglish -> English
├── Difficulty Label Datasets/
│   ├── POS_TAGGED.jsonl            200 rows   from COMI-LINGUA
│   └── TRANSLATION.jsonl           500 rows   HinGE 200 + PHINC 300
└── Scripts/
    ├── comi_lingua_difficulty.ipynb
    ├── hinge_difficulty.ipynb
    └── phinc_difficulty.ipynb
```

Labelled rows are random draws from the originals. Only `difficulty` differs,
plus `task_type` and `eval_metric` on the POS rows.

## Datasets

| Source | Task | Language | Metric |
|---|---|---|---|
| COMI-LINGUA | POS tagging | `hi-en` | `accuracy` (token-level) |
| HinGE | English to Hinglish | `en-hinglish` | `chrF++` |
| PHINC | Hinglish to English | `hinglish-en` | `chrF++` |

## Difficulty protocol

Three models attempt each row. Generative rows pass when they clear a
threshold; votes sum: 3/3 Easy, 2/3 Medium, 0-1/3 Hard.

| File | Easy | Medium | Hard |
|---|---|---|---|
| POS_TAGGED | 0 | 0 | **200** |
| TRANSLATION — PHINC | 81 | 73 | 146 |
| TRANSLATION — HinGE | 1 | 3 | **196** |

## Known issues

Two of the three splits are saturated and should not be interpreted as
meaningful difficulty distributions.

**POS_TAGGED is 200/200 Hard, so the difficulty column carries no useful
signal.** The cause appears to be output formatting rather than necessarily
poor tagging ability. Only 7-18 of 200 model outputs returned the expected
number of tags, and no model exceeded the 22.3% all-NOUN baseline.

**HinGE is 196/200 Hard and is affected by a metric artifact.** English and
Hinglish share the Latin alphabet, so copying the source achieves 48.4%
chrF++, while the best model achieves only 31.1%. Thus, a model can score
below the do-nothing baseline. The resulting difficulty labels should
therefore not be interpreted as reliable measures of translation difficulty.

**PHINC does not show this failure** and is the only Code-Mixed split with a
useful difficulty gradient.
