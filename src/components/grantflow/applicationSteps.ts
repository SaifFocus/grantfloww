export interface ApplicationStep {
  id: string;
  title: string;
  question: string;
  hint: string;
  words: number;
}

export const APPLICATION_STEPS: ApplicationStep[] = [
  {
    id: "eligibility",
    title: "Eligibility",
    question: "How does your business meet this grant's eligibility criteria?",
    hint: "Address each eligibility bullet directly. Be specific about your legal structure, location, stage, and sector.",
    words: 120,
  },
  {
    id: "project",
    title: "Project description",
    question: "What is the project you'll fund with this grant?",
    hint: "Cover the problem, your solution, what's innovative, and your approach. Concrete, not vague.",
    words: 200,
  },
  {
    id: "impact",
    title: "Impact",
    question: "What measurable impact will this project create?",
    hint: "Include economic, social, or environmental outcomes. Use numbers where possible (jobs, users, revenue, CO2).",
    words: 160,
  },
  {
    id: "budget",
    title: "Budget & timeline",
    question: "How will the funds be used and over what timeline?",
    hint: "Break the budget into 3-5 categories. Outline a realistic timeline with key milestones.",
    words: 160,
  },
  {
    id: "review",
    title: "Review & export",
    question: "",
    hint: "",
    words: 0,
  },
];
