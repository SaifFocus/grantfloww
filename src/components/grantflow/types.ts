export interface GeneratorInput {
  idea: string;
  businessType: string;
  market: string;
  fundingGoal: string;
  needs: string[];
  stage: string;
}

export interface GeneratedPlan {
  concept: {
    name: string;
    summary: string;
    audience: string;
    revenue: string;
    uvp: string;
  };
  grant: {
    title: string;
    problem: string;
    solution: string;
    impact: string;
    why: string;
    outcome: string;
  };
  roadmap: { when: string; what: string }[];
  contracts: string[];
  milestones: { label: string; progress: number }[];
}
