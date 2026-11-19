import type { Localized } from "@/lib/i18n";

export type Problem = {
  number: number;
  title: Localized;
  points: number;
  kind?: "open-ended" | "non-open-ended";
  topics: Localized<string[]>;
  summary: Localized;
};

export type ProblemSet = {
  slug: string;
  year: number;
  round: Localized;
  date?: string; // ISO date
  pdf?: string; // official PDF, copied under public/usaaio/problems
  officialUrl: string;
  intro: Localized;
  problems: Problem[];
  /** Official solutions are included and shown behind a "Show solution" toggle. */
  hasSolutions?: boolean;
  rationale?: { slug: string; pdf: string; officialUrl: string };
};

const OFFICIAL = "https://www.usaaio.org/attachments/past-problems/2026";

export const PAST_PROBLEMS_URL = "https://www.usaaio.org/usa-na-aio/past-problems";
const FORUM_2025_R1 = "https://forum.beaver-edge.ai/c/ai-olympiads/usa-north-america-ai-olympiad/8";
const FORUM_2025_R2 = "https://forum.beaver-edge.ai/c/ai-olympiads/2025-usa-na-aio-round-2/9";

export const DATASETS_URL = "https://huggingface.co/usaaio-official";

const rationale = {
  slug: "2026-round2-rationale",
  pdf: "/usaaio/problems/usaaio-2026-round2-rationale.pdf",
  officialUrl: `${OFFICIAL}/usaaio-2026-round-2-design-and-rationale.pdf`,
};

export const problemSets: ProblemSet[] = [
  {
    slug: "2026-round1",
    year: 2026,
    round: { en: "Round 1", zh: "第一轮" },
    date: "2026-01-30",
    pdf: "/usaaio/problems/usaaio-2026-round1.pdf",
    officialUrl: `${OFFICIAL}/usaaio-2026-round-1-problems.pdf`,
    intro: {
      en: "Nine problems mixing multiple-choice concept questions, short derivations, and Colab coding tasks across the Round 1 syllabus: math foundations, classical ML, PyTorch, NLP embeddings, and CNNs.",
      zh: "共九道题，覆盖第一轮考纲：数学基础、经典机器学习、PyTorch、NLP 词向量与 CNN，题型包括概念选择题、简短推导和 Colab 编程题。",
    },
    problems: [
      {
        number: 1,
        title: { en: "Machine learning concepts", zh: "机器学习概念" },
        points: 50,
        topics: { en: ["Supervised vs. unsupervised", "Regularization", "Bias–variance"], zh: ["监督与无监督学习", "正则化", "偏差–方差"] },
        summary: {
          en: "Multiple-choice questions on core ML ideas, such as identifying unsupervised tasks, comparing L1 and L2 regularization, and how bias and variance change with model complexity.",
          zh: "关于机器学习核心概念的选择题，例如识别无监督学习任务、比较 L1 与 L2 正则化，以及偏差与方差如何随模型复杂度变化。",
        },
      },
      {
        number: 2,
        title: { en: "Principal components and projections", zh: "主成分与投影" },
        points: 15,
        topics: { en: ["PCA", "Linear algebra"], zh: ["PCA", "线性代数"] },
        summary: {
          en: "Normalize a direction vector into a unit principal component and compute projections of data points onto it.",
          zh: "将方向向量归一化为单位主成分，并计算数据点在其上的投影。",
        },
      },
      {
        number: 3,
        title: { en: "Matrices and rank-one decompositions", zh: "矩阵与秩一分解" },
        points: 10,
        topics: { en: ["Linear maps", "Outer products"], zh: ["线性映射", "外积"] },
        summary: {
          en: "Recover a matrix from the linear map it defines, then write it as a sum of outer products.",
          zh: "根据线性映射还原矩阵，再将其写成若干外积之和。",
        },
      },
      {
        number: 4,
        title: { en: "Derivatives and gradients in NumPy", zh: "导数与梯度（NumPy 实现）" },
        points: 20,
        topics: { en: ["Calculus", "Gradient of MSE", "NumPy"], zh: ["微积分", "均方误差的梯度", "NumPy"] },
        summary: {
          en: "Differentiate tanh by hand, then implement the gradient of a mean-squared-error loss in NumPy under strict restrictions (no autograd, no linear-algebra helpers).",
          zh: "手动求 tanh 的导数，再在严格限制下（不可使用自动求导和线性代数函数）用 NumPy 实现均方误差损失的梯度。",
        },
      },
      {
        number: 5,
        title: { en: "Word embeddings", zh: "词向量" },
        points: 90,
        topics: { en: ["NLP", "GloVe", "Cosine similarity"], zh: ["自然语言处理", "GloVe", "余弦相似度"] },
        summary: {
          en: "Work with 100-dimensional GloVe embeddings on a provided text: similarity, analogies, and analysis of token vectors.",
          zh: "基于给定文本使用 100 维 GloVe 词向量：计算相似度、类比推理，并分析词向量的性质。",
        },
      },
      {
        number: 6,
        title: { en: "Reading CNN feature maps", zh: "解读 CNN 特征图" },
        points: 10,
        topics: { en: ["CNNs", "Interpretability"], zh: ["卷积神经网络", "可解释性"] },
        summary: {
          en: "Given shuffled feature maps from five layers of a pretrained CNN, decide which layer produced each one and explain why.",
          zh: "给出预训练 CNN 五个层输出的乱序特征图，判断每张特征图来自哪一层并说明理由。",
        },
      },
      {
        number: 7,
        title: { en: "Building modules in PyTorch", zh: "用 PyTorch 构建模块" },
        points: 30,
        topics: { en: ["PyTorch", "Initialization", "Activation functions"], zh: ["PyTorch", "参数初始化", "激活函数"] },
        summary: {
          en: "Implement custom threshold and linear modules, and derive the weight variance that keeps activations stable across layers.",
          zh: "实现自定义的阈值模块和线性模块，并推导使各层激活值方差保持稳定的权重方差。",
        },
      },
      {
        number: 8,
        title: { en: "Inside ResNet-50", zh: "剖析 ResNet-50" },
        points: 25,
        topics: { en: ["ResNet", "Parameter counting", "Tensor shapes"], zh: ["ResNet", "参数量计算", "张量形状"] },
        summary: {
          en: "Count learnable parameters and trace tensor shapes through a pretrained ResNet-50, partly without helper methods.",
          zh: "统计预训练 ResNet-50 的可学习参数量并追踪张量形状，部分小题不得使用辅助方法。",
        },
      },
      {
        number: 9,
        title: { en: "Tabular binary classification", zh: "表格数据二分类" },
        points: 50,
        topics: { en: ["Classification", "Feature engineering", "Model evaluation"], zh: ["分类", "特征工程", "模型评估"] },
        summary: {
          en: "Build a classifier for a 30-feature medical tabular dataset, scored on a hidden test set.",
          zh: "为含 30 个特征的医学表格数据集构建分类器，在隐藏测试集上评分。",
        },
      },
    ],
  },
  {
    slug: "2026-round2-day1",
    year: 2026,
    round: { en: "Round 2 · Day 1", zh: "第二轮 · 第一天" },
    date: "2026-04-04",
    pdf: "/usaaio/problems/usaaio-2026-round2-day1.pdf",
    officialUrl: `${OFFICIAL}/usaaio-2026-round-2-day-1-problems.pdf`,
    intro: {
      en: "Two long problems: a guided derivation-and-implementation problem on linear attention, and an open-ended scientific inverse problem.",
      zh: "两道大题：一道关于线性注意力的推导与实现引导题，一道开放式的科学反问题。",
    },
    problems: [
      {
        number: 1,
        title: { en: "Linear Attention Is All You Need", zh: "线性注意力就是你所需要的一切" },
        points: 90,
        kind: "non-open-ended",
        topics: { en: ["Transformers", "Linear attention", "Positional encoding"], zh: ["Transformer", "线性注意力", "位置编码"] },
        summary: {
          en: "Derive linear attention from standard softmax attention, analyze its complexity, add relative positional encoding, implement batched multi-head linear attention, and build a Transformer for time-series classification.",
          zh: "从标准 softmax 注意力推导线性注意力并分析其复杂度，加入相对位置编码，实现支持批处理的多头线性注意力，最终构建用于时间序列分类的 Transformer。",
        },
      },
      {
        number: 2,
        title: { en: "Recovering a single-source central field", zh: "还原单源中心力场" },
        points: 70,
        kind: "open-ended",
        topics: { en: ["Inverse problems", "AI for science", "Model design"], zh: ["反问题", "科学智能", "模型设计"] },
        summary: {
          en: "From discretized vector-field observations, infer where the source is and the unknown law relating field strength to distance, with a model that generalizes.",
          zh: "根据离散化的矢量场观测数据，推断场源位置以及场强与距离之间的未知规律，并构建具有泛化能力的模型。",
        },
      },
    ],
    rationale,
  },
  {
    slug: "2026-round2-day2",
    year: 2026,
    round: { en: "Round 2 · Day 2", zh: "第二轮 · 第二天" },
    date: "2026-04-05",
    pdf: "/usaaio/problems/usaaio-2026-round2-day2.pdf",
    officialUrl: `${OFFICIAL}/usaaio-2026-round-2-day-2-problems.pdf`,
    intro: {
      en: "One derivation problem on diffusion models and two open-ended modeling problems under realistic constraints.",
      zh: "一道扩散模型推导题，以及两道在现实约束下的开放式建模题。",
    },
    problems: [
      {
        number: 3,
        title: { en: "Diffusion models", zh: "扩散模型" },
        points: 50,
        kind: "non-open-ended",
        topics: { en: ["Generative AI", "Gaussian processes", "KL divergence"], zh: ["生成式 AI", "高斯分布", "KL 散度"] },
        summary: {
          en: "Derive the diffusion training objective from first principles: properties of the forward process, Bayes' rule for the reverse process, KL divergence, and the neural-network parameterization.",
          zh: "从第一性原理推导扩散模型的训练目标：前向过程的性质、用贝叶斯公式推导反向过程、KL 散度，以及神经网络参数化。",
        },
      },
      {
        number: 4,
        title: { en: "Classifying geometric shapes from RGB images", zh: "RGB 图像中的几何形状分类" },
        points: 40,
        kind: "open-ended",
        topics: { en: ["Semi-supervised learning", "CNNs", "Pseudo-labeling"], zh: ["半监督学习", "卷积神经网络", "伪标签"] },
        summary: {
          en: "Classify triangles, rectangles, and circles with only 20% of the data labeled, no validation set, and no pretrained models.",
          zh: "仅有 20% 的数据带标签、没有验证集且不得使用预训练模型的条件下，对三角形、矩形和圆形进行分类。",
        },
      },
      {
        number: 5,
        title: { en: "Mixed functions parameter regression", zh: "混合函数参数回归" },
        points: 50,
        kind: "open-ended",
        topics: { en: ["Latent-variable models", "Clustering", "Function fitting"], zh: ["隐变量模型", "聚类", "函数拟合"] },
        summary: {
          en: "Given 400 points drawn from four unknown function families (linear, logarithmic, exponential, sinusoidal), jointly recover which family each point belongs to and the parameters of each.",
          zh: "给定来自四类未知函数（线性、对数、指数、正弦）的 400 个数据点，同时判断每个点所属的函数类型并估计各函数的参数。",
        },
      },
    ],
    rationale,
  },
  {
    slug: "2025-round1",
    year: 2025,
    round: { en: "Round 1", zh: "第一轮" },
    officialUrl: FORUM_2025_R1,
    hasSolutions: true,
    intro: {
      en: "Three multi-part problems that build from hand derivations to working code: linear algebra on the Fibonacci sequence, neural-network fundamentals in NumPy and PyTorch, and logistic regression on the Titanic dataset.",
      zh: "三道多小问的大题，从手工推导逐步过渡到编程实现：用线性代数分析斐波那契数列、用 NumPy 和 PyTorch 实现神经网络基础，以及在 Titanic 数据集上实现逻辑回归。",
    },
    problems: [
      {
        number: 1,
        title: { en: "Fibonacci numbers and eigenvalues", zh: "斐波那契数与特征值" },
        points: 100,
        topics: { en: ["Linear algebra", "Eigendecomposition", "NumPy"], zh: ["线性代数", "特征分解", "NumPy"] },
        summary: {
          en: "Write the Fibonacci recurrence in matrix form, prove that eigenvectors of a symmetric matrix are orthogonal, derive a closed form through spectral decomposition, and implement it in NumPy without loops.",
          zh: "将斐波那契递推写成矩阵形式，证明对称矩阵的特征向量正交，利用谱分解推导通项公式，并在不使用循环的情况下用 NumPy 实现。",
        },
      },
      {
        number: 2,
        title: { en: "Neural network basics", zh: "神经网络基础" },
        points: 100,
        topics: { en: ["Linear layers", "Gradients", "PyTorch", "MLP"], zh: ["线性层", "梯度", "PyTorch", "多层感知机"] },
        summary: {
          en: "Compute gradients of a linear layer by hand, implement it in NumPy and PyTorch, count parameters and analyze rank, then build a ReLU module and an MLP and train it on a synthetic dataset.",
          zh: "手工计算线性层的梯度，分别用 NumPy 和 PyTorch 实现，统计参数量并分析矩阵的秩，再实现 ReLU 模块和 MLP，并在合成数据集上训练。",
        },
      },
      {
        number: 3,
        title: { en: "Titanic survival with logistic regression", zh: "用逻辑回归预测 Titanic 生还" },
        points: 100,
        topics: { en: ["pandas", "Data preprocessing", "Logistic regression", "Convexity"], zh: ["pandas", "数据预处理", "逻辑回归", "凸性"] },
        summary: {
          en: "Clean and encode the Titanic data with pandas, derive the gradient and Hessian of the log-likelihood and prove its concavity, then implement logistic regression trained by gradient descent and Newton's method.",
          zh: "用 pandas 清洗并编码 Titanic 数据，推导对数似然的梯度和 Hessian 矩阵并证明其凹性，再实现分别用梯度下降和牛顿法训练的逻辑回归。",
        },
      },
    ],
  },
  {
    slug: "2025-round2",
    year: 2025,
    round: { en: "Round 2", zh: "第二轮" },
    officialUrl: FORUM_2025_R2,
    hasSolutions: true,
    intro: {
      en: "Three long problems on modern deep learning, each mixing derivations with PyTorch implementation: physics-informed neural networks, multi-head attention and its efficient variants, and CLIP.",
      zh: "三道关于现代深度学习的长题，每道题都把推导与 PyTorch 实现结合起来：物理信息神经网络、多头注意力及其高效变体，以及 CLIP。",
    },
    problems: [
      {
        number: 1,
        title: { en: "Physics-informed neural networks", zh: "物理信息神经网络（PINN）" },
        points: 100,
        topics: { en: ["AI for science", "PDEs", "Autograd"], zh: ["科学智能", "偏微分方程", "自动求导"] },
        summary: {
          en: "Prove the analytical solution of a 1-D heat equation, then train a PINN whose loss combines PDE residual, initial-condition and boundary-condition terms, using torch.autograd.grad for derivatives and mini-batch training.",
          zh: "先证明一维热传导方程的解析解，再训练一个 PINN：损失由 PDE 残差、初始条件和边界条件三部分组成，用 torch.autograd.grad 求导并进行小批量训练。",
        },
      },
      {
        number: 2,
        title: { en: "Multi-head attention and its variants", zh: "多头注意力及其变体" },
        points: 100,
        topics: { en: ["Transformers", "GQA", "MLA", "KV cache"], zh: ["Transformer", "GQA", "MLA", "KV 缓存"] },
        summary: {
          en: "Work through the shapes and formulas of multi-head attention, implement MHA and grouped-query attention, relate GQA to DeepSeek's multi-head latent attention, and compare KV-cache sizes across the three.",
          zh: "梳理多头注意力的张量形状与公式，实现 MHA 与分组查询注意力（GQA），分析 GQA 与 DeepSeek 多头潜在注意力（MLA）的关系，并比较三者的 KV 缓存大小。",
        },
      },
      {
        number: 3,
        title: { en: "CLIP: contrastive language-image pre-training", zh: "CLIP：对比式语言-图像预训练" },
        points: 100,
        topics: { en: ["Multimodal AI", "Contrastive learning", "High-dimensional geometry"], zh: ["多模态 AI", "对比学习", "高维几何"] },
        summary: {
          en: "Preprocess paired images and captions, build and train a small CLIP model with a learnable temperature and contrastive loss, and prove that random high-dimensional vectors are nearly orthogonal to justify cosine similarity.",
          zh: "预处理成对的图像与文本，构建并训练一个带可学习温度参数和对比损失的小型 CLIP 模型，并证明高维随机向量近似正交，以说明使用余弦相似度的合理性。",
        },
      },
    ],
  },
];

export function getProblemSet(slug: string) {
  return problemSets.find((s) => s.slug === slug);
}

export const problemYears = [...new Set(problemSets.map((s) => s.year))].sort((a, b) => b - a);
