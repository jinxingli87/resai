import type { Localized } from "@/lib/i18n";

export type IoaiTask = {
  slug: string;
  title: Localized;
  day?: 1 | 2;
  timeLimit?: string;
  topics: Localized<string[]>;
  summary: Localized;
  url: string;
  /** Statement files live in src/content/ioai/<year>/<slug>.{en,zh}.md when present. */
  hasStatement?: boolean;
};

export type IoaiYear = {
  year: number;
  edition: Localized;
  host: Localized;
  dates: Localized;
  facts: Localized;
  repo: string;
  license: string;
  showStatements: boolean;
  tasks: IoaiTask[];
  extra?: Localized;
};

const R26 = "https://github.com/IOAI-official/IOAI-2026/tree/main/Individual-Contest";
const R25 = "https://github.com/IOAI-official/IOAI-2025/blob/main/Individual-Contest";
const R24 = "https://github.com/IOAI-official/IOAI-2024/tree/main/On-Site-Round";

export const ioaiYears: IoaiYear[] = [
  {
    year: 2026,
    edition: { en: "3rd IOAI", zh: "第三届 IOAI" },
    host: { en: "Astana, Kazakhstan", zh: "哈萨克斯坦·阿斯塔纳" },
    dates: { en: "2026", zh: "2026 年" },
    facts: {
      en: "462 contestants from 103 delegations, with an at-home round and two on-site days of three tasks each. Every task ran on one GPU (≈16 GB VRAM) with no internet access.",
      zh: "来自 103 个代表队的 462 名选手参赛，包括居家赛和两天现场赛（每天三道题）。每道题均在单块 GPU（约 16 GB 显存）、无网络的环境下完成。",
    },
    repo: "https://github.com/IOAI-official/IOAI-2026",
    license: "CC BY 4.0",
    showStatements: true,
    tasks: [
      {
        slug: "find-the-order",
        title: { en: "Find the Order", zh: "找回顺序" },
        day: 1,
        timeLimit: "10 min",
        topics: { en: ["Speech", "Sequence ordering"], zh: ["语音", "序列排序"] },
        summary: {
          en: "Spoken English dialogues are split into one audio clip per speaker turn and shuffled. Reconstruct the original turn order.",
          zh: "英语对话被按发言轮次切分为音频片段并打乱顺序，要求还原对话的原始顺序。",
        },
        url: `${R26}/1_Find_the_Order`,
        hasStatement: true,
      },
      {
        slug: "robot-chasing",
        title: { en: "Robot Chasing", zh: "机器人追逐" },
        day: 1,
        timeLimit: "5 min",
        topics: { en: ["Language grounding", "Gridworlds"], zh: ["语言落地", "网格世界"] },
        summary: {
          en: "Six robots in 6×6 rooms carry out English instructions, each with its own consistent habits. From a snapshot mid-task, predict the robot's next action.",
          zh: "六个机器人在 6×6 的房间中执行英文指令，每个机器人都有自己固定的行为习惯。根据任务中途的快照，预测机器人的下一步动作。",
        },
        url: `${R26}/2_Robot_Chasing`,
        hasStatement: true,
      },
      {
        slug: "potato",
        title: { en: "Potato", zh: "土豆" },
        day: 1,
        timeLimit: "10 min",
        topics: { en: ["Embeddings", "Search strategy"], zh: ["词嵌入", "搜索策略"] },
        summary: {
          en: "A word-guessing game: find a hidden word within 30 turns using only pairwise \"which is semantically closer\" comparisons.",
          zh: "猜词游戏：仅通过两两比较“哪个词语义更接近”，在 30 轮内找到隐藏词。",
        },
        url: `${R26}/3_Potato`,
        hasStatement: true,
      },
      {
        slug: "double-agent-dilemma",
        title: { en: "Double Agent Dilemma", zh: "双面间谍困境" },
        day: 2,
        timeLimit: "12 min",
        topics: { en: ["CNN vs. ViT", "Adversarial examples"], zh: ["CNN 与 ViT", "对抗样本"] },
        summary: {
          en: "A ResNet-18 and a ViT-Tiny agree perfectly on every image. Make tiny, almost invisible pixel changes so the two models disagree.",
          zh: "ResNet-18 与 ViT-Tiny 对每张图像的判断完全一致。要求对图像施加几乎不可见的微小像素扰动，使两个模型给出不同的判断。",
        },
        url: `${R26}/4_Double_Agent_Dilemma`,
        hasStatement: true,
      },
      {
        slug: "ghost-of-the-machine",
        title: { en: "Ghost of the Machine", zh: "机器幽灵" },
        day: 2,
        timeLimit: "10 min",
        topics: { en: ["NLP", "Machine-text detection"], zh: ["自然语言处理", "机器文本检测"] },
        summary: {
          en: "Each passage starts as human writing and silently switches to a language-model continuation. Find where the switch happens, using only a text-embedding model.",
          zh: "每段文字开头由人类撰写，之后悄然切换为语言模型续写的内容。要求仅借助文本嵌入模型找出切换发生的位置。",
        },
        url: `${R26}/5_Ghost_of_Machine`,
        hasStatement: true,
      },
      {
        slug: "ioai-field",
        title: { en: "IOAI Field", zh: "IOAI 场" },
        day: 2,
        timeLimit: "5 min",
        topics: { en: ["Generative models", "Training from scratch"], zh: ["生成模型", "从零训练"] },
        summary: {
          en: "Model the IOAI logo as a spatial function and train a generator from scratch, with no pretrained weights.",
          zh: "将 IOAI 标志建模为空间函数，并在不使用预训练权重的情况下从零训练生成器。",
        },
        url: `${R26}/6_IOAI_Field`,
        hasStatement: true,
      },
    ],
  },
  {
    year: 2025,
    edition: { en: "2nd IOAI", zh: "第二届 IOAI" },
    host: { en: "Beijing, China", zh: "中国·北京" },
    dates: { en: "August 2–9, 2025", zh: "2025 年 8 月 2–9 日" },
    facts: {
      en: "Hosted by Beijing National Day School under the patronage of UNESCO. An individual contest (at-home round plus two on-site days), the \"Future Factory\" robotics team challenge, and the GAITE track.",
      zh: "由北京市十一学校承办，在联合国教科文组织支持下举办。包括个人赛（居家赛加两天现场赛）、“未来工厂”机器人团队挑战赛以及 GAITE 赛道。",
    },
    repo: "https://github.com/IOAI-official/IOAI-2025",
    license: "CC BY 4.0",
    showStatements: false,
    tasks: [
      {
        slug: "radar",
        title: { en: "Radar", zh: "雷达" },
        topics: { en: ["Signal processing", "Deep learning"], zh: ["信号处理", "深度学习"] },
        summary: {
          en: "Analyze noisy radar returns, cluttered by reflections from background objects, to detect and locate targets.",
          zh: "分析受背景物体反射干扰的含噪雷达回波信号，从中检测并定位目标。",
        },
        url: `${R25}/Radar/Radar.ipynb`,
      },
      {
        slug: "chicken-counting",
        title: { en: "Chicken Counting", zh: "数鸡" },
        topics: { en: ["Computer vision", "Counting"], zh: ["计算机视觉", "计数"] },
        summary: {
          en: "Build an accurate automated counter for free-range Silkie chickens, so farmers and insurers can track livestock losses.",
          zh: "为散养乌鸡构建精准的自动计数系统，帮助养殖户和保险公司统计牲畜损失。",
        },
        url: `${R25}/Chicken_Counting/Chicken_Counting.ipynb`,
      },
      {
        slug: "concepts",
        title: { en: "Concepts", zh: "概念" },
        topics: { en: ["LLMs", "NLP"], zh: ["大语言模型", "自然语言处理"] },
        summary: {
          en: "Play the guessing game Concepts: decode a secret word or phrase from an ordered sequence of visual icons, with an LLM available through a proxy.",
          zh: "玩“Concepts”猜词游戏：根据一串有序的视觉图标推断秘密词语，可通过代理调用大语言模型。",
        },
        url: `${R25}/Concepts/Concepts.ipynb`,
      },
      {
        slug: "restroom",
        title: { en: "Restroom Icon Matching", zh: "洗手间图标匹配" },
        topics: { en: ["Computer vision", "Matching"], zh: ["计算机视觉", "匹配"] },
        summary: {
          en: "Given a cropped male or female restroom icon, find its cross-gender counterpart from the same restroom.",
          zh: "给定一个裁剪出的男/女洗手间图标，找到来自同一洗手间的异性对应图标。",
        },
        url: `${R25}/Restroom/Restroom.ipynb`,
      },
      {
        slug: "antique",
        title: { en: "Antique Painting Authentication", zh: "古画鉴定" },
        topics: { en: ["Semi-supervised learning", "Classification"], zh: ["半监督学习", "分类"] },
        summary: {
          en: "Classify antique paintings as authentic or replica when only a small fraction carry labels, using the unlabeled samples too.",
          zh: "仅有少量样本带有真伪标签，要求同时利用无标签样本，将古画分类为真迹或仿品。",
        },
        url: `${R25}/Antique/Antique.ipynb`,
      },
      {
        slug: "pixel",
        title: { en: "Pixel Efficiency", zh: "像素效率" },
        topics: { en: ["Computer vision", "Interpretability"], zh: ["计算机视觉", "可解释性"] },
        summary: {
          en: "Camera traps in the wild have tiny bandwidth. Identify the most critical pixels in each wildlife photo so only essential information is sent.",
          zh: "野外相机陷阱的网络带宽极其有限。要求找出每张野生动物照片中最关键的像素，只传输必要的视觉信息。",
        },
        url: `${R25}/Pixel/Pixel.ipynb`,
      },
    ],
    extra: {
      en: "Each task in the official repository has a notebook statement and a reference solution.",
      zh: "官方仓库中每道题都附有 Notebook 形式的题面和参考解答。",
    },
  },
  {
    year: 2024,
    edition: { en: "1st IOAI", zh: "第一届 IOAI" },
    host: { en: "Burgas, Bulgaria", zh: "保加利亚·布尔加斯" },
    dates: { en: "August 9–15, 2024", zh: "2024 年 8 月 9–15 日" },
    facts: {
      en: "The inaugural olympiad: nearly 200 students in 41 teams from 32 countries and territories. A scientific round (a month-long take-home stage plus an 8-hour on-site stage) and a practical team challenge using AI image and video generation.",
      zh: "首届赛事：来自 32 个国家和地区、41 支队伍的近 200 名学生参赛。包括科学轮（为期一个月的居家赛加 8 小时现场赛）和使用 AI 图像与视频生成工具的团队实践赛。",
    },
    repo: "https://github.com/IOAI-official/IOAI-2024",
    license: "CC BY 4.0",
    showStatements: false,
    tasks: [
      {
        slug: "help-bobai",
        title: { en: "Help BOBAI", zh: "帮帮 BOBAI" },
        topics: { en: ["NLP", "Classification"], zh: ["自然语言处理", "分类"] },
        summary: {
          en: "Extend a deployed text classifier for an unknown language to new classes.",
          zh: "为一种未知语言的已部署文本分类器扩展新的类别。",
        },
        url: `${R24}/Help_BOBAI`,
      },
      {
        slug: "lost-in-hyperspace",
        title: { en: "Lost in Hyperspace", zh: "迷失超空间" },
        topics: { en: ["Regression", "High-dimensional data"], zh: ["回归", "高维数据"] },
        summary: {
          en: "A regression challenge on the mysterious \"Glowing Hypercubes\", high-dimensional objects with hidden structure.",
          zh: "围绕神秘“发光超立方体”的回归挑战，这些高维对象蕴含隐藏结构。",
        },
        url: `${R24}/Lost_in_Hyperspace`,
      },
      {
        slug: "madarian-cow",
        title: { en: "The Madarian Cow Mystery", zh: "马达里亚奶牛之谜" },
        topics: { en: ["Generative AI", "Computer vision"], zh: ["生成式 AI", "计算机视觉"] },
        summary: {
          en: "A follow-up to adapting an image-generation model to the quirks of the fictional Madarian language.",
          zh: "延续此前为虚构的马达里亚语调整图像生成模型的故事，解开新的谜题。",
        },
        url: `${R24}/Madarian_Cow`,
      },
    ],
  },
];

export const IOAI_SITE = "https://ioai-official.org";
export const IOAI_RESOURCES = "https://ioai-official.org/resources/";

export function getIoaiYear(year: string | number) {
  return ioaiYears.find((y) => String(y.year) === String(year));
}
