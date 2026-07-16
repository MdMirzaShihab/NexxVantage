export const METHOD_PHASES = [
  {
    num: "01",
    name: "Consult",
    short: "Your goal, your problems, your plan — defined before a line is written.",
    deep: "Every engagement opens with a consultation session: we define the business goal, list the problems in the way, and understand how you plan to win. You leave with a written recommendation — a ranked problem map and a phase plan — whether or not we build it.",
    deliverable: "A written recommendation: ranked problems, phase plan, and an honest estimate.",
    layer: "ring",
  },
  {
    num: "02",
    name: "MVP",
    short: "The problems that matter most, solved first. Live, in production, earning.",
    deep: "We do not build everything you asked for in one shot. The MVP solves the highest-ranked problems only — the ones blocking revenue or operations — and ships to production where it starts earning its keep and teaching us what phase two should be.",
    deliverable: "A production system solving your most expensive problems, plus a measured baseline.",
    layer: "struts",
  },
  {
    num: "03",
    name: "Evolve",
    short: "Phases planned with your business team — features land when revenue says so.",
    deep: "After the MVP, we plan each phase with your business team against your revenue targets and calendar. A feature ships when the business is ready to use it — not when a backlog says so. Priorities will change; our process is built so change is cheap, not catastrophic.",
    deliverable: "A phase roadmap re-planned each cycle, with weekly reports and an open project board.",
    layer: "nodes",
  },
  {
    num: "04",
    name: "Scale",
    short: "Enterprise-grade hardening when enterprise arrives. Not a day sooner than useful.",
    deep: "When the numbers demand it, we harden: performance, security, infrastructure-as-code, monitoring, compliance. You pay for enterprise-grade when you are becoming an enterprise — not as an upfront tax on an unproven idea.",
    deliverable: "A hardened platform with CI/CD, monitoring, and documented operations.",
    layer: "core",
  },
] as const;

export const METHOD_PAGE = {
  hero: {
    overline: "The NexxVantage Method",
    heading: "We don't sell software. We assemble outcomes.",
    sub: "Most firms build what you ask for, in one shot, and hand you a sealed box. We build what your business needs, in the order it needs it — and show you every layer.",
  },
  consultation: {
    heading: "It starts with a consultation, not a quote",
    body: "Before we talk about technology, we map three things: the business goal you are chasing, the problems standing in the way, and how you plan to get there. From that map we draft the phase plan — which problems the MVP must solve, and what earns its place in each phase after. The session ends with a written recommendation that is yours to keep, whether or not we build it.",
  },
  change: {
    heading: "Change is cheap here",
    body: "Priorities will change — that is not a risk to our process, it is the reason our process exists. Because phases are planned against your business calendar and re-planned each cycle, changing direction costs a conversation, not a contract renegotiation. That is what agile means when it is practised rather than performed.",
  },
} as const;

export const METHOD_FAQ = [
  {
    q: "How long until the MVP is live?",
    a: "Typically 5–8 weeks from the consultation, depending on scope. The MVP is deliberately narrow: the highest-ranked problems only, live in production.",
  },
  {
    q: "How does pricing work per phase?",
    a: "Each phase is estimated and agreed before it starts, based on the phase plan from your consultation. You always know what the current phase costs and what the next is likely to — no open-ended retainers.",
  },
  {
    q: "What if we change direction mid-build?",
    a: "That is expected. Phases are re-planned with your business team each cycle, so direction changes are absorbed at the next phase boundary — a conversation, not a crisis.",
  },
  {
    q: "Who owns the code?",
    a: "You do. Full repository access from day one, and everything we build for you is yours — code, designs, documentation, infrastructure definitions.",
  },
  {
    q: "How do you report progress?",
    a: "Weekly written reports plus live access to the project board. You see what we see, always.",
  },
  {
    q: "Do you work with existing in-house teams?",
    a: "Yes. We slot in as the senior delivery partner — architecture, build, and mentoring — and hand over cleanly when your team is ready to own it.",
  },
] as const;
