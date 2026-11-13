import type { Localized } from "@/lib/i18n";

export type ResearchArea = {
  key: string;
  icon: "telescope" | "rocket" | "stethoscope" | "dna" | "globe" | "users" | "scale" | "heart";
  title: Localized;
  description: Localized;
  ideas: Localized<string[]>;
};

export const scienceAreas: ResearchArea[] = [
  {
    key: "astrophysics",
    icon: "telescope",
    title: { en: "Astrophysics", zh: "天体物理" },
    description: {
      en: "Telescopes produce more data than people can inspect. Machine learning helps find the rare and the new.",
      zh: "望远镜产生的数据远超人工所能检查的范围，机器学习帮助我们发现罕见与全新的天体现象。",
    },
    ideas: {
      en: ["Classify galaxy morphologies from survey images", "Detect exoplanet transits in stellar light curves", "Find anomalies in time-domain sky surveys"],
      zh: ["根据巡天图像对星系形态分类", "在恒星光变曲线中探测系外行星凌星", "在时域巡天数据中寻找异常天体"],
    },
  },
  {
    key: "space",
    icon: "rocket",
    title: { en: "Space science", zh: "空间科学" },
    description: {
      en: "Satellites monitor the Sun and near-Earth space around the clock. AI turns those measurements into forecasts.",
      zh: "卫星全天候监测太阳和近地空间环境，人工智能把这些观测数据转化为预报。",
    },
    ideas: {
      en: ["Forecast geomagnetic storms from solar-wind data", "Predict solar flares from solar images", "Detect events in spacecraft particle and field data"],
      zh: ["利用太阳风数据预报地磁暴", "根据太阳图像预测太阳耀斑", "在航天器粒子与场数据中识别空间事件"],
    },
  },
  {
    key: "medical",
    icon: "stethoscope",
    title: { en: "Medical research", zh: "医学研究" },
    description: {
      en: "From medical images to health records, AI supports earlier detection and better understanding of disease.",
      zh: "从医学影像到健康记录，人工智能助力疾病的早期发现和深入理解。",
    },
    ideas: {
      en: ["Segment structures in public medical-imaging datasets", "Study model fairness across patient groups", "Predict outcomes from de-identified clinical data"],
      zh: ["在公开医学影像数据集上进行结构分割", "研究模型在不同患者群体间的公平性", "基于去标识化临床数据预测治疗结果"],
    },
  },
  {
    key: "biology",
    icon: "dna",
    title: { en: "Biology", zh: "生物学" },
    description: {
      en: "Proteins, genes, and cells are rich, structured data, and some of AI's most exciting scientific results come from here.",
      zh: "蛋白质、基因和细胞都是丰富的结构化数据，人工智能一些最激动人心的科学成果正来自这一领域。",
    },
    ideas: {
      en: ["Analyze gene-expression data to find cell types", "Explore protein structure predictions", "Classify microscopy images of cells"],
      zh: ["分析基因表达数据以识别细胞类型", "探索蛋白质结构预测", "对细胞显微图像进行分类"],
    },
  },
  {
    key: "earth",
    icon: "globe",
    title: { en: "Earth and climate", zh: "地球与气候" },
    description: {
      en: "Weather, climate, and environmental data are global, long-running, and public, ideal for student research.",
      zh: "气象、气候与环境数据覆盖全球、时间跨度长且公开可用，非常适合学生开展研究。",
    },
    ideas: {
      en: ["Downscale weather forecasts with neural networks", "Map wildfire risk from satellite imagery", "Model air quality from sensor networks"],
      zh: ["用神经网络对天气预报进行降尺度", "基于卫星图像绘制山火风险图", "利用传感器网络数据建模空气质量"],
    },
  },
];

export const humanityAreas: ResearchArea[] = [
  {
    key: "social",
    icon: "users",
    title: { en: "Social science", zh: "社会科学" },
    description: {
      en: "AI gives new ways to study how people communicate, learn, and make decisions, at a scale surveys can't reach.",
      zh: "人工智能为研究人们如何交流、学习与决策提供了新方法，其规模是传统问卷难以企及的。",
    },
    ideas: {
      en: ["Measure trends in public discourse with language models", "Study how students use AI for learning", "Analyze public datasets on education or economics"],
      zh: ["用语言模型衡量公共讨论的趋势", "研究学生如何使用 AI 辅助学习", "分析教育或经济领域的公开数据集"],
    },
  },
  {
    key: "ethics",
    icon: "scale",
    title: { en: "AI ethics and alignment", zh: "AI 伦理与对齐" },
    description: {
      en: "As AI systems grow more capable, making them fair, honest, and aligned with human values becomes a research field of its own.",
      zh: "随着 AI 系统能力不断增强，如何让它们公平、诚实并与人类价值观对齐，已经成为一个独立的研究领域。",
    },
    ideas: {
      en: ["Audit a model for bias across groups", "Test how robust models are to adversarial inputs", "Evaluate how language models handle uncertainty and refusal"],
      zh: ["审查模型在不同群体间的偏差", "测试模型对对抗性输入的鲁棒性", "评估语言模型如何表达不确定性与拒答"],
    },
  },
  {
    key: "good",
    icon: "heart",
    title: { en: "AI for the public good", zh: "AI 公益应用" },
    description: {
      en: "Accessibility, misinformation, and public services are areas where careful AI work can help many people.",
      zh: "无障碍、虚假信息治理和公共服务等领域，严谨的 AI 研究能够惠及大量人群。",
    },
    ideas: {
      en: ["Build accessibility tools for people with disabilities", "Detect manipulated images or synthetic media", "Study misinformation spread on public data"],
      zh: ["为残障人士开发无障碍辅助工具", "检测篡改图像或合成媒体", "基于公开数据研究虚假信息的传播"],
    },
  },
];

export const researchSteps: { title: Localized; description: Localized }[] = [
  {
    title: { en: "Find a question", zh: "确定问题" },
    description: {
      en: "Explore areas that excite you and narrow down to a question that is new, focused, and feasible.",
      zh: "探索感兴趣的领域，聚焦到一个新颖、具体且可行的研究问题。",
    },
  },
  {
    title: { en: "Read the literature", zh: "文献调研" },
    description: {
      en: "Learn what's already known, how others have approached it, and where the open gaps are.",
      zh: "了解已有成果、前人的研究方法，以及尚未解决的空白。",
    },
  },
  {
    title: { en: "Run experiments", zh: "开展实验" },
    description: {
      en: "Collect or prepare data, build models, and test ideas with the rigor of real research.",
      zh: "收集或准备数据、构建模型，并以真正科研的严谨标准验证想法。",
    },
  },
  {
    title: { en: "Write and present", zh: "撰写与展示" },
    description: {
      en: "Turn results into a paper, poster, or talk, ready for science fairs and research competitions.",
      zh: "把成果整理成论文、海报或报告，用于科学竞赛和研究类比赛。",
    },
  },
];
