export interface LifecycleStage {
  name: string;
  kg: number;
  description: string;
}

export interface SDGTarget {
  goalNumber: number;
  targets: string[];
  explanation: string;
}

export interface RScore {
  score: number; // 0-10
  reason: string;
}

export interface SixRs {
  score: number; // 0-100
  refuse: RScore;
  reduce: RScore;
  reuse: RScore;
  repair: RScore;
  repurpose: RScore;
  recycle: RScore;
}

export interface PillarScore {
  score: number; // 0-10
  reason: string;
}

export interface ThreePillars {
  score: number; // 0-100
  environmental: PillarScore;
  social: PillarScore;
  economic: PillarScore;
}

export interface Improvement {
  target: string;
  reason: string;
  impact: string; // e.g., "\u2193 ~30% carbon footprint"
}

export interface Citation {
  id: number;
  title: string;
  url: string;
  snippet?: string;
}

export interface CarbonFootprint {
  score: number; // 0-100
  totalKg: number;
  stages: LifecycleStage[];
  uncertaintyRange?: string; // e.g., "\u00b120%"
}

export interface SDGs {
  score: number; // 0-100
  supported: SDGTarget[];
}

export interface SustainabilityAnalysis {
  overallScore: number;
  verdict: string;
  comparativeAnalysis?: string;
  carbon: CarbonFootprint;
  sdgs: SDGs;
  sixRs: SixRs;
  threePillars: ThreePillars;
  improvements: Improvement[];
  citations: Citation[];
}

export interface ProductIdea {
  id: string; // UUID
  name: string;
  description: string;
  category?: string;
  materials?: string;
  productionLocation?: string;
  targetMarket?: string;
  intendedLifespan?: string;
  distributionChannel?: string;
  
  // Populated after analysis
  analysis?: SustainabilityAnalysis;
  isLoading?: boolean;
  error?: string;
  createdAt: number;
}
