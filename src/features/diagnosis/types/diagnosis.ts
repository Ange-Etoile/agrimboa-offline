export type DiagnosisStep =
  | "crop"
  | "part"
  | "symptoms"
  | "yellowing"
  | "description"
  | "dynamic";

export type CropId = "maize" | "cassava" | "tomato" | "plantain";
export type DiagnosisAnswerType = "single_choice" | "multiple_choice" | "free_text" | "number" | "boolean";
export type DynamicAnswer = string | string[];
export type AiProvider = "groq" | "local";
export type DynamicQuestionOrigin = "ai" | "fallback";

export interface DiagnosisAnswers {
  crop: CropId | null;
  parts: string[];
  symptoms: string[];
  yellowing: string | null;
  description: string;
  extent: string | null;
  voiceTranscript: string;
  followUpAnswers: Record<string, DynamicAnswer>;
}

export interface DiagnosisSprite { sheet: string; column: number; row: number }
export interface DiagnosisChoice {
  id: string;
  value?: string;
  labelKey: string;
  subtitleKey?: string;
  image?: string;
  sprite?: DiagnosisSprite;
  metadata?: Record<string, unknown>;
}
export interface DiagnosisCrop {
  id: CropId;
  translationKey: string;
  scientificName: string | null;
  category: string;
  imageKey: string | null;
  enabled: boolean;
  displayOrder: number;
}
export interface DiagnosisQuestion {
  id: string;
  cropId: CropId;
  code: string;
  phase: "crop" | "observations" | "questions";
  answerType: DiagnosisAnswerType;
  titleKey: string;
  descriptionKey: string | null;
  required: boolean;
  allowUnknown: boolean;
  allowSkip: boolean;
  progressWeight: number;
  displayOrder: number;
  options: DiagnosisChoice[];
}
export interface DynamicQuestionDecision {
  complete: boolean;
  questionCode: string | null;
  question: DiagnosisQuestion | null;
  reason: string;
  provider: AiProvider;
  model: string;
  origin: DynamicQuestionOrigin;
}
export interface DiagnosisSession {
  id: string;
  cropId: CropId | null;
  locale: string;
  status: "draft" | "collecting" | "analyzing" | "completed" | "failed" | "cancelled";
  currentQuestionCode: string | null;
  progress: number;
  startedAt: string;
  updatedAt: string;
  completedAt: string | null;
}
