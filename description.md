# <a name="_kwfrzdyu6ts7"></a>**Document 2: Review of Datasets for Evaluating, Training, and Aligning India-Focused Large Language Models**
-----
## <a name="_llzpskz44la0"></a>**1. Introduction and Scope of the Dataset Review**
### <a name="_f2k2q5d3bdif"></a>1.1 Why Datasets Matter for Large Language Models (LLMs) 
Large language models develop their capabilities, limitations, and behavioral tendencies based on the datasets used throughout their development lifecycle, which includes **pretraining**, **instruction tuning**, **alignment**, and **evaluation**. While early work with LLMs was primarily concerned with scaling and improving overall general language abilities, recent research has found that the composition of datasets and their cultural roots significantly affect the behaviors exhibited by models in real-world applications.

In the developmental phases of an LLM's life cycle, the pretraining process and the datasets used during that phase create the foundation on which subsequent learning will be based, enabling large language models to learn about grammar, factual information, and contextual understanding. Once a pre-trained model has been created, it can then be fine-tuned using downstream datasets for alignment and evaluation. These datasets determine how a model interprets, organizes, and applies the foundational knowledge that has been learned.

Through the use of downstream datasets to refine a model's capabilities, LLM developers can ensure that the model produces responses that are better aligned with user needs and more accurate and beneficial to users. The value of pre-training and downstream datasets cannot be measured solely by their capacity to define a model's capabilities; rather, they directly shape the cultural values, priorities, and context embedded in the model's output. 

Thus, datasets affect how LLMs conceptualize cultural values, apply social norms, and reason through institutionally rooted scenarios. This is especially true when models are developed for regions such as India, which has multiple languages, organizations, societal structures, and behaviors that differ markedly from those in Western countries. Most commonly used training and testing datasets for LLMs are drawn from Western cultural and social norms, institutions, and knowledge structures. Therefore, most models developed using these training and testing datasets will perform poorly outside Western cultural contexts.

For example, a model can produce a fluent Hindi response to a question about selling a property in Bangalore. Still, it may describe a procedure based on Western real estate systems rather than Karnataka’s actual administrative process. In such cases, the failure is not one of language fluency, but of missing institutional knowledge. This illustrates why datasets for Indic alignment must encode not only language, but also the social and procedural realities of Indian contexts.

Therefore, researchers have begun developing datasets that contain Indian languages and contexts. There are many goals for developing these datasets, including multilingual language modeling, translation across Indian languages, culturally grounded question-answering systems, and the evaluation of bias across Indian identity groups.
### <a name="_c816xkjz2knb"></a>1.2 India’s Dataset Landscape: The Scale of the Challenge.  

The development of datasets for Indic alignment is a particular challenge due to the large size and diversity of India's linguistic and social ecosystem. Five structural qualities of the Indian dataset landscape make it especially challenging.  

1. **Language diversity**: India is officially a land of 22 constitutionally recognised languages and more than 19,500 dialects. However, most datasets used in LLM training are English-centric; even more widely spoken languages, such as Tamil, Bengali, and Marathi, are underrepresented. As a result, a large number of scheduled languages are grossly under-resourced.  

1. **Regional diversity**: The nation comprises 28 states and 8 union territories, each with its own cultural traditions, systems of governance, and administration. What may be considered familiar in one state may be unfamiliar or irrelevant in another, and the dataset design task will be significantly more complex when attempting to capture Indian knowledge.  

1. **Code-switching**: A large segment of the digitally active population in India practices code-mixed communication, i.e., mixing English with Indic languages (e.g., Hinglish, Tanglish, Bonglish, Kanglish, Manglish). Datasets based on clean monolingual text can make models appear more capable than they are in real-world conditions. A model trained in a single language is likely to struggle when employed in code-mixing contexts.

1. **Institutional complexity**: India's federal administrative system produces substantial differences in governance procedures. Processes such as property registration, welfare schemes, tenancy laws, and certification procedures are often different across states. Models trained solely on generic web data lack the institutional insight to answer such queries.  

1. **Social structure**: Indian social identities are shaped by caste, religion, regional affiliation, and linguistic community. These notions are not directly paralleled in the West. As a result, bias-evaluation frameworks developed in Western settings often fail to capture the most socially impactful forms of bias in India.  

Consequently, any datasets developed to support research within the Indian context will be required to account for both the diverse linguistic base of India (i.e., regional languages) as well as the institutional and structural variations of the different states and regions within India which in turn make developing such datasets more difficult than may be the case in some other areas or regions of the world. Although numerous datasets are available for this purpose, the landscape remains disorganized and varies widely in scope, annotation quality, and the purposes for which they were developed.
### <a name="_fj021z3l1a7y"></a>1.3 Structure of the Document  
This report presents a systematic review of datasets used by researchers to train, evaluate, and align large language models for Indian linguistic and cultural contexts. It does not attempt to review all multilingual data systematically set that contain Indic languages; rather, it provides a systematic review of those data
sets that meet at least one of the following criteria:

- **Datasets that** **contain Indic languages as primary data.**
- **Datasets that encode India-specific cultural, institutional, or social knowledge.**
- **Datasets that have been used in prior research on India-focused language models.**
- **Datasets that evaluate cultural bias, stereotypes, or social harm in the context of India.**

This approach to narrowing the dataset scope will enable the paper to focus on datasets that are experimentally applicable for assessing the alignment of Large Language Models (LLMs) with the languages, cultural values, social norms, and knowledge of India.

This review categorizes the dataset landscape into several functional categories based on how these datasets are used in LLM research. These categories include **multilingual Indic language datasets**, **culturally grounded knowledge datasets**, **bias- and fairness-evaluation datasets, conversational instruction datasets, pre-training and instruction-tuning corpora, and datasets representing informal language use, such as code-mixing**. Each category will describe representative datasets, outline the structure and source of each dataset, discuss how they have been applied in prior research, and identify limitations associated with each.

In addition to reviewing existing datasets, the paper will also discuss gaps in the current dataset ecosystem. Two particular gaps will be discussed. The first gap concerns Western LLM research datasets, such as commonly used commonsense reasoning benchmarks and cultural value surveys, which lack equivalent datasets tailored to Indian contexts. The second gap includes datasets that would be uniquely useful in India, such as those representing code-mixed language use, regional institutional procedures, or culturally specific social practices, but that remain underdeveloped.

By identifying both the available resources and missing components of the dataset landscape, the paper will provide a foundation for developing future experiments on cultural alignment in Indian language models.
### <a name="_2g6h0ud9m8fe"></a>1.4 Linguistic Competence Versus Cultural Alignment  

Before proceeding towards the dataset landscape, it is essential to clarify a conceptual distinction that informs the document’s structure: the differentiation between **linguistic competence** and **cultural alignment**.  

Linguistic competence denotes a model’s capacity to accurately parse and generate text in a particular language, encompassing syntactic analysis, lexical recognition, and grammatically correct output.  

Cultural alignment, conversely, refers to a model’s proficiency in reasoning about culture‑bound knowledge like social norms, institutional procedures, regional practices, and value systems, and applying that knowledge appropriately in responses.  

Thus, a model may exhibit robust linguistic competence while remaining culturally misaligned. As illustrated earlier in an example, a model may produce fluent Hindi responses describing property sale procedures under United Kingdom law, suggest foods forbidden during particular religious holidays, or promote stereotypes about Indian communities that emerge from Western discourse.  

This difference has serious consequences for experimental design. A cultural evaluation task in Hindi might fail for two distinct reasons: (1) a language failure, where the model cannot linguistically grasp the question, or (2) a cultural failure, where the model comprehends the question but lacks the requisite cultural knowledge. There should be a stringent evaluation pipeline that can thus differentiate between these two failure modes. In this regard, the paper applies this principle in structuring the review of the dataset.  

Now, the remainder of this document reviews datasets organised into six functional categories that correspond to different dimensions of Indic alignment.

1. **Multilingual Understanding and Generation Benchmarks**: These assess linguistic competence across multiple Indic languages and work as prerequisite controls for cultural evaluation.  

1. **Cultural Knowledge and Reasoning Datasets**: These examine factual cultural knowledge, applied cultural competence, and multi‑hop cultural reasoning.  

1. **Social Bias and Stereotype Evaluation Datasets**:  These identify biases related to caste, religion, region, gender, and intersectional identities.  

1. **Legal, Governance, and Institutional Datasets**: These are used to assess procedural reasoning and institutional knowledge in areas like law and public administration.  

1. **Code-Switching and Informal Language Datasets**: These datasets evaluate model performance on mixed-language communication characteristic of real-world Indian language use.  

1. **Pre-training and Instruction-Tuning Corpora**:  These are training datasets used to build and tune Indic large language models.

Category 1 focuses on multilingual evaluation benchmarks that assess linguistic competence across Indic languages.
## <a name="_hv20gpn7ki72"></a>**2. Category 1: Multilingual Understanding and Generation Benchmarks**  

Resources or datasets discussed in this section are commonly referred to as benchmarks; they are fundamentally evaluation datasets. Within the LLM development lifecycle, these benchmarks constitute a distinct category of datasets used exclusively during the evaluation stage to measure linguistic competence before conducting deeper cultural alignment assessments. Unlike training datasets, which can be used to build or optimize models, benchmark datasets are standardized test corpora that scholars can use to compare model performance or behavior across tasks and languages. Given that the primary objective of this section is to establish linguistic-competence baselines, most of the resources surveyed are evaluation benchmarks. 

` `Multilingual Understanding and Generation Benchmarks are primarily evaluation benchmarks designed to assess a model's capacity to interpret and generate text across multiple Indian languages. They form the linguistic component layer of an evaluation of a model's cultural competence. The first diagnostic test for determining why a model fails to perform culturally is to determine if the failure is due to linguistic incompetence (weak understanding of language) or the lack of cultural knowledge. Thus, multilingual evaluation benchmarks are a control before conducting cultural alignment analyses. They are necessary but not sufficient criteria for assessing cultural alignment. 










**Table 1: Major multilingual benchmarks for evaluating language understanding and generation across Indic languages**


|**Dataset**|**Languages Covered**|**Task Types**|**Primary Purpose**|**Strength for Indic Research**|
| :-: | :-: | :-: | :-: | :-: |
|**IndicXTREME**|22 Indic languages|Classification, NER, QA, retrieval, structured prediction|Broad multilingual evaluation across scheduled languages|Only benchmark covering all 22 constitutionally scheduled languages|
|**IndicGLUE**|11 Indic languages|Classification, NLI, paraphrase detection, retrieval, headline generation|Foundational multi-task NLU benchmark|Historical baseline widely used in Indic NLP research|
|**MILU**|11 Indic languages|Multiple-choice QA across 8 domains|Evaluation of India-specific domain knowledge|Exam-derived questions reflecting real Indian educational and institutional knowledge|
|**IndicGenBench**|29 Indic languages|Summarization, translation, and QA generation|Evaluation of multilingual generation quality|Parallel evaluation enabling strict cross-lingual generation comparison|
|**IndicQA**|11 Indic languages|Extractive and abstractive question answering|Multilingual reading comprehension evaluation|Includes code-mixed variants such as Hinglish and Tamlish|
|**FLORES-200**|200 languages (many Indic)|Machine translation|Standard multilingual translation benchmark|Includes many low-resource Indic languages|

As Table 1 demonstrates, most multilingual benchmarks are based on linguistic competence rather than culturally informed reasoning. They can best be interpreted as baseline controls that assess a model's ability to function effectively across multiple Indic languages before the evaluation of cultural alignment. These benchmarks differ in language coverage, task types, and evaluation goals, but they all serve the same purpose: establishing whether a model can operate effectively across Indic languages.


### <a name="_29t5e68xoqr5"></a>2.1 IndicGLUE (IndicNLPSuite)  

IndicGLUE is one of the earliest and foundational multi‑task Natural Language Understanding (NLU) benchmarks for Indian languages, introduced as part of IndicNLPSuite at EMNLP 2020 by AI4Bharat. It comprises six tasks: news-article classification, news-headline generation, cross-lingual sentence retrieval, paraphrase detection, natural-language inference, and Wikipedia section-title prediction, across 11 Indic languages.  

**Evaluation:** As IndicGLUE is a benchmark designed to test the encoder-based language understanding of a model, it is especially effective for evaluating how well a model can represent language across multiple languages (i.e., multilingually) versus how well it can generate content based on the language representations provided by the model. Each task employs a standard metric appropriate to its type: accuracy for classification, BLEU/ROUGE for generation, and cosine similarity for retrieval. 

Models are fine‑tuned on training splits and assessed on held‑out test sets. The main idea of such a benchmark is to establish a baseline for encoder-based multilingual models, such as mBERT, XLM-R, and IndicBERT, enabling further comparison among these models using baseline scores.

**Example Task**: Taking a brief news headline written either in Hindi, Bengali, or Marathi, which needs to be put under some category like politics, sports, or business.  

**Use in prior research:** IndicGLUE has established performance baselines for IndicBERT v1 and v2, MuRIL, and mBERT across Indic NLP tasks. Subsequent Indic NLP work from 2020 to 2023 cites IndicGLUE figures to maintain continuity.  

**Strengths:** This benchmark offers a historical baseline with five years of comparable published results, employs a multi‑task design that discourages single‑capability optimization, and simultaneously covers 11 languages.  Since this benchmark was created in 2020 and has been used for testing since then, it provides a longitudinal baseline for evaluating changes in the performance of Indic NLP models over time. 

Benchmarking with IndicGLUE is particularly useful for assessing a model's cross-lingual performance (i.e., its ability to produce good results in another language). This includes high-resource languages (e.g., English, Hindi) to low-resource languages (e.g., Nepali, Marathi).

**Limitations:** IndicGLUE does not encompass all 22 constitutionally scheduled languages and focuses predominantly on sentence‑level tasks. Hence, it is limited to discourse- or document-level understanding, fails to probe cultural knowledge, bias, or longer-form reasoning, and exhibits a skew toward news-domain content.  

### <a name="_7ump43tltkrh"></a>2.2 IndicXTREME  

IndicXTREME extends the IndicGLUE framework to all 22 constitutionally scheduled Indian languages across nine diverse task types: **five sentence‑classification tasks**, **two structured‑prediction tasks**, **one question‑answering task**, and **one sentence‑retrieval task**. A total of 105 evaluation sets make up IndicXTREME.  

**Evaluation:** Each language is annotated manually. It is evaluated in a zero- or few-shot setting, tested on unseen or low-resource Indic languages without per-language fine-tuning.  It is particularly useful for measuring cross-lingual transfer.

**Example Task:** For example, in a named-entity recognition task within IndicXtreme, the model may be given a sentence translated from a low-resource language (like Punjabi or Odia), which can be used for named-entity recognition, and then the model must identify names of persons, places, or organizations in the given sentence.

**Use in prior research:** IndicXTREME currently serves as the standard benchmark for all Indic multilingual models. IndicBERT v2, MuRIL, XLM‑R‑Large, and other Indic-capable transformer models. AI4Bharat used the benchmark to demonstrate systematic performance deficiencies in low-resource scheduled languages (Bodo, Santali, Manipuri, Kashmiri).  

**Strengths:** It is the only benchmark that covers all 22 scheduled languages and includes human verification. The nine task types help prevent single-capability optimization, and the benchmark serves as a standard for the entire Indic NLP community.  

**Limitations:** Since low-resource languages typically lack large test sets, statistical reliability is limited. Additionally, certain components are sourced from translated materials, and the benchmark does not directly evaluate the quality of generated output, cultural knowledge, or bias.

### <a name="_c2eypnxx0whp"></a>2.3 MILU: Multi‑Task Indic Language Understanding Benchmark  

MILU is the most recent and India‑specific multilingual evaluation benchmark, introduced in NAACL 2025 by AI4Bharat and IBM Research India. It contains approximately 85000 multiple-choice questions across 11 Indic languages, 8 domains, and 41 subjects. The questions are drawn from national and state-level competitive examinations in India (e.g., UPSC, state public service commissions, regional board examinations) and cover the domains of STEM, Arts and Humanities, Social Sciences, Regional Languages, Governance and Law, and Medicine.  

**Evaluation:** The models are tested in zero-shot (no prior examples) or few-shot (a small number of examples provided) settings on four-choice multiple-choice questions. Accuracy per domain and accuracy per language constitute the primary metric, out of which domain‑wise breakdown provides the most informative analytic dimension. Thus, this allows identification of the model's strengths, whether in STEM (Science, Technology, Engineering, and Mathematics) domains, governance, the humanities, or regional knowledge.

**Example Task:** A model is presented with a multiple-choice question in an Indian language concerning a public policy initiative, a historical event, or a subject regularly taught and tested in Indian secondary schools. Ultimately, it tests whether LLM models can answer questions across domains such as Indian education, history, policy, and general knowledge.

**Use in prior research:** MILU has been used to evaluate GPT‑4o, Llama‑3‑70B, Gemma‑2‑27B, IndicBERT, MuRIL, and several Indic‑specific models. One outcome is that, even on questions specific to culture and governance, all models (including frontier-level systems) perform significantly worse than on STEM questions, and that India-specific fine-tuning yields tangible improvements.  

**Strengths:** Its strengths lie mainly in questions that are culturally grounded rather than English translations. The 85,000 MCQs are large enough to be statistically reliable. This domain-level analysis is especially helpful for determining if a model's weakness arises from a lack of understanding of the language or from a lack of cultural knowledge about India.

Unlike other benchmarks, which have been translated into a particular language, the exam-derived questions in MILU are intended to reflect the knowledge expected of an educated person in India. As a result, the benchmark is representative of real-world expectations for NLP systems developed for use in India.

**Limitations:** However, the benchmark addresses only 11 of the 22 scheduled languages. Additionally, the multiple-choice format does not assess the quality of generation or conversational skills. Exam-sourcing can prioritize models that excel at test-taking techniques rather than knowledge. The benchmark does not consider code-switched queries.  

### <a name="_j9cwx56c8t5"></a>2.4 IndicGenBench  

IndicGenBench evaluates generation quality across 29 Indian languages in four tasks: cross‑lingual summarization (XLS), machine translation (MT), cross‑lingual question answering (XQA), and cross‑lingual generation from Wikipedia (XWiki). Google Research introduced the benchmark at ACL 2024.

**Evaluation:** It employs **multi-way parallel evaluation,** i.e., the same source text is evaluated simultaneously in all 29 languages, enabling fine-grained cross-linguistic comparison of generation quality. Metrics used are ROUGE‑L for summarization, chrF++ for machine translation, and F1 score for question answering. 

**Example Task:**  A model can be asked to summarize the same source text in multiple indian languages, allowing researchers to assess whether a model can generate equally good summaries in different Indian languages from the same source text.

**Use in prior research:** IndicGenBench has been used to evaluate multilingual generation quality and cross-lingual consistency in language models that generate content in multiple Indic languages.

**Strengths:** This benchmark is the only one that includes generative tasks of 29 Indic languages. Multi-way parallel design enables rigorous cross-linguistic comparison to determine whether the culturally salient information in one language in India can be replicated accurately in another. A primary advantage of this benchmark is that, by evaluating the same source content in multiple languages, it enables researchers to assess cross-lingual generation consistency, a fundamental aspect of deploying multilingual large language models.

**Limitations:** Generation metrics such as ROUGE and chrF++ are insufficient for evaluating open‑ended or culturally nuanced generation. Their assessment of instruction is not done after or during conversational generation, document-level generation, or dialogue or multi-turn tasks.
### <a name="_vd99ietn3nod"></a>2.5 IndicQA 

IndicQA is a multilingual reading comprehension benchmark encompassing 11 Indic languages, evaluating both extractive (span‑prediction) and abstractive QA tasks. The use of code-mixed variants (Hinglish, Tamlish, Tenglish) is also a distinguishing characteristic, enabling the evaluation of realistic mixed-language queries. 

**Evaluation:** Models are given a passage and asked questions based on it. Models must either extract the answer from the passage or generate it in free form (in their own words), depending on the task variant.

**Example task:** A model can be given a brief text (passage) and then asked to respond to a factual question based on the information available in the passage.

**Use in prior research:** IndicQA has been used to evaluate multilingual reading comprehension in Indic‑capable models and to investigate how models handle both clean and code‑mixed queries.

**Strengths:** It covers both extractive and abstractive QA, offering a more comprehensive evaluation than the QA subset of IndicXTREME. The code-mixed variants are tested on realistic user input, and factual understanding is evaluated in a context-grounded manner rather than by memorised answers. 

**Limitations:** The benchmark is limited to 11 languages, and the passages are primarily sourced from Wikipedia. This can unduly emphasize formal, encyclopedic material at the expense of domain-specific knowledge.
### <a name="_xsjz2s6igsjn"></a>2.6 Flores-200

FLORES-200 is a multilingual machine translation evaluation dataset presented by Meta AI that comprises parallel sentences in 200 languages, many of which are Indic. Although originally designed as a translation evaluation dataset, it has since become a benchmark for assessing the language coverage of multilingual LLMs.

**Evaluation:** The benchmark includes sentence-to-sentence translation between two languages and a quality assessment of the translation using BLEU or chrF scores. The dataset is sufficiently filtered across subjects and is not strongly biased toward any particular domain. Models function as interlanguage sentence translators and are evaluated using conventional translation measures.

**Example task:** A model can be asked to translate the same sentence in English to Hindi, Tamil, Bengali, or any other Indic language.

**Use in prior research:** FLORES-200 is widely used to measure multilingual language coverage and translation quality.

**Strengths:** FLORES-200 features a multilingual assessment standardized across a large number of languages, including many low-resource Indic languages not represented in many NLP benchmarks.

**Limitations:** The data are also limited to translation tasks and, as such, do not explicitly test cultural reasoning or contextual knowledge.

#### <a name="_brk5w5gj2g1n"></a>Experiment Design Implications

Collectively, these multilingual standards establish a baseline of linguistic competence that enables researchers to determine whether failures in cultural tasks arise from language limitations or from a lack of cultural knowledge. When a model performs poorly on such datasets, it cannot be reliably asserted that failures in cultural evaluation tasks are due to cultural misalignment. On the other hand, models that score well on multilingual tests but poorly on cultural tests provide strong evidence of a lack of cultural knowledge.
## <a name="_ifv2vcjrt8ai"></a>**3. Category 2: Cultural Knowledge and Reasoning Datasets** 

Datasets in this category evaluate the cultural alignment layer directly, i.e., evaluate whether a model possesses culturally grounded knowledge about Indian society, institutions, and regional practices. Unlike multilingual benchmarks, which primarily measure linguistic competence, these datasets go beyond linguistic competence to assess whether models correctly understand or reason about culturally specific information such as festivals, historical events, governance structures, regional traditions, and social practices.

Within the LLM development lifecycle, datasets in this category are primarily used during the evaluation stage to assess cultural alignment. Although a subset of datasets may also be reused for supervised fine-tuning (SFT), their primary function remains to assess whether model responses accurately reflect contextual knowledge of Indian society.

The datasets reviewed in this section examine different aspects of cultural reasoning. Some emphasize factual cultural knowledge across states and regions, whereas others evaluate generative cultural adaptation, multimodal cultural understanding, or multi-hop reasoning over cultural facts.

**Table 2. Major datasets for evaluating cultural knowledge and reasoning in Indian contexts**


|**Dataset**|**Coverage**|**Task Types**|**Cultural Dimension Tested**|**Key Strength**|**Key Limitation**|
| :-: | :-: | :-: | :-: | :-: | :-: |
|**SANSKRITI**|All 28 states + 8 UTs|MCQ, True/False, Short answer, Generative QA|Cultural knowledge across food, festivals, architecture, governance, language, and history|Only dataset with complete sub-national geographic coverage|Primarily English-based questions|
|**DIWALI**|36 Indian sub-regions|Cultural text adaptation|Surface vs deep cultural adaptation|Measures generative cultural competence|Deep cultural adaptation requires human evaluation|
|**VIRAASAT**|Cultural knowledge graph|Multi-hop reasoning questions|Cultural reasoning chains across entities|First dataset evaluating multi-hop cultural reasoning|Limited dataset size (~3k questions)|
|**DRISHTIKON**|14 Indic languages|Multimodal cultural QA|Visual cultural understanding|Only multimodal benchmark for Indian cultural reasoning|Limited scale (~2k questions)|
|**Indica**|5 geographic zones|Cultural commonsense QA|Regional cultural variation|Measures cultural disagreement across regions|Small dataset size|
|**CulturalBench India**|Multiple cultural domains|Cultural QA tasks|Cultural norms and traditions|Focused diagnostic cultural evaluation|Smaller benchmark compared to others|

As shown in Table 2, cultural evaluation datasets differ in the dimensions of culture they assess. Together, these datasets provide complementary perspectives on whether language models possess culturally grounded knowledge about India.\
\
Several datasets in this category have been introduced only recently, as research on cultural alignment in large language models has expanded. As a result, some benchmarks have already been widely adopted in evaluation studies, while others remain emerging resources whose broader use is still developing.
### <a name="_nxsulsyrc2cm"></a>3.1 SANSKRITI 

SANSKRITI is the most geographically comprehensive, India‑specific cultural knowledge benchmark currently available, as published in ACL Findings 2025. It comprises 21,853 human‑annotated question‑answer pairs covering 16 cultural attributes across all 28 Indian states and eight Union Territories, which makes it the only dataset with complete sub‑national geographic coverage. The 16 cultural attributes include; food and cuisine, festivals and rituals, traditional clothing, folk arts and dance, classical music, architecture and monuments, governance and administration, transport and infrastructure, health care traditions, sports and games, nature and ecology, tourism and heritage, historical figures and events, religion and philosophy, languages and scripts, and agricultural practices. It contains four types of tasks: multiple-choice questions, true/false questions, short-answer questions, and open-ended generative questions. 

**Evaluation:** For multiple-choice and true/false tasks, accuracy is the metric. In short-answer and open-ended assignments, assessment is conducted using ROUGE-L and a human rating of a sample. The dataset is split into state‑stratified training, development, and testing sets, enabling evaluation of performance disparities across states and regions. Generative responses require human assessment, as automatic measures cannot be trusted to evaluate culturally appropriate explanations.

**Example task:** A model can be asked to identify a conventional cultural practice associated with a particular state in India, such as a local festival, dance style, or cuisine.

**Prior research:** The models that have been tested using SANSKRITI include GPT-4o, Gemini-1.5-Pro, Claude-3.5-Sonnet, and Llama-3-70B, and several Indic‑specific models. Findings show that (1) All the models are much better on North Indian and major state culture compared to Northeast India, tribal states, and Union Territories. (2) Performance on governance and institutional attributes is systematically lower than on arts and cuisine attributes, indicating models possess cultural entertainment knowledge but lack institutional knowledge. 

**Strengths:** The dataset offers comprehensive geographic coverage across all Indian states and union territories and incorporates multiple cultural domains. The 21,853 QA pairs dwarf all four alternative cultural datasets (CulturalBench India: ∼200 questions, Indica: 1,630). The dataset is curated by human curators using established Indian cultural sources, and 16 attribute types enable analysis of which cultural dimensions are most misaligned. 

**Limitations:** The dataset primarily contains English rather than Indic languages; thus, the benchmark evaluates cultural knowledge rather than multilingual cultural reasoning. Elimination techniques can partially grade multiple-choice and true/false questions. Elite and upper‑caste cultural knowledge may be over‑represented relative to that of tribal, Dalit, and minority communities. Moreover, cultural practices that differ across communities need not have a single correct solution, creating ambiguity in evaluation.

### <a name="_d9cyeiwt2g7b"></a>3.2 DIWALI

DIWALI (Diversity and Inclusivity aWare cuLture‑specific Items for India) was presented as an oral paper at EMNLP 2025. It comprises approximately 8,000 Cultural Situation Items (CSIs), grouped and categorized into 36 Indian sub-regions and 17 cultural facets. 

**Evaluation:** The main task is cultural text adaptation: given a text produced in one Indian sub-regional cultural context, adapt it for another sub-regional cultural context.  A source text is matched with a target sub-region. The models yield an adapted form, which is compared to reference adaptations on two fronts: (1) surface adaptation score – it is the assessment of the correctness of change in culturally visible aspects, such as names, foods, rituals, or places. (2) deep adaptation score – it assesses the proper transformation of the underlying social meaning, institutional structure, and communication norms of the cultural context.

**Example task:** A model translates (adapts) a piece of writing from one regional cultural context to another. In this case, the model needs to know how to adapt cultural references, such as rituals, social gatherings, and greeting customs, to each region. 


**Prior research:** The DIWALI benchmark paper compared various models, including GPT-4o, Gemini-1.5, and Claude-3.5. Results show that models are often good at surface culture substitution but struggle with deeper cultural adaptation, which implies a limited understanding of the social structures underlying the surface.

\
**Strengths:** The boundary between the surface and deep adaptation is the most theoretically consequential input to the Indic cultural assessment in 2025. This coverage of 36 sub-regions provides the highest subnational granularity of all Indian cultural data. The adaptation task itself is a direct measure of generative cultural competence, not memorisation.  

**Limitations:** Deep adaptation can only be evaluated by humans; traditional measures cannot automate it. The small number of CSIs (approximately 8,000) is insufficient for large-scale supervised fine-tuning without augmentation. According to scholars, sub-regional boundaries may differ from community self-identification. Tasks concerning cultural adaptation can also yield two or more acceptable results, making it challenging to provide a strictly automated assessment.


### <a name="_bzcq1xrlz2k9"></a>3.3 VIRAASAT  
VIRAASAT, published in 2025, evaluates multi‑hop reasoning over an Indian cultural knowledge graph. The dataset includes more than 700 knowledge-graph artifacts (cultural entities and their relations). It contains over 3,200 two-hop questions that involve chaining two facts to arrive at a correct answer.  

**Evaluation:** Multi-hop questions require recalling two related cultural facts and then writing them into an answer. VIRAASAT compares three evaluation strategies: Chain‑of‑Thought (CoT) prompting, standard Retrieval‑Augmented Generation (RAG), and the authors' proposed Structured Chain of Memory (SCoM) approach. SCoM achieves approximately a 20 % improvement over CoT by structuring the intermediate retrieval steps over the knowledge graph.  

**Prior Research:** Studies using VIRAASAT show that structured retrieval approaches improve multi-hop cultural reasoning.


**Example task:** A model is asked to respond to a prompt that requires it to use at least two distinct pieces of cultural knowledge. For example, if a model knows what a cultural practice is in a particular state, they would also need to connect that practice to a related historical or linguistic fact about the state.

Single-hop: What state is popular in the Garba dance? – Gujarat.  

Two-hop: What is the official classical language of the state where the Garba dance is known?

**Strengths:** VIRAASAT is the sole dataset that evaluates multi-hop cultural reasoning in India. The knowledge‑graph structure enables systematic analysis of missing connections in cultural knowledge. The 20 % SCoM improvement over CoT demonstrates that architectural choices in evaluation methodology substantially influence outcomes—an important consideration for Step 2 experiment design.  

**Limitations:** This dataset contains only 3,200+ questions, which is too small to train without augmentation. The reasoning is limited to two hops, whereas genuine cultural reasoning chains in Indian contexts often require three or more hops. Knowledge-graph items can be excessive in representing the North Indian and Hindu-dominated culture.  Knowledge graphs can also find it difficult to capture informal or dynamic cultural knowledge that is not well available in formal sources.
### <a name="_nsngphr0bj6s"></a>3.4 DRISHTIKON  

DRISHTIKON is a multimodal, multilingual Indian cultural benchmark published at EMNLP 2025. It includes 2,126+ questions in 14 Indic languages, in which models are expected to reason about images of Indian culture, including classical dance forms, local artwork, architectural monuments, traditional clothing, ritual objects, and images of festivals.  

**Evaluation:** It assesses whether the model can correctly recognize culturally significant objects or practices depicted in images when prompted in Indic languages.

**Prior research:** DRISHTIKON is a recently proposed benchmark, and its use in comparative evaluation studies is still limited.

**Example Task:** Models are asked to identify or explain culturally significant objects or practices shown in images.

**Strengths:** It is the sole Indian cultural multimodal benchmark. It covers 14 Indic languages. It assesses the visual-cultural grounding, in which models are asked to identify culturally specific visual material in an Indian language query scenario.  

**Limitations:** The acquisition of images of Indian visual culture is methodologically problematic; some image categories are represented more than others. The benchmark requires the capability of the vision-language models.  

3\.5 Indica  

Indica is a regional cultural common‑sense dataset comprising 1,630 questions organised across five Indian geographic zones (North, South, East, West, Northeast). Its primary finding is that only 39.4 % of cultural questions about India receive consistent answers across all five regions, indicating that treating India as a single cultural entity leads to systematic misrepresentation.  The data demonstrate that the concept of cultural alignment cannot assume a single Indian culture; it must account for the region's diversity.

**Evaluation:** The cultural questions are posed to the models, and the consistency of their answers across regions is assessed.

**Example task:** A model may be asked questions about culture, and its answers are evaluated for consistency across different regional contexts.

**Strengths:** It is the only data that measures within-India cultural disagreement. This result highlights the difficulty of defining a single cultural profile for India, indicating that it is impossible to define Indic alignment as the training of a model to fit a single profile of an Indian culture.  

**Limitations:** The dataset's 1,630 questions constitute a relatively small sample, and the five-zone classification is geographically coarse.  

### <a name="_i7z5is5rrye8"></a>3.6 CulturalBench India
CulturalBench India is a benchmark designed to evaluate culturally grounded reasoning in the Indian context through question-answer tasks concerning cultural practices, festivals, social norms, and local traditions.

**Evaluation:** Models are presented with culturally specific questions and evaluated on the extent to which they respond appropriately, reflecting their understanding of culture.

**Example task:** A model may be asked about the social significance of a particular festival or cultural practice in a specific region of India.

**Prior research:** CulturalBench has been used primarily as a diagnostic dataset for evaluating culturally grounded reasoning in LLMs, though large-scale benchmarking across multiple models remains limited.

**Strengths.** The dataset focuses directly on cultural reasoning rather than purely linguistic tasks.

**Limitations:**  The dataset is relatively small compared to larger evaluation benchmarks and therefore primarily serves as a diagnostic dataset rather than a large-scale benchmark.

All of these datasets assess three aspects of cultural alignment: factual cultural knowledge, applied cultural adaptation, and domain knowledge of Indian institutions.

#### <a name="_ipxuu196grj3"></a>Experiment Design Implications


In the development of language models, certain datasets play an essential role, especially during the evaluation phase, where they help us understand culturally grounded reasoning. Sometimes, portions of these datasets are also used for supervised fine-tuning to make sure the responses are culturally appropriate. Together, these datasets act as valuable tools to gauge whether language models not only have a good grasp of language but also a solid understanding of Indian society and its nuances.

These datasets look at different aspects of cultural knowledge and reasoning within Indian contexts. Some concentrate on factual cultural information from various states and regions, while others delve into how well models can adapt culturally, understand diverse forms of communication, or make connections across multiple cultural facts. In sum, they work together to assess how well language models can blend linguistic skill with a deep understanding of India's cultural landscape.

On top of evaluating cultural knowledge, it’s also crucial to address social biases and stereotypes. That’s why the next section will focus on datasets that are designed to examine bias and fairness within Indian contexts.

## <a name="_ydvx7pozq4sp"></a>**4. Category  3: Social Bias and Stereotype Evaluation Datasets**  

The social bias environment in India is distinct from that in Western societies. In many Western bias benchmarks, the primary axes of discrimination involve race or gender. In contrast, the axes of bias that have the most socially consequential effects in India, including caste identity, religious community, regional identity, and their intersection, do not have similar counterparts in Western bias datasets like WinoBias or CrowS-Pairs.

All datasets in this category were created because Western-bias benchmarks failed to represent the Indian social structure.  This means that biased evaluation datasets created for use in Western settings are not always effective at identifying the most socially significant forms of bias in Indian society. To tackle this issue, a number of datasets have been developed to specifically evaluate social bias in the Indian context. These datasets help us understand if language models reinforce stereotypes, show discriminatory preferences, or produce biased responses when they interact with content related to various Indian identity groups.




|**Dataset**|**Bias Dimension**|**Task Type**|**Languages**|**Key Strength**|
| :-: | :-: | :-: | :-: | :-: |
|Indian-BhED|Caste, Religion|Sentence completion|English|PLL scoring|
|IndiBias|Multi-axis bias|Sentence pairs|English, Hindi|Counterfactual augmentation|
|INDIC-BIAS|85 identity groups|Generation / judgment|English|Large identity coverage|
|BharatBBQ|Social stereotypes|QA|8 Indic languages|Multilingual bias evaluation|
|SPICE|Community stereotypes|Survey-based prompts|English|Community-sourced|
|IndiCASA|Caste bias|Dialogue generation|English|Conversational setting|

### <a name="_fkkdrmqtbdfp"></a>4.1 Indian‑BhED  

Indian-BhED is one of the earliest India-specific bias benchmark with proper emphasis on the two most socially significant discrimination dimensions: **caste and religion**. It contains approximately 1,600 sentence templates evaluated using Pseudo‑Log‑Likelihood (PLL) scoring.  

**Evaluation:** PLL scoring assesses whether a language model assigns higher probability to stereotypical sentence completions compared to anti-stereotypical alternatives. For example, a template may compare two sentence completions that involve a caste identity. Suppose a sentence, The [caste name] person was known to be [stereotypical attribute], compared to The [caste name] person was known to be [counter-stereotypical attribute]. A higher PLL preference for stereotypical completions indicates greater model bias.  

**Prior research:** Studies using Indian-BHED reports indicate that language models exhibit strong stereotypical preferences across both caste- and religion-related templates. Models are stereotypically partial to caste-based templates (63-79 percent) and religion-based templates (69-72 percent), respectively, among the largest magnitudes of bias ever reported in the NLP literature. 

**Strengths:** PLL scoring is more robust than generation‑based evaluation as it is less sensitive to prompt wording. It is the largest dataset of language model caste bias. The dataset directly targets two socially important dimensions of bias in India and provides a systematic method for measuring stereotype preference.

**Limitations:** The templates are limited to English and do not cover bias evaluation in Hindi or in regional language contexts. The 1,600 templates remain insufficiently representative of the broader diversity of caste communities in India across its 28 states. PLL requires white‑box access to model log‑probabilities,, which is not available for many closed-source models. Additionally, template-based datasets may not capture more nuanced contextual biases that arise in natural conversation.

**Evaluation:** PLL scoring measures whether a language model assigns higher probability to stereotypical sentence completions compared to anti-stereotypical alternatives. For example, a template may compare two sentence completions that involve a caste identity. If the model consistently assigns higher probabilities to stereotypical attributes, this indicates bias.


4\.2 IndiBias  

IndiBias, published at NAACL 2024, comprises 800 stereotypical sentence pairs and 300 intersectional tuples across seven social dimensions: age, caste, gender, nationality, religion, profession, and region. It is available in both English and Hindi.  

**Evaluation:** IndiBias contains stereotypical and anti-stereotypical sentence pairs across multiple social dimensions. Standard bias testing involves comparing sentence pairs that differ in stereotypical versus anti-stereotypical content. The dataset further provides counterfactual augmentation, in which the sensitive attribute is manipulated while the rest of the sentence remains unchanged, which is helpful for debiasing experiments.  Counterfactual augmentation enables researchers to assess whether a model's prediction changes only when a sensitive variable, such as caste or gender, is altered.

**Strengths:** It simultaneously addresses seven social dimensions, including intersectionality. Counterfactual augmentation enables the use of IndiBias for debiasing training, not merely for evaluation. It is available in English and Hindi and has been peer-reviewed.

**Limitations:** The dataset currently lacks coverage for many regional identities present in India. The 800 data pairs are insufficient to robustly train a model. Intersectional tuples do not represent multi-axis bias. The Indian-language component is primarily Hindi, with no representation of other Indic languages.

The assessment pipeline is at the initial level. System following instruction (SFT) methods have been employed to generate counterfactual pairs for debiasing predictions.  
### <a name="_svt8nv9yl6hj"></a>4.3 INDIC-BIAS 

INDIC-BIAS evaluates stereotype acceptance across a wide range of Indian identity groups. It comprises 85 Indian identity groups and three evaluation tasks: Plausibility (how believable is this stereotype?), Judgment (acceptable or unacceptable for this stereotype?), and Generation (does this stereotype generate stereotypic content?). These tasks assess whether models consider stereotypical statements believable, judge them acceptable, and generate such stereotypes in open-ended responses.

**Evaluation:** It measures the proportion of responses where the model accepts or generates stereotypical statements about an identity group. The primary metric reported is the Stereotype Acceptance Rate (SAR).\
\
**Prior research:**  Results show that all 14 tested LLMs have a rate of Stereotype Acceptance (SAR) that is above 50 %, even when explicitly asked to rationalise and justify their answers before responding. Bias in terms of Indian stereotypes is not reduced with standard RLHF safety training models trained on Western data, which still accept Indian stereotypes with high rates.

**Strengths:** The coverage of 85 identity groups represents the broadest scope among Indian bias datasets. The tri-task assessment simultaneously biases at the generation, plausibility, and judgment levels. The fact that rationalisation prompting does not directly reduce SAR feeds into alignment methodology.  The data measures explicit and implicit stereotype acceptance.

**Limitations:** The data is mainly in English. The 85 identity groups may exhibit overrepresentation among urban Hindu majority communities. Cross-language assessment is limited to a few languages. The assessment pipeline is still immature.  

### <a name="_cdz3t7yeakde"></a>4.4 BharatBBQ 

BharatBBQ  adapts the influential BBQ (Bias Benchmark for QA) methodology to eight Indic languages, generating 392,864 examples from 49,108 base templates. The QA format test is used to determine whether models exhibit stereotyping when responding to ambiguous questions. 

**Evaluation:** Every question has both an ambiguous (when the correct answer cannot be inferred from the context) and a disambiguous (when the context itself answers) version of the question. Models that respond more stereotypically to ambiguous questions than to disambiguated questions resort to stereotypes as shortcuts in inference. This indicates bias, as ambiguity means the situation does not provide a definitive answer, and the model is left to make assumptions.

**Strengths:** The question-and-answer format is more similar to actual deployment conditions than the sentence-completion format. The eight Indic languages allow multilingual prejudice assessment on a scale. Ambiguous versus disambiguated contrast is a more rigorous methodologically than single template evaluation. 

**Limitations**: Examples generated by the template may not be as naturalistic as those produced by handwritten templates. Coverage of eight languages omits 14 scheduled languages. The assessment process is still in its infancy.  
### <a name="_57f8a4r4al0z"></a>4.5 SPICE 

SPICE collects stereotypes reported directly by members of Indian communities through surveys. 

Evaluation measures whether the model agrees with, rejects, or generates stereotype statements associated with different social groups.

**Evaluation:** Evaluation is based on prompting models with stereotype statements derived from survey responses and assessing whether the models agree with, reject, or reproduce the stereotype.

**Strengths:** Community-sourced methodology guarantees ecological validity, i.e., it captures stereotypes that are actually present in Indian society, rather than those the researchers suppose exist. The dataset accounts for both explicit (acknowledged) and implicit (unacknowledged) stereotypes.  

**Limitations:** The dataset is quite small, and the assessment model has yet to be developed.



### <a name="_occ25c9m3p52"></a>4.6 IndiCASA

IndiCASA evaluates caste-related bias in conversational settings. Unlike template-based benchmarks, the dataset presents dialogue contexts involving interactions between individuals from different caste groups.

**Evaluation:** Models are evaluated by whether the generated responses exhibit discriminatory or stereotypical behavior.

**Strengths:** The conversational format allows evaluation of bias in realistic dialogue scenarios.

**Limitations:** The dataset remains relatively small and is currently limited to English-language conversations.
### <a name="_73kn44vxsis6"></a>4.7 CasteBias Dataset

The CasteBias dataset focuses on the assessment of caste-based stereotyping and discrimination trends in language models applied to sentence completion and classification. The dataset assesses whether models link caste identities to specific stereotypical occupations or social characteristics.

**Evaluation:** Evaluation typically involves sentence completion or classification tasks in which models must select or generate attributes associated with caste identities.

**Strengths:** The dataset directly focuses on one of the most socially important axes of bias in India.

**Limitations:** Contextual or conversational bias may not be reflected through a template-based structure.

#### <a name="_2pcnn61bjtrt"></a>Experiment Design Implications

For our experiments, we can use INDIC-BIAS (FairI Tales) as a primary benchmark to measure how stereotypes are accepted among various Indian identity groups. IndiBias offers structured sentence pair comparisons across different social dimensions, which helps us analyze intersectional bias in a controlled way. BharatBBQ adds to this by looking at bias in question-and-answer scenarios across several Indic languages. Lastly, Indian-BHED provides a strong framework for assessing bias based on caste and religion, especially when we have access to model log probabilities.

These datasets work together to create a comprehensive approach to evaluating bias. They include different methods such as detecting bias through generated content, structured sentence comparisons, multilingual question-and-answer assessments, and probability-based measurements. It's important to use multiple benchmarks because each dataset highlights different aspects of harmful behavior, ensuring that we don't rely on just one way to detect bias.



## <a name="_13jtqyhgpljy"></a>**5. Category 4: Legal, Governance, and Institutional Knowledge Datasets**  

Nevertheless, the area with the most devastating actual implications of LLM misalignment is legal and governance. Legal systems are highly institutional and vary by jurisdiction. Indian law differs significantly from Western legal systems concerning statutes, judicial procedures, and administrative institutions. Additionally, legal information in India is available in English as well as multiple regional languages, which adds to the challenge of developing accurate legal AI systems.

Language models primarily trained on Western legal texts may produce inaccurate interpretations of Indian statutes, case law, or administrative procedures in real-world applications. Incorrect legal or administrative guidance from models may result in severe social and economic harm; therefore, proper institutional knowledge is especially essential.

Thus, datasets that assess legal and institutional knowledge are essential for evaluating whether language models can reason accurately about Indian governance structures and legal processes.

**Table 4. Legal, Governance, and Institutional Datasets for Indian LLM Evaluation**


|**Dataset**|**Domain**|**Task Type**|**Pipeline Stage**|**Key Strength**|
| :-: | :-: | :-: | :-: | :-: |
|IL-TUR|Legal reasoning|Multi-task benchmark|Evaluation|Real legal tasks|
|NyayaAnumana|Legal corpus|Training corpus|Pretraining|700k cases|
|TathyaNyaya|Legal reasoning pipeline|Multi-stage reasoning|Evaluation|End-to-end reasoning|
|INLegalBERT|Legal model backbone|Domain pretraining|Pretraining|Widely used model|
|PredEx|Judicial outcome prediction|Classification|Evaluation|Court decision prediction|
|BharatBench|Institutional knowledge|QA|Evaluation|Governance knowledge|

### <a name="_dioav6702p9m"></a>5.1 IL-TUR: Indian Legal Understanding and Reasoning 

IL-TUR is one of the most comprehensive benchmarks for evaluating legal reasoning tasks in the Indian context. The benchmark comprises eight tasks spanning different stages of legal analysis: statute retrieval, judgment prediction, case summarization, legal named entity recognition (L-NER), rhetorical role labeling, legal issue identification, bail prediction, and legal explanation generation. The dataset primarily comprises English legal documents, with limited support for several Indic languages, including Hindi, Tamil, and Bengali.\
\
IL-TUR is currently the most comprehensive benchmark in assessing tasks involving Indian legal reasoning. It encompasses eight tasks across different stages of legal analysis, including statute retrieval, judgment prediction, case summarisation, legal named entity recognition (L-NER), rhetorical role labelling, legal issue identification, bail prediction, and legal explanation generation. The dataset includes both English and limited-resource Indic-language versions (Hindi, Tamil, Bengali). 

**Evaluation:** Each task employs task‑appropriate metrics: F1 for retrieval, NER for classification, ROUGE for summarisation, and accuracy for prediction. All tasks are grounded in human-annotated legal documents derived from the texts of Supreme Court and High Court judgments. The benchmark is constructed using human-annotated legal documents derived from Supreme Court and High Court judgments. The evaluation of each is conducted separately, enabling the researchers to quantify performance across various dimensions of legal thought. 

In the bail prediction task, a model is required to determine whether bail should be granted based on the facts of the case and relevant legal provisions. To make an accurate prediction, the model must understand Indian bail jurisprudence under the Criminal Procedure Code (CrPC). This includes considerations such as the risk of flight, potential interference with the investigation, and the likelihood of repeated offenses.

**Strengths:** The benchmark closely reflects actual judicial processes and is highly applicable to practical legal AI systems. Eight activities encompass the entire legal process and also include Indic-language tasks. The inclusion of multiple tasks enables researchers to evaluate distinct components of legal reasoning.

**Limitations:** Most documents are in English, limiting evaluation in regional languages. The dataset also focuses mainly on higher courts (Supreme Court or High Court) judgments, which may not fully capture legal reasoning patterns in lower courts (District Court).

### <a name="_bs8472xgict4"></a>5.2 NyayaAnumana and INLegalLlama 

NyayaAnumana represents one of the most extensive publicly accessible collections of legal cases in India, containing approximately 702,000 preprocessed judgments. This corpus includes decisions from the Supreme Court, High Courts, various tribunals, district courts, and daily orders. It offers a wealth of information comprising complete judgments, legal arguments, and procedural details, thereby serving as a vital resource for understanding the intricacies of Indian jurisprudence.

**Evaluation:** In academic and practical contexts, NyayaAnumana is primarily utilized as a training dataset for developing domain-specific legal language models. Research has indicated that models trained on this comprehensive corpus exhibit significant advancements in performance in various legal reasoning tasks. These improvements encompass areas such as judgment prediction, where the outcome of legal disputes can be anticipated based on past rulings, and statute retrieval, which involves efficiently locating relevant legal texts. The implications of such advancements are profound, enhancing the capabilities of legal professionals and researchers alike in navigating and interpreting the complexities of the legal landscape in India.

**Strengths:** The dataset provides extensive coverage across multiple levels of the judiciary, allowing models to learn patterns of legal reasoning from diverse legal contexts.

**Limitations:** Most legal documents are written in English, which limits multilingual legal modeling. It is relatively large in size and thus requires substantial computational resources for training large language models.



### <a name="_o39xezdv77p4"></a>5.3 TathyaNyaya 


TathyaNyaya evaluates multi-step legal reasoning in Indian legal contexts. It evaluates the end-to-end Indian legal reasoning pipeline in four stages: fact extraction from petitions, identification of relevant statutes, judgment prediction, and explanation generation. It is the most realistic extant simulation of real legal reasoning. 

**Evaluation:** Models are tested to determine their accuracy in the error-free execution of every step of the legal reasoning pipeline. Accuracy is employed as the evaluation metric for fact extraction and statute identification, whereas generation metrics and human evaluation are utilised to assess the quality of explanations.

**Strengths:** This dataset effectively captures the sequential nature of legal reasoning, enabling researchers to evaluate whether models maintain logical consistency across multiple reasoning steps.



**Limitations:** However, the dataset is relatively small compared to large-scale legal corpora, and the evaluation pipeline is still under active development.

### <a name="_kmuseitdgdc5"></a>5.4 InLegalBERT and InCaseLawBERT  

INLegalBERT and InCaseLawBERT are domain-adapted language models trained on Indian legal corpora. Although they are models rather than datasets, they demonstrate the impact of domain-specific pretraining on performance in legal reasoning.

These models are trained on large collections of Indian statutes and case law. They are widely used as base models for downstream legal NLP tasks, including judgment prediction, statute retrieval, and legal document classification.

**Strengths:** Domain-specific pre-training significantly improves performance on legal-reasoning tasks compared with general-purpose language models.

**Limitations:** Training data remains predominantly English and may not fully represent multilingual legal documentation across Indian jurisdictions.

### <a name="_p1vzuykh6pae"></a>5.5 PredEx

PredEx is an Indian legal prediction dataset designed to assess judicial outcome prediction. The corpus comprises summaries of cases and judicial rulings from Indian courts. 

**Evaluation:** Models are given a textual description of a case and asked to predict the final judicial outcome, using accuracy and F1 score as commonly used evaluation metrics.

**Strengths:** PredEx provides a systematic source of measurement of predictive legal reasoning

**Limitations:** Outcome-prediction tasks can raise ethical concerns because automated systems may reproduce past biases in judicial decision-making.
### <a name="_pxh79nliiijk"></a>5.6 BharatBench

BharatBench is a recently proposed benchmark designed specifically to evaluate the performance of large language models on Indian knowledge tasks. The benchmark includes question-answering tasks spanning governance, geography, culture, and public policy. 

**Evaluation:** It uses multiple-choice and open-ended questions to assess the factual knowledge of Indian institutions and society among models.

**Example task:**  A model can be questioned on a factual question concerning an Indian public institution, a historical event, or a region.

**Use in prior research:** It has been proposed as a complementary benchmark for evaluating India-specific factual knowledge.

**Strengths:** BharatBench's focus on culturally relevant areas of knowledge and its use for evaluating factual knowledge from the perspective of local culture.

**Limitations:** The dataset is relatively small and still under development; as such, BharatBench does not offer the same level of statistical power as larger benchmarks such as MILU.
#### <a name="_xf6tqlv2xo0"></a>Experiment Design Implications

The IL-TUR benchmark provides a comprehensive suite for experimental evaluation of legal and institutional reasoning. It covers various legal reasoning tasks, such as statute retrieval, bail prediction, and legal explanation generation. NyayaAnumana is a valuable corpus for domain-specific pre-training, allowing models to learn legal reasoning patterns from a large collection of judicial documents. TathyaNyaya complements these resources by assessing end-to-end legal reasoning processes instead of just isolated sub-tasks.

Together, these datasets help researchers evaluate whether language models can accurately interpret Indian legal texts, reason about judicial decisions, and generate legally consistent explanations.



## <a name="_5nzuwl4td1la"></a>**6. Category 5: Datasets on Code-Switching and Informal Language**


Pipeline stage: Pre-training (L3Cube-HingCorpus); Supervised fine-tuning (PHINC, Hinglish-TOP); Evaluation (GLUECoS, LinCE).



Code-switching is not simply a deviation from standard or traditional use of language in India; it is one of the most common forms of digital communication amongst the hundreds of millions of urban and semi-urban Indians. Users usually combine English with Indic languages in social media, messaging applications, and voice assistants. Testing an Indic LLM on monolingual datasets can lead to overestimation of its performance in the real world. This section clarifies the significance of this problem and outlines the datasets that will be used to address it.  

The code-switching (CS) in India is not a random mixture of words; it follows discernible patterns:  

- Inter-sentential switching: alternate use of languages in between sentences.  
- ` `Intra-sentential switching:  mixing of multiple languages within one sentence.  
- Script mixing: simultaneous use of Devanagari and Roman script.  
- Borrowing: the usage of English words with Indic grammar and morphology.  

There are five widely used regional code-mixed varieties in India.: Hinglish (Hindi-English), Tanglish (Tamil-English), Benglish (Bengali-English), Kanglish (Kannada-English), and Manglish (Malayalam-English), with Hinglish being the only variety relatively well represented in current datasets,  whereas most of the other code-mixed languages remain under-resourced.

**Table 5. Overview of Code-Switching and Informal Language Datasets**

|**Dataset**|**Primary Use (Pipeline Stage)**|**Language Coverage**|**Task Types**|**Key Capability Evaluated**|**Key Strength**|**Key Limitation**|
| :-: | :-: | :-: | :-: | :-: | :-: | :-: |
|**L3Cube-HingCorpus**|Pre-training|Hindi–English (Hinglish)|Large-scale raw corpus|Learning code-mixed language patterns and informal usage|Very large-scale (1B+ tokens), real social media data|Dominated by Twitter + Hinglish (limited diversity)|
|**GLUECoS**|Evaluation|Hindi–English|LID, POS, NER, Sentiment, QA, NLI|General NLP understanding in code-switched text|Multi-task benchmark with standardized metrics|Limited to Hindi-English, somewhat outdated|
|**PHINC**|SFT / Evaluation|Hindi–English|Parallel text (normalization)|Semantic preservation in code-mixed → standard language|Parallel design enables training + evaluation|Small dataset, Hinglish-only|
|**Hinglish-TOP**|SFT / Evaluation|Hindi–English|Semantic parsing, intent detection|Task-oriented understanding of mixed-language queries|Real-world applicability (assistants/chatbots)|Narrow domain (task-oriented only)|
|**LinCE**|Evaluation|Multi-pair (incl. Hindi–English)|LID, POS, NER|Cross-lingual code-switching benchmarking|Centralized leaderboard, global comparability|Limited Indic coverage beyond Hindi-English|
|**Code-Switching Red-Teaming**|Diagnostic Evaluation|Mixed (mostly Hinglish)|Adversarial prompts|Robustness to ambiguous/adversarial mixed-language inputs|Reveals real-world failure modes|Small-scale, non-standardized|

### <a name="_ctqi322piyxa"></a>6.1 L3Cube‑HingCorpus  

L3Cube-HingCorpus is the largest publicly available pre-training Hinglish corpus, comprising approximately 1.04 billion tokens, with Twitter as the primary data source. The corpus comprises 52.93 billion tokens (sentences) collected on Twitter and is available in both Devanagari and Roman scripts, reflecting the mixed-script nature of real-world code-switched communication.

**Evaluation and Usage**: The dataset is primarily utilized for the pre-training of language models that are designed to effectively process code-mixed text, such as Hinglish. Models developed using this dataset, including HingBERT, HingRoBERTa, and HingGPT, have demonstrated enhanced performance on downstream Hinglish natural language processing tasks when compared to standard multilingual baselines like mBERT and XLM-R.

**Strengths:** The corpus includes a large collection of informal text from Twitter that accurately reflects real social media communication. By incorporating both Roman and Devanagari scripts, it enhances its applicability for modeling mixed-script languages.


**Limitations:** The dataset is mainly sourced from Twitter, which may lead to a bias towards the language used in social media. It predominantly features Hinglish written in Roman script, with less representation of Devanagari text. Additionally, the dataset does not adequately cover other code-mixed language varieties, such as Tamil-English or Kannada-English.
### <a name="_z7c4huu7i9op"></a>6.2 GLUECoS  


GLUECoS, introduced by Microsoft Research India at ACL 2020, is a multi-task benchmark designed to evaluate natural language processing (NLP) tasks on Hindi-English code-switched text. The benchmark includes six tasks: language identification (LID), part-of-speech tagging (POS), named entity recognition (NER), sentiment analysis, question answering, and natural language inference (NLI).

**Evaluation:** Every task undergoes a thorough evaluation using established NLP metrics, specifically the F1 score for tagging tasks and accuracy for classification tasks, ensuring that results are both reliable and meaningful.

**Strengths:** The multi-task design is used to provide an overview of code-switching language comprehension. The fact that the benchmark has continued since 2020 enables comparison of evaluations across successive systems. It includes a unique use of NLI in code-switched text.  

**Limitations:** The benchmark is limited to Hindi-English code-switching and may not reflect patterns observed in other code-mixed Indian languages. Furthermore, the benchmark was initially created for earlier NLP architectures and may not fully reflect the capabilities of contemporary large language models.

### <a name="_lfmp1pfems4f"></a>6.3 PHINC  

PHINC provides 13,738 parallel Hinglish‑English sentence pairs extracted from social media, annotated for semantic equivalence, enabling both training and evaluation of code‑mixed text normalization.  

**Evaluation:** It is used to determine whether the model preserves the semantic meaning of the original sentence during Hinglish-to-English translation.

**Strengths:** The parallel design also allows the simultaneous training and evaluation of semantic equivalence between code-mixed and standard language forms. Social-media provenance ensures that the dataset reflects realistic informal communication patterns.

**Limitations:** The dataset is relatively small compared to large-scale pre-training corpora and focuses exclusively on Hinglish, which limits its applicability to other code-mixed language varieties.



### <a name="_876hpgi46ks6"></a>6.4 Hinglish‑TOP  

Hinglish-TOP is a semantic parsing dataset on mixed-language queries. It contains 10,000 code-mixed Hindi-English instances of intent parsing, annotated with compositional semantic structures representing nested intentions and slot values. It focuses on task-oriented dialogue scenarios such as booking appointments or scheduling reminders.

**Evaluation**: Models are assessed based on their ability to accurately identify user intent and extract relevant slot values from code-mixed queries.

**Strengths:** The semantic parsing structure within the compositional framework supports deep intent understanding. The task-oriented design can be directly applied to voice assistants and the use of chatbots.

**Limitations:** The dataset mainly focuses on task-oriented dialogue and may not apply to broader conversational contexts.



### <a name="_djjs876bqw1v"></a>6.5 LinCE  

LinCE is a benchmark that consolidates several code‑switching evaluation tasks and provides a centralized leaderboard for model comparison. It consolidates the evaluation of code‑switching across four language pairs, including Hindi‑English, and offers a public leaderboard.  Tasks include language identification, POS tagging, and NER for multiple code‑switched language pairs.

**Evaluation:** Models are assessed using standard NLP metrics and compared via a centralized leaderboard that supports benchmarking across various systems.

**Strengths:** Global comparability is supported by the centralized leaderboard, whereas the integration of multiple language pairs promotes cross-pair insights.  

**Limitations:** While LinCE supports various global language pairs, its coverage of Indian code-mixed varieties, excluding Hindi-English, remains limited.


### <a name="_ihdhmhm7va7x"></a>6.7 Code-Switching Red-Teaming Dataset

**Evaluation:** It involves presenting models with complex Hinglish or mixed‑language queries and analysing whether they correctly interpret intent or generate erroneous responses due to language mixing. 

**Strengths:** Red‑teaming datasets expose failure modes that traditional benchmarks may not detect

**Limitations:** These datasets are usually small and are used not for large-scale benchmarking but for diagnostic testing. 
#### <a name="_bbckln2v91ht"></a>Experiment Design Implications

Because code-switching is pervasive in real-world user interactions in India, evaluation based solely on monolingual datasets may significantly overestimate model performance. GLUECoS offers a valuable benchmark for assessing fundamental NLP capabilities in code-mixed Hindi-English text. L3Cube-HingCorpus provides a comprehensive corpus for pre-training models aimed at Hinglish-speaking users. Hinglish-TOP facilitates the assessment of task-oriented dialogue understanding in mixed-language queries, which is especially pertinent for voice assistants and chatbots in use.

However, existing datasets primarily focus on Hindi-English code-switching. Code-mixed varieties involving South Indian languages remain significantly under-represented, representing an important gap in the current dataset ecosystem.

## <a name="_rrqc0mdqdoxg"></a>**7. Category 6 Pre-Training and Instruction-Tuning Corpora.**  
Pipeline stage: Pre-training, supervised fine-tuning (SFT), and preference alignment (DPO/RLHF).

These datasets are not held-out evaluation benchmarks; rather, they serve as training corpora for building and aligning Indic large language models. Accurate interpretation of evaluation results is not possible without a thorough understanding of their composition and limitations, because a model's performance on cultural benchmarks partially reflects the cultural integrity of its pre-trained data. Understanding the composition of these datasets is essential because model performance on evaluation benchmarks often reflects the culturally grounded knowledge contained in the training data.\


Sangraha (specifically SG‑Verified) should be employed as the recommended pre‑training corpus when building or continually pre‑training a model. For supervised fine‑tuning, combine IndicAlignInstruct (providing breadth across twenty languages and 74.7 million pairs) with Pragyaan (offering depth across ten languages with 22.5 K instructions and 100 K preference pairs). Upweight the Anudesh component of IndicAlign and all Pragyaan data relative to translated components to prioritise culturally authentic training signals over translated data. Such a combination enables models to acquire broad multilingual skills and culturally specific instruction-following behavior.

**Table 6. Pre-training and Instruction-Tuning Corpora for Indic LLMs**

|**Dataset**|**Type**|**Pipeline Stage**|**Languages**|**Key Role**|
| :-: | :-: | :-: | :-: | :-: |
|Sangraha|Pre-training corpus|Pre-training|22|Core training data|
|IndicAlign|Instruction dataset|SFT|20|Multilingual instructions|
|IndicAlign-Toxic|Safety dataset|RLHF/DPO|20|Safety alignment|
|Pragyaan|Instruction + preference|SFT + DPO|10|Cultural alignment|
|Samanantar|Parallel corpus|Pre-training|11|Translation|
|BPCC|Parallel corpus|Pre-training|22|Translation backbone|


### <a name="_g8c4ljlchz3s"></a>7.1 Sangraha (IndicLLMSuite) 

Sangraha constitutes the primary pre‑training corpus for the IndicLLMSuite. The corpus contains approximately 251 billion tokens in 22 scheduled languages of India, and was processed by the AI4Bharat Setu quality-filtering pipeline. It is partitioned into three components that reflect varying degrees of cultural authenticity: 

- SG‑Verified (highest authenticity) includes human‑curated web‑source text, high‑resolution OCR from scanned Indic‑language documents (books, magazines, government records), and transcripts of audio recordings; 
- SG‑Unverified (medium authenticity) consists of web‑crawled Common Crawl text subjected to perplexity‑based n‑gram language‑model filtering, providing a noisier yet voluminous dataset; 
- SG‑Synthetic (lowest cultural authenticity) derives from English Wikipedia and other English corpora translated into fourteen Indic languages via IndicTrans2, thereby carrying the cultural assumptions inherent in the source material. 

The three elements are characterized by the source of the information, the verification process used, and the possibility of cultural bias.

The categorical difference is essential to interpreting model knowledge: a model primarily trained on the SG-Synthetic data can still produce fluent Indic-language text.  However, it may still reproduce cultural assumptions present in the original English sources, thereby causing a minor disturbance that is often difficult to notice.

**Strengths:** Sangraha provides unprecedented scale, which is ten times larger than preceding Indic corpora, systematic quality filtering, and multilingual coverage across all scheduled languages. The cultural authenticity framework plays a significant role in assessing whether models truly internalize knowledge of Indian culture or merely translate it into English.

**Limitations:** Language imbalances are also evident, such as languages with high resources, such as Hindi, have tens of billions of tokens, whereas languages with low resources, such as Bodo, Santali, Dogri, Kashmiri, and Manipuri, have less than one billion tokens, which is insufficient for effective pretraining. English cultural assumptions are present in the SG-Synthetic component, which may introduce bias. 



### <a name="_x21vifvg41dc"></a>7.2 IndicAlign 

Pipeline stage: Supervised fine-tuning (SFT).

IndicAlign is the primary instruction‑tuning dataset of the IndicLLMSuite, comprising 74.7 million prompt‑response pairs across twenty Indian languages. It was assembled through four distinct construction methodologies: 

1. ` `aggregation of existing English instruction‑tuning datasets; 
1. ` `translation of high‑quality English datasets (Alpaca, FLAN, Dolly) into fourteen Indic languages via IndicTrans2; 
1. generation of synthetic instruction‑response pairs from India‑centric Wikipedia articles; 
1. Anudesh, a crowdsourcing initiative wherein native speakers authored original prompts in their own languages. These methods combine translated data with the generation of native-language instruction.

Specifically, the Anudesh element is valuable because it is the only large-scale, natively written body of instruction in the Indic languages, thereby reducing artifacts introduced by translation from English.

\
**Strengths:** The dataset offers extensive multilingual coverage and facilitates instruction-following in various Indic languages. 

**Limitations:** A considerable portion of the dataset is sourced from translated English materials, which might affect cultural authenticity.

### <a name="_42n69yp80lvt"></a>7.3 IndicAlign‑Toxic

IndicAlign‑Toxic contains 123,000 safety‑focused prompt‑response pairs across twenty Indic languages, explicitly targeting Indian context‑specific harmful content categories such as casteist language, communal hate speech, politically directed misinformation, and culturally inappropriate content. 

**Strengths:** This dataset specifically addresses safety concerns relevant to Indian social contexts, which are often overlooked in Western safety datasets. Western safety datasets, such as HH -RLHF or PKU-SafeRLHF, do not include these categories. The dataset is relevant because it is the first resource for Indian-specific safety alignment. 

**Limitations:** The dataset is relatively small in comparison to large-scale instruction datasets and is still undergoing development in terms of coverage.


### <a name="_ysnlouoywhvi"></a>7.4 Airavata and IndicInstruct 

Airavata is one of the earliest publicly released Hindi-tuned large language models, built on LLaMA‑2 and trained on IndicInstruct. IndicInstruct merges translated English instruction datasets (Alpaca, Dolly, OpenAssistant) with Hindi‑specific augmentation. 

**Strengths:** Offers early empirical evidence that tuning instruction for specific languages enhances performance. It is important because it determined the first systematic measure of the English-Hindi performance gap: fine-tuned Hindi models outperformed zero-shot English models by 5-15 percent on 

**Limitations:** The dataset primarily focuses on Hindi and is heavily reliant on translated instruction data.
### <a name="_blssjjbvp4vp"></a>7.5 Pragyaan 

Pragyaan includes 22,500 instruction‑tuning pairs (Pragyaan‑IT) and 100,000 preference‑alignment examples (Pragyaan‑Align) across ten Indic languages, structured across thirteen domains and fifty‑six sub‑categories. This data is the only dataset designed with an emphasis on preserving cultural nuance. The 100,000 preference pairs are explicitly labelled for cultural appropriateness, distinguishing between culturally grounded accepted responses and culturally generic rejected responses that often reflect Western defaults. Preference pairs allow training methods such as Direct Preference Optimization (DPO) to teach models whose responses are culturally appropriate.

**Strengths:** The dataset's clear emphasis on cultural appropriateness makes it especially valuable for ensuring cultural alignment. Consequently, Pragyaan‑Align is particularly suitable for DPO‑style cultural alignment training.

**Limitations:** Coverage is restricted to 10 Indic languages, and the overall dataset size is smaller than that of large-scale instruction corpora.

### <a name="_8675ffqjhcmk"></a>7.6 Samanantar and IndicTrans2/BPCC

Samanantar comprises 49.7 million parallel sentence pairs spanning eleven Indic languages and English, sourced from governmental websites, legal documents, religious texts, and crowdsourced platforms, and represents the largest publicly available Indic‑English parallel corpus. 

IndicTrans2 and the Bharat Parallel Corpus Collection (BPCC) extend translation coverage to all twenty‑two scheduled Indian languages, containing approximately 230 million parallel sentence pairs. IndicTrans2 and BPCC  extend coverage to all twenty‑two scheduled Indian languages (bidirectional with English) through the Bharat Parallel Corpus Collection, which contains 230 million sentence pairs. IndicTrans2 achieves state‑of‑the‑art machine translation across all twenty‑two languages and serves as the translation backbone for synthesising multilingual datasets throughout the IndicLLMSuite. 

These datasets are widely used for training machine translation systems and for generating multilingual synthetic data.

**Strengths:** Extensive parallel data allows for high-quality machine translation among Indic languages. 

**Limitations:** Parallel corpora may introduce translation artifacts and fail to fully capture culturally relevant language use.
#### <a name="_fz3yq2msg6ea"></a>Experiment Design Implications

For model development, Sangraha (specifically SG‑Verified) should be employed as the recommended pre‑training corpus when building or continually pre‑training a model. For supervised fine‑tuning, combine IndicAlignInstruct (providing breadth across twenty languages and 74.7 million pairs) with Pragyaan (offering depth across ten languages with 22.5 K instructions and 100 K preference pairs). Upweight the Anudesh component of IndicAlign and all Pragyaan data relative to translated components to prioritise culturally authentic training signals over translated data. Such a combination enables models to acquire broad multilingual skills and culturally specific instruction-following behavior.

## <a name="_5xdqxtzkr3w"></a>8. Gaps in the Indic Dataset Ecosystem
While significant progress has been made in developing datasets for Indic language processing, the current ecosystem still exhibits several important gaps when compared with the dataset landscape available for English-centric or Western-focused large language model evaluation. Many widely used evaluation datasets in LLM research were originally designed for English-language contexts and reflect Western cultural institutions, social structures, and knowledge domains. As a result, direct equivalents for these datasets are often missing or only partially developed in the Indic NLP ecosystem.

Identifying such gaps is important because they highlight areas requiring future dataset development to enable reliable evaluation of culturally aligned language models for India.

-----
### <a name="_w6glbu608rmq"></a>Table 7: Comparison Between Western LLM Benchmarks and Indic Equivalents

|**Western Benchmark**|**Purpose**|**Indic Equivalent**|**Gap Identified**|
| :-: | :-: | :-: | :-: |
|MMLU|Multidomain knowledge evaluation|MILU|Fewer languages, limited reasoning depth|
|BBQ|Social bias evaluation|BharatBBQ / limited datasets|Narrow coverage of caste and religion biases|
|TruthfulQA|Truthfulness and factual reliability|No direct equivalent|Lack of datasets testing misinformation in Indian contexts|
|Cultural Value Datasets|Cultural norms and values|SANSKRITI, Indica|Limited multilingual coverage|
|CommonsenseQA / SocialIQA|Social commonsense reasoning|CulturalBench India (partial)|Limited scale and coverage|
|Visual QA datasets (e.g., VQA, OK-VQA)|Multimodal reasoning|DRISHTIKON|Small dataset size|
|Multilingual QA benchmarks|Cross-language QA|IndicQA|Fewer languages and domains|
|Cross-cultural reasoning benchmarks|Cultural adaptation|DIWALI|Recently introduced, limited usage|

# <a name="_70cxqvnludv9"></a>**Key Observed Gaps**
### <a name="_3am5dz3gr5oj"></a>**1. Limited datasets for cultural value and social norm reasoning**
Western LLM evaluation often includes datasets that test **social norms, ethical reasoning, and cultural values**. While datasets such as SANSKRITI and Indica evaluate certain aspects of Indian cultural knowledge, large-scale datasets that explicitly test **cultural value reasoning across Indian communities remain limited**.

Given India's diversity across religion, caste, region, and linguistic communities, cultural alignment evaluation requires datasets that capture **multiple valid cultural perspectives rather than a single canonical answer**.

### <a name="_i28f3tpyq76w"></a>**2. Underdeveloped bias evaluation datasets for Indian social structures**
Bias evaluation in LLMs has received considerable attention in Western contexts, particularly regarding **race and gender bias**. However, equivalent datasets tailored to Indian social identities remain relatively scarce.

India’s social structure includes categories such as **caste, religion, regional identity, and linguistic affiliation**, which differ significantly from Western bias taxonomies. While emerging datasets such as BharatBBQ attempt to address this gap, comprehensive benchmarks for evaluating bias across these dimensions are still developing.

### <a name="_cul0448joqc9"></a>**3. Lack of datasets evaluating institutional and procedural knowledge**
Many real-world applications of LLMs involve answering questions related to **government procedures, legal frameworks, or public policy**. While datasets such as MILU partially capture institutional knowledge through examination questions, few datasets explicitly evaluate procedural reasoning related to Indian governance structures.

For example, tasks involving **public welfare schemes, property registration processes, taxation rules, or administrative procedures** remain underrepresented in existing benchmarks.

### <a name="_o26xi2okj2zi"></a>**4. Limited coverage of code-mixed language use**
A large proportion of digital communication in India involves **code-switching between English and Indic languages**, such as Hinglish or Tanglish. While IndicQA includes some code-mixed examples, large-scale evaluation datasets designed specifically to assess model performance on code-mixed inputs remain relatively limited.

As a result, models evaluated only on monolingual benchmarks may appear to perform well but may struggle with **real-world mixed-language communication**.

### <a name="_4r0to7feqqal"></a>**5. Small dataset sizes for cultural reasoning benchmarks**
Many culturally focused datasets, such as DIWALI, VIRAASAT, and CulturalBench India, remain relatively small compared to mainstream LLM benchmarks. Smaller datasets can limit statistical reliability and make it difficult to conduct large-scale comparative evaluations across models.

As the field of culturally aligned LLM research grows, scaling these datasets will be important for enabling **robust evaluation and reproducibility**.

# <a name="_6rr0g35tr35k"></a>**Implications for Future Dataset Development**
The analysis above suggests several priorities for future work in the Indic dataset ecosystem:

1. Development of **larger-scale cultural reasoning benchmarks** covering diverse regional and social contexts.
1. Expansion of **bias evaluation datasets** that account for caste, religion, and regional identities.
1. Creation of **institutional knowledge benchmarks** focused on governance, law, and public administration.
1. Increased focus on **code-mixed language evaluation** reflecting real-world language use.
1. Greater coverage of **multimodal cultural datasets**, including images, videos, and audio data representing Indian cultural practices.

Addressing these gaps will be critical for developing evaluation frameworks that accurately measure the cultural alignment of language models deployed in Indian contexts.