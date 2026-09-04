# Candidate Models for Indic Alignment Evaluation

Models shortlisted for the evaluation described in `readme.md`. The list is split
into India-focused models and general-purpose global models, so that "does
India-specific training beat a general model of similar size?" can be tested as a
controlled comparison rather than an assumption.

---

## India-Focused Models

### 1. krutrim-ai-labs/Krutrim-1-instruct

**Hugging Face URL:** https://huggingface.co/krutrim-ai-labs/Krutrim-1-instruct

Krutrim-1 is an India-focused, natively multilingual model trained on 2 trillion
tokens with strong representation across Indic languages. At 7B parameters it is
comparable to Llama-2-7B, allowing a fair same-size comparison. It covers 8 Indic
languages (Bengali, Gujarati, Hindi, Kannada, Malayalam, Marathi, Tamil, Telugu)
across five benchmarks: IndicCOPA, IndicQA, IndicSentiment, IndicTranslation and
IndicXParaphrase. On IndicQA it reports 0.64 Hindi, 0.75 Tamil and 0.83 Telugu, and
on English benchmarks it matches Llama-2-7B-Chat (0.54 average for both), showing no
trade-off in English capability.

**Limitation:** all scores are self-reported by Krutrim-AI-Labs. The model does not
appear on the Hugging Face Open LLM Leaderboard, Cognitive-Lab's Indic LLM
Leaderboard, or llm-stats.com, so there is no independent verification.

### 2. bharatgenai/Param2-17B-A2.4B-Thinking

**Hugging Face URL:** https://huggingface.co/bharatgenai/Param2-17B-A2.4B-Thinking

Param-2 is built from scratch by BharatGen with India as the explicit design center
rather than an add-on. It supports English, Hindi and 21 other Indian languages,
including low-resource ones such as Bodo, Dogri, Kashmiri, Konkani and Santali that
most other models here do not cover at all. It uses a Hybrid MoE architecture (17B
total, 2.4B active per token) with shared experts designed to stabilise cross-lingual
representation and support code-switching across all 23 languages, which maps
directly onto the Code-Switching category. On Indic benchmarks it clearly outperforms
similarly-sized general models such as Qwen1.5-MoE and DeepSeek-V2-Lite (TriviaQA
Indic MCQ: 72.95 vs. 25.21), though it trails larger reasoning-focused models like
DeepSeek-R1-Distill-Qwen-14B on some cultural benchmarks — a mixed, fairly honest
result rather than one-sided marketing.

### 3. sarvamai/sarvam-30b

**Hugging Face URL:** https://huggingface.co/sarvamai/sarvam-30b

Sarvam-30B is a Mixture-of-Experts model (30B total, ~2.4B active per token), built
from scratch as part of Sarvam's 2026 "sovereign models" release. While it states
Indian-language performance as a training focus, its benchmark table positions it
mainly against general-purpose global models — Gemma-27B, Qwen3-30B, Mistral-3.2-24B,
GLM-4.7, GPT-OSS-20B — across general capability suites such as Math500, HumanEval,
GPQA and SWE-Bench. The only Indic-specific number reported is a single MILU score
(76.8, ahead of Gemma-2-27B's 69.2), useful as a cross-check point but not a
dedicated Indic suite the way Krutrim-1 provides. Its MoE architecture makes it
computationally cheap to run relative to its size on disk. Scores 20.8 on
llm-stats.com, the best among Indian LLMs.

---

## General-Purpose Reference Models

### 4. Qwen/Qwen3.5-27B

**Hugging Face URL:** https://huggingface.co/Qwen/Qwen3.5-27B

Qwen3.5-27B is Alibaba's frontier-adjacent, general-purpose multimodal model (text,
image, video), with no Indic-language focus — 201 languages claimed globally, but not
an Indic specialist. It reports strong general benchmarks (MMLU-Pro 86.1%, GPQA
Diamond 85.5%, SWE-bench 72.4%) but zero Indic-specific numbers, so its role here is
purely as a strong global general-model reference point. Scores 34.7 on
llm-stats.com.

### 5. google/gemma-4-31B

**Hugging Face URL:** https://huggingface.co/google/gemma-4-31B

Gemma 4 31B is Google DeepMind's dense, general-purpose multimodal model (text +
image), part of a five-size family (E2B to 31B), at 30.7B total parameters. Like
Qwen3.5 it reports no Indic-specific benchmarks; multilingual support is broad (140+
languages) but not India-focused. It serves as a second general-model comparison
point, from a different company and a different architecture (dense rather than MoE)
than Qwen. Scores 33.5 on llm-stats.com.

### 6. moonshotai/Moonlight-16B-A3B

**Hugging Face URL:** https://huggingface.co/moonshotai/Moonlight-16B-A3B

Moonlight-16B-A3B is Moonshot AI's MoE model (16B total, 2.24B active per token),
trained on 5.7T tokens with the Muon optimizer, which the authors report as roughly
2x more sample-efficient than Adam at about 52% of the training FLOPs. Its headline
scores are MMLU 70.0, GSM8K 77.4, HumanEval 48.1 and C-Eval 77.2, and it outperforms
Llama3.2-3B, Qwen2.5-3B and DeepSeek-V2-Lite at comparable token budgets. Benchmarks
demonstrate English and Chinese only, with no Indic-language claims, and the context
window is 8K. Note this repo is the base model; an instruction-tuned variant
(Moonlight-16B-A3B-Instruct) exists separately.

Its value here is as an active-parameter match for Param-2 and Sarvam-30B (~2.2-2.4B
active), isolating the effect of Indic-focused training at near-identical inference
cost.

### 7. mistralai/Ministral-3-14B-Reasoning-2512

**Hugging Face URL:** https://huggingface.co/mistralai/Ministral-3-14B-Reasoning-2512

Ministral-3-14B-Reasoning is Mistral's edge-optimised reasoning model, 14B total
(13.5B language model + 0.4B vision encoder), with a 256K context window and native
function-calling and JSON output. It is explicitly trained for reasoning on maths,
coding and STEM tasks, scoring AIME25 0.850, GPQA Diamond 0.712, LiveCodeBench 0.646,
Arena Hard 0.551 and WildBench 68.5. Multilingual support covers dozens of languages
(English, French, Spanish, German, Italian, Portuguese, Dutch, Chinese, Japanese,
Korean, Arabic) with no stated Indic-language coverage. It provides the
reasoning-focused control in this set — testing whether general reasoning strength
transfers to culturally grounded Indic tasks or not.
