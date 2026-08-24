import type { CropId } from "@/features/diagnosis/types/diagnosis";
import type { DiagnosisResult } from "@/features/diagnosis/types/diagnosis-result";

export type HistoryStatus = "follow_up" | "completed" | "draft" | "watch";
export type HistoryTab = "all" | "follow_up" | "completed" | "draft";

export interface DiagnosisHistoryItem {
  sessionId: string;
  crop: CropId;
  title: string;
  summary: string;
  confidence: number;
  priority: "low" | "moderate" | "high";
  status: HistoryStatus;
  createdAt: string;
  updatedAt: string;
  nextFollowUpAt: string | null;
  completedActions: number;
  totalActions: number;
  result: DiagnosisResult | null;
}

export interface HistoryFilters {
  search: string;
  crop: CropId | "all";
  period: "all" | "7d" | "30d" | "year";
  sort: "recent" | "oldest" | "confidence";
  tab: HistoryTab;
}

export interface DiagnosisFollowUpInput {
  sessionId: string;
  evolution: "improving" | "stable" | "worsening";
  extent: string | null;
  note: string;
  actionsCompleted: number;
}
