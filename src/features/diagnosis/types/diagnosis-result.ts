import type { AiProvider, CropId, DiagnosisAnswers } from "@/features/diagnosis/types/diagnosis";

export interface RankedCause { name: string; match: number; reason: string }
export interface DiagnosisEvidence { label: string; weight: number; detail: string }
export interface ActionPeriod { period: string; title: string; duration: string; items: string[] }
export interface DiagnosisResult {
  crop: CropId;
  title: string;
  summary: string;
  confidence: number;
  priority: "low" | "moderate" | "high";
  primaryCause: RankedCause;
  alternativeCauses: RankedCause[];
  immediateActions: string[];
  warningSigns: string[];
  evidence: DiagnosisEvidence[];
  limitations: string[];
  sources: string[];
  plan: ActionPeriod[];
  followUpDays: number;
  followUpChecks: string[];
  provider: AiProvider | "fallback";
  model: string;
  generatedAt: string;
}

export interface DiagnosisGenerationRequest { answers: DiagnosisAnswers; locale: string }
export interface DiagnosisGenerationResponse { content: string; provider: AiProvider; model: string }
