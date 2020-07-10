export interface Server {
  name: string;
  port: number;
  paths: string[];
  remoteUrls: string[];
  location: string;
  gdprTracingBaseConfiguration: GdprTracingBaseConfiguration;
}

export interface GdprTracingBaseConfiguration {
  baseTTL: number;
  baseLegalBasis: string;
  baseLegitimateInterest: string;
  baseAutomatedDecisionMaking: boolean;
  basePurpose: string;
}
