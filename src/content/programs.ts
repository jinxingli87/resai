import type { Localized } from "@/lib/i18n";

export type ProgramIcon = "code" | "sigma" | "brain" | "messages" | "eye" | "bot";

export const STAGES = ["core", "specialization"] as const;
export type Stage = (typeof STAGES)[number];

export type Program = {
  slug: string;
  icon: ProgramIcon;
  stage: Stage;
  shortTitle: Localized;
  title: Localized;
  tagline: Localized;
  overview: Localized;
  audience: Localized;
  prerequisites: Localized;
  modules: { title: Localized; topics: Localized<string[]> }[];
  outcomes: Localized<string[]>;
  projects?: { title: Localized; description: Localized; skills: Localized<string[]> }[];
};

export const programs: Program[] = [
  {
    slug: "coding",
    icon: "code",
    stage: "core",
    shortTitle: { en: "Coding (with AI)", zh: "编程（AI 辅助）" },
    title: { en: "Coding (with AI)", zh: "编程（AI 辅助）" },
    tagline: {
      en: "Python from the first line of code, then building real projects fast with AI as a coding partner.",
      zh: "从第一行 Python 代码开始，再与 AI 结对编程，快速做出真正可用的作品。",
    },
    overview: {
      en: "Students learn to think like programmers: breaking problems into steps, choosing the right data structure, and writing clean, testable Python, then analyzing real data with the tools researchers use every day. They then learn to work with AI coding assistants: describing what they want, reviewing and testing what the AI produces, and staying in control of quality. Students ship a working website and use AI to speed up a small research project.",
      zh: "学生将学会像程序员一样思考：把问题拆解成步骤、选择合适的数据结构，写出清晰、可测试的 Python 代码，并使用科研人员日常使用的工具分析真实数据。随后，学生将学会与 AI 编程助手协作：清楚描述需求、审查并测试 AI 生成的结果，始终把控质量。课程中学生将上线一个可用的网站，并用 AI 加速一个小型研究项目。",
    },
    audience: {
      en: "Students new to programming, or self-taught coders who want solid fundamentals and want to turn ideas into working projects quickly.",
      zh: "零基础的编程新手，或希望打牢基础、并把想法快速变成作品的自学者。",
    },
    prerequisites: { en: "None.", zh: "无。" },
    modules: [
      {
        title: { en: "Python fundamentals", zh: "Python 基础" },
        topics: {
          en: ["Variables, types, and expressions", "Control flow: conditions and loops", "Functions and modules", "Reading errors and debugging"],
          zh: ["变量、数据类型与表达式", "流程控制：条件与循环", "函数与模块", "读懂报错与调试"],
        },
      },
      {
        title: { en: "Fundamental data structures", zh: "基础数据结构" },
        topics: {
          en: ["Lists and list operations", "Maps (dictionaries) for fast lookup", "Sets and membership", "Choosing the right structure for a problem"],
          zh: ["列表及其操作", "映射（字典）与快速查找", "集合与成员判断", "为问题选择合适的数据结构"],
        },
      },
      {
        title: { en: "Data analysis and visualization", zh: "数据分析与可视化" },
        topics: {
          en: ["NumPy arrays and vectorized computation", "Pandas DataFrames: loading, cleaning, grouping", "Matplotlib charts that tell a clear story", "A mini data-analysis project"],
          zh: ["NumPy 数组与向量化计算", "Pandas DataFrame：读取、清洗与分组", "用 Matplotlib 绘制清晰的图表", "数据分析小项目"],
        },
      },
      {
        title: { en: "Building websites with AI", zh: "用 AI 搭建网站" },
        topics: {
          en: ["Prompting for code: specs, constraints, examples", "Reading and reviewing AI-generated code", "Iterating on design and features", "Deploying a site to the web"],
          zh: ["面向代码的提示词：需求、约束与示例", "阅读和审查 AI 生成的代码", "迭代设计与功能", "把网站部署上线"],
        },
      },
      {
        title: { en: "Doing research with AI", zh: "用 AI 做研究" },
        topics: {
          en: ["Finding and summarizing literature responsibly", "Using AI for data cleaning and analysis", "Verifying claims and avoiding hallucinations", "Academic integrity when using AI"],
          zh: ["负责任地检索与总结文献", "用 AI 清洗和分析数据", "核实结论，避免 AI 幻觉", "使用 AI 时的学术诚信"],
        },
      },
    ],
    outcomes: {
      en: ["Write and debug Python programs on your own", "Analyze a real dataset and present findings in charts", "Ship a personal website built with AI tools", "Use AI to accelerate a research workflow", "Judge when AI output is right, and when it isn't"],
      zh: ["独立编写并调试 Python 程序", "分析真实数据集并用图表呈现结论", "上线一个用 AI 工具搭建的个人网站", "用 AI 加速研究流程", "判断 AI 的输出何时可信、何时不可信"],
    },
  },
  {
    slug: "machine-learning",
    icon: "brain",
    stage: "core",
    shortTitle: { en: "Machine Learning", zh: "机器学习" },
    title: { en: "Machine Learning", zh: "机器学习" },
    tagline: {
      en: "How machines learn from data, built from first principles.",
      zh: "机器如何从数据中学习：从第一性原理出发。",
    },
    overview: {
      en: "Students implement the core algorithms of machine learning themselves before using libraries, so they understand what's happening inside. The course covers supervised and unsupervised learning and ends with neural networks, setting up the deep learning programs that follow.",
      zh: "学生先亲手实现机器学习的核心算法，再使用现成的库，从而真正理解模型内部发生了什么。课程涵盖监督学习与无监督学习，最后学习神经网络，为后续的深度学习课程打下基础。",
    },
    audience: {
      en: "Students with Python and math foundations who want a rigorous introduction to ML, including USAAIO candidates.",
      zh: "具备 Python 和数学基础、希望系统学习机器学习的学生，包括 USAAIO 备赛学生。",
    },
    prerequisites: { en: "Python coding and Mathematical Foundations for AI (or equivalent).", zh: "Python 编程与 AI 数学基础（或同等水平）。" },
    modules: [
      {
        title: { en: "Supervised learning", zh: "监督学习" },
        topics: {
          en: ["Linear regression and least squares", "Logistic regression for classification", "Loss functions, overfitting, and regularization", "Train/validation/test splits and evaluation"],
          zh: ["线性回归与最小二乘", "用于分类的逻辑回归", "损失函数、过拟合与正则化", "训练/验证/测试集划分与模型评估"],
        },
      },
      {
        title: { en: "Unsupervised learning", zh: "无监督学习" },
        topics: {
          en: ["K-means clustering", "Principal component analysis (PCA)", "Visualizing high-dimensional data"],
          zh: ["K-means 聚类", "主成分分析（PCA）", "高维数据可视化"],
        },
      },
      {
        title: { en: "Neural networks", zh: "神经网络" },
        topics: {
          en: ["The multilayer perceptron", "Backpropagation", "Training with PyTorch", "Activation functions and initialization"],
          zh: ["多层感知机", "反向传播", "使用 PyTorch 训练模型", "激活函数与参数初始化"],
        },
      },
    ],
    outcomes: {
      en: ["Implement regression, classification, and clustering from scratch", "Train and evaluate a neural network in PyTorch", "Diagnose overfitting and fix it"],
      zh: ["从零实现回归、分类和聚类算法", "用 PyTorch 训练并评估神经网络", "诊断并解决过拟合问题"],
    },
  },
  {
    slug: "math-for-ai",
    icon: "sigma",
    stage: "core",
    shortTitle: { en: "Math Foundations for AI", zh: "AI 数学基础" },
    title: { en: "Mathematical Foundations for AI", zh: "人工智能的数学基础" },
    tagline: {
      en: "The calculus, linear algebra, and probability behind every model.",
      zh: "每个模型背后的微积分、线性代数与概率统计。",
    },
    overview: {
      en: "Modern AI is built on three pillars of mathematics. Students learn each one with an eye on how it's used: derivatives for training, matrices for data and neural networks, and probability for uncertainty. Every concept is paired with a short coding exercise.",
      zh: "现代人工智能建立在三大数学支柱之上。学生在学习每一部分时都会关注它的实际用途：导数用于模型训练，矩阵用于表示数据和神经网络，概率用于刻画不确定性。每个概念都配有简短的编程练习。",
    },
    audience: {
      en: "Students preparing for machine learning, deep learning, or AI olympiads such as USAAIO.",
      zh: "准备学习机器学习、深度学习，或备战 USAAIO 等 AI 奥赛的学生。",
    },
    prerequisites: { en: "Algebra II.", zh: "代数二（Algebra II）。" },
    modules: [
      {
        title: { en: "Calculus", zh: "微积分" },
        topics: {
          en: ["Derivatives and the chain rule", "Integrals and areas", "Partial derivatives and gradients", "Gradient descent, from intuition to code"],
          zh: ["导数与链式法则", "积分与面积", "偏导数与梯度", "梯度下降：从直觉到代码"],
        },
      },
      {
        title: { en: "Linear algebra", zh: "线性代数" },
        topics: {
          en: ["Vectors and inner products", "Matrix multiplication", "Linear transformations", "Eigenvectors and why PCA works"],
          zh: ["向量与内积", "矩阵乘法", "线性变换", "特征向量，以及 PCA 为何有效"],
        },
      },
      {
        title: { en: "Probability and statistics", zh: "概率与统计" },
        topics: {
          en: ["Random variables, mean, and variance", "The Gaussian distribution", "Conditional probability and Bayes' rule", "Estimation and maximum likelihood"],
          zh: ["随机变量、均值与方差", "高斯分布", "条件概率与贝叶斯公式", "参数估计与最大似然"],
        },
      },
    ],
    outcomes: {
      en: ["Compute gradients by hand and in code", "Read the matrix notation used in ML papers", "Reason about uncertainty with probability"],
      zh: ["手算并编程计算梯度", "读懂机器学习论文中的矩阵符号", "用概率思维分析不确定性"],
    },
  },
  {
    slug: "llms",
    icon: "messages",
    stage: "specialization",
    shortTitle: { en: "Large Language Models", zh: "大语言模型" },
    title: { en: "Large Language Models (LLMs)", zh: "大语言模型（LLM）" },
    tagline: {
      en: "From recurrent networks to Transformers to the agents built on them.",
      zh: "从循环神经网络到 Transformer，再到基于它们构建的智能体。",
    },
    overview: {
      en: "Students trace the ideas that led to today's language models: sequence modeling with RNNs and LSTMs, the attention mechanism, and the Transformer. They build a small Transformer themselves, then learn how large models are trained, prompted, and turned into agents.",
      zh: "学生将沿着通往当今语言模型的思想脉络学习：用 RNN 和 LSTM 进行序列建模、注意力机制以及 Transformer。学生会亲手实现一个小型 Transformer，然后学习大模型如何训练、如何提示，以及如何构建成智能体。",
    },
    audience: {
      en: "Students who have completed machine learning and want to understand the technology behind ChatGPT-style systems.",
      zh: "已学完机器学习、想深入理解 ChatGPT 类系统背后技术的学生。",
    },
    prerequisites: { en: "Machine Learning.", zh: "机器学习。" },
    modules: [
      {
        title: { en: "Sequence models", zh: "序列模型" },
        topics: {
          en: ["Word embeddings", "Recurrent neural networks (RNNs)", "Long short-term memory (LSTM)", "Vanishing gradients"],
          zh: ["词向量", "循环神经网络（RNN）", "长短期记忆网络（LSTM）", "梯度消失问题"],
        },
      },
      {
        title: { en: "The Transformer", zh: "Transformer" },
        topics: {
          en: ["Self-attention, step by step", "Multi-head attention and positional encoding", "Building a mini Transformer in PyTorch", "Efficient attention variants"],
          zh: ["自注意力机制详解", "多头注意力与位置编码", "用 PyTorch 实现迷你 Transformer", "高效注意力变体"],
        },
      },
      {
        title: { en: "LLMs and agents", zh: "大语言模型与智能体" },
        topics: {
          en: ["Pretraining, fine-tuning, and alignment", "Prompting and retrieval-augmented generation", "Tool use and LLM agents", "Evaluating LLM systems"],
          zh: ["预训练、微调与对齐", "提示工程与检索增强生成（RAG）", "工具调用与 LLM 智能体", "评估 LLM 系统"],
        },
      },
    ],
    outcomes: {
      en: ["Explain and implement self-attention", "Train a small language model", "Build an LLM application with tools and retrieval"],
      zh: ["讲清楚并实现自注意力机制", "训练一个小型语言模型", "构建带工具调用和检索功能的 LLM 应用"],
    },
  },
  {
    slug: "computer-vision",
    icon: "eye",
    stage: "specialization",
    shortTitle: { en: "Computer Vision", zh: "计算机视觉" },
    title: { en: "Computer Vision", zh: "计算机视觉" },
    tagline: {
      en: "Teach machines to see, from CNNs to diffusion models and vision-language models.",
      zh: "让机器学会看：从 CNN 到扩散模型与视觉语言模型。",
    },
    overview: {
      en: "Students learn how computers understand and generate images. Starting with convolutional networks, they move to Vision Transformers, self-supervised learning, and diffusion models, and finish with multimodal models that connect images and language.",
      zh: "学生将学习计算机如何理解和生成图像。从卷积神经网络出发，进而学习 Vision Transformer、自监督学习和扩散模型，最后学习连接图像与语言的多模态模型。",
    },
    audience: {
      en: "Students who have completed machine learning and are curious about image recognition and generative AI.",
      zh: "已学完机器学习、对图像识别和生成式 AI 感兴趣的学生。",
    },
    prerequisites: { en: "Machine Learning.", zh: "机器学习。" },
    modules: [
      {
        title: { en: "Convolutional neural networks (CNNs)", zh: "卷积神经网络（CNN）" },
        topics: {
          en: ["Convolutions, pooling, and feature maps", "Classic architectures: LeNet to ResNet", "Transfer learning", "What CNN layers learn"],
          zh: ["卷积、池化与特征图", "经典网络结构：从 LeNet 到 ResNet", "迁移学习", "CNN 各层学到了什么"],
        },
      },
      {
        title: { en: "Vision Transformers (ViT)", zh: "Vision Transformer（ViT）" },
        topics: {
          en: ["Images as sequences of patches", "ViT vs. CNN: inductive biases", "Training and fine-tuning ViTs"],
          zh: ["把图像看作图块序列", "ViT 与 CNN：归纳偏置的差异", "ViT 的训练与微调"],
        },
      },
      {
        title: { en: "Self-supervised learning", zh: "自监督学习" },
        topics: {
          en: ["Learning without labels", "Masked autoencoders (MAE)", "Contrastive learning"],
          zh: ["无标签学习", "掩码自编码器（MAE）", "对比学习"],
        },
      },
      {
        title: { en: "Diffusion models", zh: "扩散模型" },
        topics: {
          en: ["The forward and reverse processes", "Deriving the training objective", "Sampling and guidance"],
          zh: ["前向过程与反向过程", "推导训练目标", "采样与引导"],
        },
      },
      {
        title: { en: "Multimodality and VLMs", zh: "多模态与视觉语言模型（VLM）" },
        topics: {
          en: ["Connecting images and text (CLIP)", "Vision-language models", "Applications and limitations"],
          zh: ["连接图像与文本（CLIP）", "视觉语言模型", "应用与局限"],
        },
      },
    ],
    outcomes: {
      en: ["Train and analyze CNNs and ViTs", "Derive and implement a simple diffusion model", "Use vision-language models in a project"],
      zh: ["训练并分析 CNN 与 ViT", "推导并实现一个简单的扩散模型", "在项目中使用视觉语言模型"],
    },
  },
  {
    slug: "ai-agents",
    icon: "bot",
    stage: "specialization",
    shortTitle: { en: "AI Agents", zh: "AI 智能体" },
    title: { en: "AI Agents", zh: "AI 智能体" },
    tagline: {
      en: "Project-based: design and build AI agents that do real work.",
      zh: "项目制学习：设计并构建能完成真实任务的 AI 智能体。",
    },
    overview: {
      en: "An agent is an AI system that plans, uses tools, and takes actions toward a goal. In this project-based program, students build complete agents end to end: defining the task, connecting tools and data, handling failures, and evaluating results. Each student completes one or more of the projects below.",
      zh: "智能体是一种能够规划、调用工具并采取行动来完成目标的 AI 系统。在这门项目制课程中，学生将端到端地构建完整的智能体：定义任务、接入工具与数据、处理失败情况并评估效果。每位学生完成下列项目中的一个或多个。",
    },
    audience: {
      en: "Students who can program in Python and want to build practical AI applications.",
      zh: "会用 Python 编程、希望构建实用 AI 应用的学生。",
    },
    prerequisites: { en: "Coding (with AI). Large Language Models recommended.", zh: "编程（AI 辅助）。建议先修大语言模型课程。" },
    modules: [
      {
        title: { en: "Agent foundations", zh: "智能体基础" },
        topics: {
          en: ["How LLM agents plan and act", "Tool calling and APIs", "Memory and retrieval", "Safety, privacy, and evaluation"],
          zh: ["LLM 智能体如何规划与行动", "工具调用与 API", "记忆与检索", "安全、隐私与评估"],
        },
      },
    ],
    outcomes: {
      en: ["Design an agent around a clear goal", "Connect agents to tools, data, and APIs", "Evaluate and improve agent reliability"],
      zh: ["围绕明确目标设计智能体", "让智能体接入工具、数据和 API", "评估并提升智能体的可靠性"],
    },
    projects: [
      {
        title: { en: "AI Study Tutor", zh: "AI 学习辅导员" },
        description: {
          en: "A tutor that explains concepts, generates practice questions, and adapts to what the student gets wrong.",
          zh: "能讲解概念、生成练习题，并根据学生的错误调整教学的辅导助手。",
        },
        skills: { en: ["Prompt design", "Retrieval", "Adaptive feedback"], zh: ["提示词设计", "检索", "自适应反馈"] },
      },
      {
        title: { en: "Literature Research Agent", zh: "文献调研智能体" },
        description: {
          en: "An agent that searches papers on a topic, summarizes key findings, and builds an annotated reading list.",
          zh: "围绕某个主题检索论文、总结关键发现，并整理带注释的阅读清单。",
        },
        skills: { en: ["Search APIs", "Summarization", "Citation checking"], zh: ["检索 API", "文本摘要", "引用核查"] },
      },
      {
        title: { en: "AI Research Assistant", zh: "AI 科研助理" },
        description: {
          en: "An assistant that helps run a small study: cleaning data, running analyses, and drafting a results section.",
          zh: "协助完成小型研究的助理：清洗数据、运行分析，并起草结果部分。",
        },
        skills: { en: ["Code execution", "Data analysis", "Report generation"], zh: ["代码执行", "数据分析", "报告生成"] },
      },
      {
        title: { en: "Personal Finance Agent", zh: "个人理财智能体" },
        description: {
          en: "An agent that categorizes spending, tracks budgets, and explains financial concepts in plain language.",
          zh: "能对支出分类、跟踪预算，并用通俗语言解释金融概念的智能体。",
        },
        skills: { en: ["Structured data", "Tool calling", "Privacy by design"], zh: ["结构化数据", "工具调用", "隐私保护设计"] },
      },
      {
        title: { en: "AI Environment Monitoring Agent", zh: "AI 环境监测智能体" },
        description: {
          en: "An agent that pulls public air-quality or weather data, detects unusual patterns, and writes alerts.",
          zh: "获取公开的空气质量或气象数据，识别异常模式并生成预警。",
        },
        skills: { en: ["Public data APIs", "Anomaly detection", "Scheduling"], zh: ["公开数据 API", "异常检测", "定时任务"] },
      },
    ],
  },
];

export function getProgram(slug: string) {
  return programs.find((p) => p.slug === slug);
}
