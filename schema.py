"""
The row schema every dataset in this corpus follows.

One JSON object per line, fourteen fields, always in this order. The order
matters: the tooling checks it, so a row with the right keys in the wrong
order is reported as a deviation.

The vocabularies below are what the corpus actually contains, not an ideal:
CATEGORIES carries Pretrained's long display name alongside the five short
forms, because that is what 3000 rows say.
"""

from dataclasses import dataclass
from typing import Optional, List


CATEGORIES = [
    "MULTILINGUAL",
    "CULTURAL",
    "LEGAL",
    "CODE_MIXED",
    "BIAS",
    "Pre-training and Instruction-Tuning Corpora",
]

DIFFICULTIES = ["Easy", "Medium", "Hard"]

TASK_TYPES = [
    "MCQ",            # options + a gold letter, or the gold option text
    "TRANSLATION",    # question is the source, answer the target
    "GENERATIVE",     # open-ended answer, several sentences
    "SHORT_ANSWER",   # a span or a phrase
    "POS_TAGGING",    # answer is a whitespace-separated tag sequence
]


EVAL_METRICS = [
    "accuracy",         # MCQ and classification
    "chrF++",           # translation - character n-gram F-score
    "llm_as_a_judge",   # open generation and reading comprehension
    "rouge_l",          # legacy; unfit for tag sequences, see Code-Mixed/info.md
]

SCHEMA_KEYS = [
    "id", "source", "category", "subcategory", "region", "language",
    "difficulty", "task_type", "question", "options", "answer",
    "explanation", "cultural_attr", "eval_metric",
]


@dataclass
class IndicSample:

    id:            str
    source:        str
    category:      str                    # CATEGORIES
    subcategory:   Optional[str]
    region:        Optional[str]
    language:      str                    # ISO code, or a directed pair: hi-ta
    difficulty:    Optional[str]          # DIFFICULTIES, or None if unscored
    task_type:     str                    # TASK_TYPES 
    question:      Optional[str]
    options:       Optional[List[str]]
    answer:        str
    explanation:   Optional[str]
    cultural_attr: Optional[str]
    eval_metric:   Optional[str]          # EVAL_METRICS
