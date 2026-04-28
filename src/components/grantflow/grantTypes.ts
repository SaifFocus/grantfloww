export interface GrantResult {
  name: string;
  funder: string;
  amount: string;
  deadline: string;
  region: string;
  eligibility: string[];
  fitScore?: number;
  fitReason: string;
  sourceUrl: string;
}
