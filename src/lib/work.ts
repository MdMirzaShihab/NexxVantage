export type CaseStudy = {
  slug: string;
  client: string;       // anonymised where NDA
  sector: string;
  title: string;
  summary: string;
  problemQuote: string; // "the problem, in the client's words"
  firstBuild: string;   // what we built first, and why
  outcomes: { value: string; label: string }[];
  timeline: string;
  engagement: string;
  cover: { src: string; alt: string };
};

// PLACEHOLDER — replace with real client data before launch (all three entries).
// Outcome numbers are illustrative. Swapping real data must require editing only this file.
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "hospitality-booking-platform",
    client: "A boutique hotel group", // PLACEHOLDER — replace with real client data before launch
    sector: "Hospitality",
    title: "A booking platform that feels like a lobby",
    summary:
      "Direct-booking platform designed to carry the brand's in-person warmth online — and stop paying a third of revenue to OTA commissions.",
    problemQuote:
      "Guests loved us in person, but our website felt like a budget airline. Most bookings went through agencies that took a third of the revenue.", // PLACEHOLDER — replace with real client data before launch
    firstBuild:
      "Phase one was the booking flow alone — not the marketing site. The consultation showed commission leakage was the bleeding wound, so the MVP put a beautiful, brand-true direct booking path live in six weeks. The full site followed in phase two.",
    outcomes: [
      { value: "+38%", label: "direct bookings in the first quarter" }, // PLACEHOLDER — replace with real client data before launch
      { value: "6 weeks", label: "from consultation to live MVP" }, // PLACEHOLDER — replace with real client data before launch
    ],
    timeline: "6 weeks to MVP, 4 months total", // PLACEHOLDER — replace with real client data before launch
    engagement: "The Studio + Engineering House",
    cover: { src: "/work/hospitality-cover.webp", alt: "Booking platform interface over a midnight background" },
  },
  {
    slug: "legal-practice-erp",
    client: "A Dhaka-based law firm", // PLACEHOLDER — replace with real client data before launch
    sector: "Legal",
    title: "Practice ERP with accounting-verified logic",
    summary:
      "Case management, billing, and financial reporting unified in one system — with business logic designed by accounting professionals.",
    problemQuote:
      "Month-end close took nine days and three spreadsheets. Nobody trusted the numbers until the senior partner re-checked them by hand.", // PLACEHOLDER — replace with real client data before launch
    firstBuild:
      "Phase one replaced the billing and time-capture spreadsheets — the direct revenue path — while case management stayed in the old tools. Only after the numbers earned trust did phases two and three absorb cases and documents.",
    outcomes: [
      { value: "9 days → 2", label: "month-end close" }, // PLACEHOLDER — replace with real client data before launch
      { value: "100%", label: "of invoices reconciled without manual re-checks" }, // PLACEHOLDER — replace with real client data before launch
    ],
    timeline: "8 weeks to MVP, 7 months total", // PLACEHOLDER — replace with real client data before launch
    engagement: "The Engineering House",
    cover: { src: "/work/legal-erp-cover.webp", alt: "ERP dashboard showing billing and case views" },
  },
  {
    slug: "retail-flagship-site",
    client: "A premium retail brand", // PLACEHOLDER — replace with real client data before launch
    sector: "Retail",
    title: "A flagship site cut to the brand's cloth",
    summary:
      "A brand-first flagship website where every scroll, hover, and headline was tailored to the label's identity.",
    problemQuote:
      "Our products are premium. Our website looked like everyone else's Shopify theme. Customers noticed.", // PLACEHOLDER — replace with real client data before launch
    firstBuild:
      "The consultation ranked brand perception above catalogue size, so phase one shipped the brand experience — home, story, and hero products — while the long-tail catalogue followed in phase two.",
    outcomes: [
      { value: "×2.4", label: "session duration" }, // PLACEHOLDER — replace with real client data before launch
      { value: "+61%", label: "returning visitors" }, // PLACEHOLDER — replace with real client data before launch
    ],
    timeline: "5 weeks to launch, 3 months total", // PLACEHOLDER — replace with real client data before launch
    engagement: "The Studio",
    cover: { src: "/work/retail-cover.webp", alt: "Flagship retail site hero with gold typography" },
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export const WORK_PAGE = {
  overline: "Selected Work",
  heading: "Few projects. Full courses.",
  intro:
    "We take on a small number of engagements and give each one everything. Here is what that looks like when it ships.",
  breadcrumbLabel: "Work",
  brief: { engagement: "Engagement", timeline: "Timeline", sector: "Sector" },
  problemHeading: "The problem, in the client's words",
  firstBuildHeading: "What we built first, and why",
  outcomeHeading: "The outcome",
  cta: {
    heading: "Your sector next",
    sub: "Every engagement starts with a conversation, not a quote.",
    button: "Book a consultation",
  },
} as const;
