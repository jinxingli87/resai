export const SERVICES = [
  {
    id: "agentic-ai",
    name: "Agentic AI & Workflow Automation",
    tagline: "End-to-end autonomous business workflows",
    description:
      "We design and deploy comprehensive AI-driven workflows that operate with minimal human oversight — from data ingestion through decision-making to action execution.",
    features: [
      "Custom AI agent architecture & deployment",
      "Multi-agent orchestration systems",
      "Integration with your existing tech stack",
      "Continuous monitoring & optimization",
    ],
    type: "consulting" as const,
  },
  {
    id: "genai-integration",
    name: "Generative AI Integration",
    tagline: "Embed GenAI into every business function",
    description:
      "We embed large language models and generative AI into your specific business functions — transforming how your teams operate in customer service, marketing, legal, finance, and HR.",
    features: [
      "LLM-powered customer service & chatbots",
      "AI-assisted marketing content & campaigns",
      "Legal document analysis & summarization",
      "Finance reporting & anomaly detection",
    ],
    type: "consulting" as const,
  },
];

export const COURSES = [
  {
    id: "ml-fundamentals",
    slug: "ml-fundamentals",
    name: "Machine Learning Fundamentals",
    tagline: "Build strong ML foundations",
    description:
      "A hands-on course covering core ML concepts with Python and PyTorch — from linear models through CNNs, Transformers, and AI for scientific applications.",
    topics: ["Python & PyTorch", "MLP & CNN", "Transformers", "AI for Science"],
    level: "Beginner–Intermediate",
    duration: "8 weeks",
    price_cents: 149900,
    stripe_price_env: "STRIPE_PRICE_ML_FUNDAMENTALS",
  },
  {
    id: "llm-course",
    slug: "large-language-models",
    name: "Large Language Models",
    tagline: "Master the technology behind ChatGPT",
    description:
      "Deep-dive into transformer architecture, LLM training, fine-tuning techniques, RLHF, and production deployment of large language models.",
    topics: ["Transformers", "Pre-training & Fine-tuning", "RLHF", "Deployment"],
    level: "Intermediate–Advanced",
    duration: "10 weeks",
    price_cents: 199900,
    stripe_price_env: "STRIPE_PRICE_LLM",
  },
  {
    id: "computer-vision",
    slug: "computer-vision",
    name: "Computer Vision",
    tagline: "From pixels to understanding",
    description:
      "Explore convolutional networks, Vision Transformers, self-supervised learning, and vision-language models in a project-based curriculum.",
    topics: ["CNN & ViT", "Self-Supervised Learning", "Vision-Language Models", "Real-world Projects"],
    level: "Intermediate–Advanced",
    duration: "10 weeks",
    price_cents: 199900,
    stripe_price_env: "STRIPE_PRICE_CV",
  },
  {
    id: "ai-for-executives",
    slug: "ai-for-executives",
    name: "AI for Business Leaders",
    tagline: "Lead AI transformation without coding",
    description:
      "Designed for non-technical professionals and executives who need to understand AI capabilities, evaluate vendors, and drive organizational AI strategy.",
    topics: ["AI Landscape & Trends", "Evaluating AI Tools", "ROI & Risk", "Change Management"],
    level: "Non-technical",
    duration: "4 weeks",
    price_cents: 99900,
    stripe_price_env: "STRIPE_PRICE_AI_EXEC",
  },
];
