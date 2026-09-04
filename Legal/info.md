# LEGAL

Indian law and finance: bar-exam and competitive-exam multiple choice from
BhashaBench, in Hindi and English.

## Contents

```
Legal/
├── Original Datasets/
│   ├── BhashaBench_Legal_en.jsonl     2000 rows
│   ├── BhashaBench_Legal_hi.jsonl     2000 rows
│   ├── BhashaBench_Finance_en.jsonl   2000 rows
│   └── BhashaBench_Finance_hi.jsonl   2000 rows
├── Difficulty Label Datasets/
│   └── MCQ.jsonl                      2000 rows, 500 from each file
└── Scripts/
    └── legal_mcq_difficulty.ipynb     one notebook, all four files
```

The four files are the same task, so one notebook scores them in a single
pass with a fixed quota from each — that keeps Legal/Finance and Hindi/English
at 50/50 in the output, which a pooled draw would not. Three model loads, not
twelve.

## Datasets

| | |
|---|---|
| Source | BhashaBench-Legal, BhashaBench-Finance |
| Region | India |
| Languages | `hi` 1000, `en` 1000 |
| Task | 4-option MCQ, gold is a letter |
| Metric | `accuracy` |

`subcategory` names the exam topic (Civil Litigation & Procedure, Problem
Solving, Mathematics for Finance, ...); `cultural_attr` names the legal or
financial area (Constitutional Law, Contract Law, Quantitative Aptitude, ...).

## Difficulty protocol

Three models answer each question. The answer is read as an argmax over the
option-letter token ids in one forward pass, so an off-list answer is
impossible. Votes sum: 3/3 Easy, 2/3 Medium, 0-1/3 Hard.

Result: **Easy 553 · Medium 495 · Hard 952**.

| split | Easy | Medium | Hard | %Hard |
|---|---|---|---|---|
| Legal en | 231 | 137 | 132 | 26% |
| Legal hi | 134 | 124 | 242 | 48% |
| Finance en | 118 | 113 | 269 | 54% |
| Finance hi | 70 | 121 | 309 | 62% |

The ordering is coherent: finance harder than law, Hindi harder than English
in both domains.




