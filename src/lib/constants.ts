export const SITE_CONFIG = {
  name: "NexxVantage",
  tagline: "We Build Software That Scales",
  description:
    "Custom software & AI solutions engineered for performance, built for the future.",
  url: "https://nexxvantage.com",
  email: "hello@nexxvantage.com",
  location: "Remote-First",
  bookingUrl: "#",
  social: {
    linkedin: "https://linkedin.com/company/nexxvantage",
    twitter: "https://x.com/nexxvantage",
    github: "https://github.com/nexxvantage",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
] as const;

export const SERVICES = [
  {
    id: "custom-software",
    icon: "code" as const,
    title: "Custom Software Development",
    shortDescription:
      "Web apps, mobile apps, enterprise platforms — tailored to your business.",
    fullDescription:
      "We design and build custom software solutions from the ground up. Whether you need a web application, mobile app, or enterprise platform, we deliver scalable, maintainable software tailored to your specific needs.",
    keyPoints: [
      "Full-stack development",
      "Scalable architecture",
      "Agile delivery",
    ],
  },
  {
    id: "ai-ml",
    icon: "brain" as const,
    title: "AI & Machine Learning Solutions",
    shortDescription:
      "Intelligent automation, predictive systems, AI-powered products.",
    fullDescription:
      "Leverage the power of artificial intelligence to transform your business. From custom AI models to LLM integration, we build intelligent systems that automate processes and unlock new capabilities.",
    keyPoints: [
      "Custom AI models",
      "NLP & computer vision",
      "LLM integration",
    ],
  },
  {
    id: "cloud",
    icon: "cloud" as const,
    title: "Cloud & Scalable Architecture",
    shortDescription:
      "Cloud-native infrastructure built to grow with you.",
    fullDescription:
      "Build on a foundation that scales. We architect and deploy cloud-native solutions using modern infrastructure practices, ensuring your platform performs reliably as you grow.",
    keyPoints: [
      "AWS / GCP / Azure",
      "Microservices & CI/CD",
      "DevOps automation",
    ],
  },
  {
    id: "ui-ux",
    icon: "palette" as const,
    title: "UI/UX Design",
    shortDescription:
      "Premium interfaces that users love.",
    fullDescription:
      "Great software deserves great design. We craft intuitive, visually stunning interfaces grounded in user research and modern design principles, ensuring every interaction feels seamless.",
    keyPoints: [
      "Design systems",
      "Prototyping & testing",
      "Responsive design",
    ],
  },
] as const;

export type ServiceIcon = (typeof SERVICES)[number]["icon"];

export const VALUE_PROPS = [
  {
    title: "Future-Ready Tech",
    description:
      "We build with the latest technologies and forward-thinking architecture, so your software stays ahead of the curve.",
  },
  {
    title: "Scalable Architecture",
    description:
      "Every solution is engineered to grow with your business — from MVP to enterprise scale.",
  },
  {
    title: "Client-First Approach",
    description:
      "Your vision drives our work. We collaborate closely to deliver exactly what you need, on time.",
  },
  {
    title: "AI-Powered Innovation",
    description:
      "We integrate cutting-edge AI capabilities to give your products a competitive edge.",
  },
] as const;

export const BUDGET_OPTIONS = [
  { value: "", label: "Select a range (optional)" },
  { value: "5k-15k", label: "$5k – $15k" },
  { value: "15k-50k", label: "$15k – $50k" },
  { value: "50k+", label: "$50k+" },
  { value: "discuss", label: "Let's discuss" },
] as const;

export const SERVICE_OPTIONS = [
  { value: "", label: "Select a service" },
  { value: "custom-software", label: "Custom Software Development" },
  { value: "ai-ml", label: "AI & Machine Learning Solutions" },
  { value: "cloud", label: "Cloud & Scalable Architecture" },
  { value: "ui-ux", label: "UI/UX Design" },
  { value: "not-sure", label: "Not sure yet" },
] as const;
