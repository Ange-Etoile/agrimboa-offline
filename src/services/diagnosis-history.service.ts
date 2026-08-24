import Database from "@tauri-apps/plugin-sql";
import type { CropId } from "@/features/diagnosis/types/diagnosis";
import type { DiagnosisResult } from "@/features/diagnosis/types/diagnosis-result";
import type {
  DiagnosisFollowUpInput,
  DiagnosisHistoryItem,
} from "@/features/history/types/history";
import { isTauriApplication } from "@/services/diagnosis.service";

interface HistoryRow {
  session_id: string;
  crop_id: string | null;
  session_status: string;
  started_at: string;
  updated_at: string;
  next_follow_up_at: string | null;
  summary: string | null;
  possible_causes_json: string | null;
  recommendations_json: string | null;
  warning_signs_json: string | null;
  guide_sources_json: string | null;
  confidence: "low" | "medium" | "high" | null;
  model_name: string | null;
  result_created_at: string | null;
  result_json: string | null;
  latest_evolution: string | null;
  actions_completed: number | null;
}

let databasePromise: Promise<Database> | null = null;
const db = () => (databasePromise ??= Database.load("sqlite:agrimboa.db"));
const parse = <T>(value: string | null, fallback: T): T => {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};
const isCrop = (value: string | null): value is CropId =>
  ["maize", "cassava", "tomato", "plantain"].includes(value ?? "");

function reconstruct(row: HistoryRow): DiagnosisResult | null {
  const stored = parse<DiagnosisResult | null>(row.result_json, null);
  if (stored) return stored;
  if (!row.summary || !isCrop(row.crop_id)) return null;
  const causes = parse<Array<{ name: string; match: number; reason: string }>>(
    row.possible_causes_json,
    [],
  );
  const plan = parse<DiagnosisResult["plan"]>(row.recommendations_json, []);
  const confidence =
    row.confidence === "high" ? 82 : row.confidence === "medium" ? 65 : 42;
  const primary = causes[0] ?? {
    name: row.summary,
    match: confidence,
    reason: row.summary,
  };
  return {
    crop: row.crop_id,
    title: primary.name,
    summary: row.summary,
    confidence,
    priority: confidence >= 75 ? "high" : confidence >= 50 ? "moderate" : "low",
    primaryCause: primary,
    alternativeCauses: causes.slice(1),
    immediateActions: plan[0]?.items ?? [],
    warningSigns: parse(row.warning_signs_json, []),
    evidence: [],
    limitations: [],
    sources: parse(row.guide_sources_json, []),
    plan,
    followUpDays: 4,
    followUpChecks: plan[1]?.items ?? [],
    provider: "fallback",
    model: row.model_name ?? "stored-result",
    generatedAt: row.result_created_at ?? row.updated_at,
  };
}

function mapRow(row: HistoryRow): DiagnosisHistoryItem | null {
  if (!isCrop(row.crop_id)) return null;
  const result = reconstruct(row);
  const totalActions =
    result?.plan.reduce((sum, period) => sum + period.items.length, 0) ?? 0;
  const status = !result
    ? "draft"
    : row.latest_evolution === "improving" && !row.next_follow_up_at
      ? "completed"
      : row.latest_evolution === "worsening"
        ? "watch"
        : row.next_follow_up_at
          ? "follow_up"
          : "completed";
  return {
    sessionId: row.session_id,
    crop: row.crop_id,
    title: result?.title ?? "Consultation en cours",
    summary: result?.primaryCause.name ?? "Diagnostic non terminé",
    confidence: result?.confidence ?? 0,
    priority: result?.priority ?? "moderate",
    status,
    createdAt: row.result_created_at ?? row.started_at,
    updatedAt: row.updated_at,
    nextFollowUpAt: row.next_follow_up_at,
    completedActions: row.actions_completed ?? 0,
    totalActions,
    result,
  };
}

export async function listDiagnosisHistory(): Promise<DiagnosisHistoryItem[]> {
  if (!isTauriApplication()) {
    const result = parse<DiagnosisResult | null>(
      localStorage.getItem("agrimboa.diagnosis.latest-result"),
      null,
    );
    return result
      ? [
          {
            sessionId: "browser-latest",
            crop: result.crop,
            title: result.title,
            summary: result.primaryCause.name,
            confidence: result.confidence,
            priority: result.priority,
            status: "follow_up",
            createdAt: result.generatedAt,
            updatedAt: result.generatedAt,
            nextFollowUpAt: new Date(
              new Date(result.generatedAt).getTime() +
                result.followUpDays * 86400000,
            ).toISOString(),
            completedActions: 0,
            totalActions: result.plan.reduce((n, p) => n + p.items.length, 0),
            result,
          },
        ]
      : [];
  }
  const database = await db();
  const rows = await database.select<HistoryRow[]>(
    `SELECT s.id session_id,s.crop_id,s.status session_status,s.started_at,s.updated_at,s.next_follow_up_at,r.summary,r.possible_causes_json,r.recommendations_json,r.warning_signs_json,r.guide_sources_json,r.confidence,r.model_name,r.created_at result_created_at,r.result_json,(SELECT evolution FROM diagnosis_follow_ups f WHERE f.session_id=s.id ORDER BY f.created_at DESC LIMIT 1) latest_evolution,COALESCE((SELECT MAX(actions_completed) FROM diagnosis_follow_ups f WHERE f.session_id=s.id),0) actions_completed FROM diagnosis_sessions s LEFT JOIN diagnosis_results r ON r.session_id=s.id ORDER BY s.updated_at DESC`,
  );
  const items = rows
    .map(mapRow)
    .filter((item): item is DiagnosisHistoryItem => item !== null);
  const latest = parse<DiagnosisResult | null>(
    localStorage.getItem("agrimboa.diagnosis.latest-result"),
    null,
  );
  if (
    latest &&
    !items.some((item) => item.result?.generatedAt === latest.generatedAt)
  ) {
    const sessionId = crypto.randomUUID();
    const nextFollowUpAt = new Date(
      new Date(latest.generatedAt).getTime() + latest.followUpDays * 86400000,
    ).toISOString();
    await database.execute(
      `INSERT INTO diagnosis_sessions (id,crop_id,locale,status,progress,started_at,updated_at,completed_at,next_follow_up_at) VALUES ($1,$2,'fr','completed',100,$3,$3,$3,$4)`,
      [sessionId, latest.crop, latest.generatedAt, nextFollowUpAt],
    );
    await database.execute(
      `INSERT INTO diagnosis_results (id,session_id,summary,possible_causes_json,recommendations_json,warning_signs_json,guide_sources_json,confidence,model_name,prompt_version,created_at,result_json) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'diagnosis-v2',$10,$11)`,
      [
        crypto.randomUUID(),
        sessionId,
        latest.summary,
        JSON.stringify([latest.primaryCause, ...latest.alternativeCauses]),
        JSON.stringify(latest.plan),
        JSON.stringify(latest.warningSigns),
        JSON.stringify(latest.sources),
        latest.confidence >= 75
          ? "high"
          : latest.confidence >= 50
            ? "medium"
            : "low",
        latest.model,
        latest.generatedAt,
        JSON.stringify(latest),
      ],
    );
    items.unshift({
      sessionId,
      crop: latest.crop,
      title: latest.title,
      summary: latest.primaryCause.name,
      confidence: latest.confidence,
      priority: latest.priority,
      status: "follow_up",
      createdAt: latest.generatedAt,
      updatedAt: latest.generatedAt,
      nextFollowUpAt,
      completedActions: 0,
      totalActions: latest.plan.reduce((n, p) => n + p.items.length, 0),
      result: latest,
    });
  }
  return items;
}

export async function getDiagnosisHistoryResult(
  sessionId: string,
): Promise<DiagnosisResult | null> {
  return (
    (await listDiagnosisHistory()).find((item) => item.sessionId === sessionId)
      ?.result ?? null
  );
}

export async function saveDiagnosisFollowUp(
  input: DiagnosisFollowUpInput,
): Promise<void> {
  if (!isTauriApplication()) return;
  const database = await db();
  await database.execute(
    `INSERT INTO diagnosis_follow_ups (id,session_id,evolution,extent,note,actions_completed) VALUES ($1,$2,$3,$4,$5,$6)`,
    [
      crypto.randomUUID(),
      input.sessionId,
      input.evolution,
      input.extent,
      input.note,
      input.actionsCompleted,
    ],
  );
  const next =
    input.evolution === "improving"
      ? null
      : new Date(
          Date.now() +
            (input.evolution === "worsening" ? 86400000 : 4 * 86400000),
        ).toISOString();
  await database.execute(
    `UPDATE diagnosis_sessions SET next_follow_up_at=$2,updated_at=CURRENT_TIMESTAMP WHERE id=$1`,
    [input.sessionId, next],
  );
}
