import type { GeneratorInput, GeneratedPlan } from "./types";

const titleCase = (s: string) =>
  s.replace(/\b\w/g, (c) => c.toUpperCase());

const deriveName = (idea: string, type: string) => {
  const words = idea
    .replace(/[^a-zA-Z\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !["want", "start", "from", "into", "with", "that", "this", "have", "need"].includes(w.toLowerCase()))
    .slice(0, 2);
  if (words.length === 0) return type ? `${titleCase(type)} Venture` : "NewVenture";
  return titleCase(words.join("")) + (type === "Tech product" ? "Labs" : "Co");
};

export function generatePlan(input: GeneratorInput): GeneratedPlan {
  const { idea, businessType, market, fundingGoal, needs, stage } = input;
  const ideaShort = idea.trim().split(/\s+/).slice(0, 18).join(" ");
  const m = market || "your target market";
  const fg = fundingGoal || "your funding goal";
  const bt = businessType || "venture";
  const name = deriveName(idea, businessType);

  const roadmapsByStage: Record<string, { when: string; what: string }[]> = {
    "Idea only": [
      { when: "Week 1", what: `Validate idea with 10 conversations in ${m}` },
      { when: "Week 2", what: "Define core offer, pricing, and brand voice" },
      { when: "Week 3", what: "Build a simple landing page and collect signups" },
      { when: "Week 4", what: "Prepare legal documents and grant materials" },
      { when: "Month 2", what: `Submit first application targeting ${fg}` },
      { when: "Month 3", what: "Launch MVP and onboard first users" },
    ],
    "Researching": [
      { when: "Week 1", what: `Finalize competitor and pricing research in ${m}` },
      { when: "Week 2", what: "Lock in positioning, brand, and core offer" },
      { when: "Week 3", what: "Draft grant application and financial projections" },
      { when: "Week 4", what: `Submit application targeting ${fg}` },
      { when: "Month 2", what: "Build MVP and recruit 5 pilot customers" },
      { when: "Month 3", what: "Iterate based on pilot feedback and scale outreach" },
    ],
    "Already started": [
      { when: "Week 1", what: "Audit current operations and identify bottlenecks" },
      { when: "Week 2", what: `Package traction metrics for ${m} stakeholders` },
      { when: "Week 3", what: `Prepare grant application targeting ${fg}` },
      { when: "Week 4", what: "Submit application and pitch 3 strategic partners" },
      { when: "Month 2", what: "Hire or contract first key role" },
      { when: "Month 3", what: "Scale customer acquisition and refine pricing" },
    ],
    "Need funding": [
      { when: "Week 1", what: `Shortlist 5 grants and investors active in ${m}` },
      { when: "Week 2", what: "Polish pitch deck and one-page executive summary" },
      { when: "Week 3", what: `Submit primary grant application for ${fg}` },
      { when: "Week 4", what: "Run 5 investor / partner conversations" },
      { when: "Month 2", what: "Negotiate terms and secure first commitment" },
      { when: "Month 3", what: "Deploy capital into growth and hiring" },
    ],
    "Ready to launch": [
      { when: "Week 1", what: "Finalize launch assets, pricing, and onboarding flow" },
      { when: "Week 2", what: `Run pre-launch campaign in ${m}` },
      { when: "Week 3", what: "Public launch and PR push" },
      { when: "Week 4", what: `Submit growth-stage application for ${fg}` },
      { when: "Month 2", what: "Optimize conversion and double down on best channel" },
      { when: "Month 3", what: "Expand to adjacent segment or geography" },
    ],
  };

  const milestonesByStage: Record<string, { label: string; progress: number }[]> = {
    "Idea only":        [{label:"Validate business idea",progress:20},{label:"Prepare funding application",progress:10},{label:"Build brand identity",progress:15},{label:"Contact partners",progress:5},{label:"Submit first application",progress:0}],
    "Researching":      [{label:"Validate business idea",progress:55},{label:"Prepare funding application",progress:30},{label:"Build brand identity",progress:35},{label:"Contact partners",progress:25},{label:"Submit first application",progress:15}],
    "Already started":  [{label:"Validate business idea",progress:80},{label:"Prepare funding application",progress:50},{label:"Build brand identity",progress:65},{label:"Contact partners",progress:60},{label:"Submit first application",progress:35}],
    "Need funding":     [{label:"Validate business idea",progress:75},{label:"Prepare funding application",progress:85},{label:"Build brand identity",progress:60},{label:"Contact partners",progress:55},{label:"Submit first application",progress:70}],
    "Ready to launch":  [{label:"Validate business idea",progress:95},{label:"Prepare funding application",progress:80},{label:"Build brand identity",progress:90},{label:"Contact partners",progress:75},{label:"Submit first application",progress:85}],
  };

  const stageKey = stage && roadmapsByStage[stage] ? stage : "Idea only";
  const roadmap = roadmapsByStage[stageKey];
  const milestones = milestonesByStage[stageKey].map((mi) => {
    let p = mi.progress;
    if (mi.label === "Prepare funding application" && needs.includes("Grant application")) p = Math.min(100, p + 15);
    if (mi.label === "Build brand identity" && needs.includes("Marketing")) p = Math.min(100, p + 15);
    return { ...mi, progress: p };
  });

  return {
    concept: {
      name,
      summary: `${name} is a ${bt.toLowerCase()} focused on ${ideaShort.toLowerCase() || "delivering meaningful value"}, designed to operate across ${m} with a lean, scalable model.`,
      audience: `Early adopters and underserved customers in ${m} who currently lack a streamlined option.`,
      revenue: businessType === "Non-profit"
        ? "Grants, sponsorships, and impact-based funding."
        : businessType === "E-commerce"
          ? "Direct sales, subscriptions, and partnership revenue."
          : "Service fees, recurring contracts, and tiered pricing.",
      uvp: `A trusted, end-to-end experience for ${m} — combining local expertise with a modern, transparent process.`,
    },
    grant: {
      title: `${name}: Building accessible ${bt.toLowerCase()} solutions for ${m}`,
      problem: `Founders and customers in ${m} face fragmented options, language barriers, and unclear processes when pursuing ${ideaShort.toLowerCase() || "this opportunity"}.`,
      solution: `${name} provides a structured, technology-enabled ${bt.toLowerCase()} that simplifies the journey and removes friction at every step.`,
      impact: `Supports local economic activity, creates jobs, and strengthens cross-border collaboration in ${m}.`,
      why: `Funding of ${fg} will cover initial setup, regulatory and legal preparation, branding, and the first months of operations.`,
      outcome: `Within 6 months: a validated MVP, first paying customers, and measurable proof of demand in ${m}.`,
    },
    roadmap: [
      { when: "Week 1", what: `Validate idea with 10 conversations in ${m}` },
      { when: "Week 2", what: "Define core offer, pricing, and brand voice" },
      { when: "Week 3", what: "Prepare legal documents and grant materials" },
      { when: "Week 4", what: `Submit application targeting ${fg}` },
      { when: "Month 2", what: "Launch MVP and onboard first users" },
      { when: "Month 3", what: "Start sales, partnerships, and iterate" },
    ],
    contracts: [
      "Supplier agreement",
      "Client agreement",
      "NDA (Non-disclosure agreement)",
      "Partnership agreement",
      "Terms & conditions",
      "Privacy policy",
    ],
    milestones: [
      { label: "Validate business idea", progress: stage === "Idea only" ? 20 : stage === "Researching" ? 45 : 70 },
      { label: "Prepare funding application", progress: needs.includes("Grant application") ? 60 : 30 },
      { label: "Build brand identity", progress: needs.includes("Marketing") ? 55 : 25 },
      { label: "Contact partners", progress: stage === "Already started" ? 65 : 20 },
      { label: "Submit first application", progress: stage === "Need funding" ? 80 : 35 },
    ],
  };
}
