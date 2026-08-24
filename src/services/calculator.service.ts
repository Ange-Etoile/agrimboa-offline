import Database from "@tauri-apps/plugin-sql";
import type {
  CalculatorDraft,
  CalculatorHistoryItem,
  CalculatorStep,
} from "@/features/calculators/types/calculator";
import { isTauriApplication } from "@/services/diagnosis.service";
let promise: Promise<Database> | null = null;
const db = () => (promise ??= Database.load("sqlite:agrimboa.db"));
export async function saveCalculatorProject(d: CalculatorDraft): Promise<void> {
  if (!isTauriApplication()) return;
  await (
    await db()
  ).execute(
    `INSERT INTO calculator_projects(id,name,crop_id,draft_json,status,updated_at) VALUES($1,$2,$3,$4,'active',CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET name=excluded.name,crop_id=excluded.crop_id,draft_json=excluded.draft_json,status=excluded.status,updated_at=CURRENT_TIMESTAMP`,
    [d.id, d.name, d.crop, JSON.stringify(d)],
  );
}
export async function saveCalculatorResult(
  d: CalculatorDraft,
  step: CalculatorStep,
  label: string,
  result: string,
): Promise<void> {
  if (!isTauriApplication()) return;
  await saveCalculatorProject(d);
  await (
    await db()
  ).execute(
    `INSERT INTO calculator_results(id,project_id,calculator_type,label,result_text,input_json,output_json) VALUES($1,$2,$3,$4,$5,$6,$7)`,
    [
      crypto.randomUUID(),
      d.id,
      step,
      label,
      result,
      JSON.stringify(d),
      JSON.stringify({
        surfaceM2: d.surfaceM2,
        plants: d.plants,
        seedUnits: d.seedUnits,
        seedKg: d.seedKg,
        inputKg: d.inputKg,
      }),
    ],
  );
}
export async function listCalculatorHistory(): Promise<
  CalculatorHistoryItem[]
> {
  if (!isTauriApplication()) return [];
  const rows = await (
    await db()
  ).select<
    Array<{
      id: string;
      project_id: string;
      calculator_type: CalculatorStep;
      label: string;
      result_text: string;
      output_json: string;
      created_at: string;
    }>
  >(
    `SELECT id,project_id,calculator_type,label,result_text,output_json,created_at FROM calculator_results ORDER BY created_at DESC LIMIT 30`,
  );
  return rows.map((r) => ({
    id: r.id,
    projectId: r.project_id,
    step: r.calculator_type,
    label: r.label,
    result: r.result_text,
    payload: JSON.parse(r.output_json),
    createdAt: r.created_at,
  }));
}
