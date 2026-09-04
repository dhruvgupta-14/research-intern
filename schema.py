from dataclasses import dataclass, asdict
from typing import Optional, List

@dataclass
class IndicSample:
    id:            str
    source:        str
    category:      str       # CULTURAL | BIAS | LEGAL | MULTILINGUAL | CODE_MIXED
    subcategory:   str
    region:        str
    language:      str
    difficulty:    str
    task_type:     str       # MCQ | SHORT_ANSWER | GENERATIVE
    question:      str
    options:       Optional[List[str]]
    answer:        str
    explanation:   Optional[str]
    cultural_attr: Optional[str]
    eval_metric:   str       # accuracy | rouge_l

    def to_dict(self): return asdict(self)

print('✅ IndicSample schema defined')