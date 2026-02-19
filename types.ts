
export interface HumanReview {
  id: string;
  reviewerName: string;
  content: string;
  rating: number;
  timestamp: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
}

export interface ProductFeedback {
  id?: string;
  creatorId?: string;
  timestamp?: number;
  category: string; // New: Product industry category
  overview: string;
  detailedDescription?: string;
  readinessScore: number;
  creatorName?: string;
  isPublic?: boolean;
  humanReviews?: HumanReview[];
  views?: number; // New: Social metric
  likes?: number; // New: Social metric
  techStack?: string[]; // New: Technical metadata
  metrics: {
    ux: number;
    security: number;
    performance: number;
    marketFit: number;
    innovation: number;
  };
  strengths: string[];
  vulnerabilities: {
    issue: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    description: string;
    solution: string;
    codeSnippet?: string;
  }[];
  suggestions: {
    category: string;
    action: string;
    benefit: string;
  }[];
  roadmap: string[];
  targetUsers: {
    persona: string;
    reason: string;
    reachOutStrategy: string;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  language: string;
  company?: string;
  following: string[];
  followersCount: number;
}

export interface AnalysisFile {
  data: string;
  mimeType: string;
  name: string;
}

export interface AnalysisInput {
  name: string;
  category: string;
  description: string;
  codeOrSpecs: string;
  files: AnalysisFile[];
  language?: string;
}
