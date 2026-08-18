import Database from "@tauri-apps/plugin-sql";

import { resolveDiagnosisSprite } from "@/features/diagnosis/data/diagnosisImageRegistry";

import type {
  CropId,
  DiagnosisAnswerType,
  DiagnosisChoice,
  DiagnosisCrop,
  DiagnosisQuestion,
} from "@/features/diagnosis/types/diagnosis";

interface CropRow {
  id: string;
  translation_key: string;
  scientific_name: string | null;
  category: string;
  image_key: string | null;
  enabled: number;
  display_order: number;
}

interface QuestionRow {
  id: string;
  crop_id: string;
  code: string;
  phase:
    | "crop"
    | "observations"
    | "questions";
  answer_type: DiagnosisAnswerType;
  title_key: string;
  description_key: string | null;
  required: number;
  allow_unknown: number;
  allow_skip: number;
  progress_weight: number;
  display_order: number;
}

interface QuestionOptionRow {
  id: string;
  question_id: string;
  value: string;
  label_key: string;
  image_key: string | null;
  display_order: number;
  metadata_json: string | null;
}

let databasePromise:
  | Promise<Database>
  | null = null;

function getDatabase(): Promise<Database> {
  if (!databasePromise) {
    databasePromise = Database.load(
      "sqlite:agrimboa.db",
    );
  }

  return databasePromise;
}

export function isTauriApplication(): boolean {
  return (
    typeof window !== "undefined" &&
    "__TAURI_INTERNALS__" in window
  );
}

export async function getDiagnosisCrops(): Promise<
  DiagnosisCrop[]
> {
  assertNativeApplication();

  const database = await getDatabase();

  const rows = await database.select<
    CropRow[]
  >(
    `
      SELECT
        id,
        translation_key,
        scientific_name,
        category,
        image_key,
        enabled,
        display_order
      FROM crops
      WHERE enabled = 1
      ORDER BY display_order ASC
    `,
  );

  return rows
    .filter((row) => isCropId(row.id))
    .map((row) => ({
      id: row.id as CropId,
      translationKey: row.translation_key,
      scientificName: row.scientific_name,
      category: row.category,
      imageKey: row.image_key,
      enabled: row.enabled === 1,
      displayOrder: row.display_order,
    }));
}

export async function getQuestionsForCrop(
  cropId: CropId,
): Promise<DiagnosisQuestion[]> {
  assertNativeApplication();

  const database = await getDatabase();

  const questionRows =
    await database.select<QuestionRow[]>(
      `
        SELECT
          id,
          crop_id,
          code,
          phase,
          answer_type,
          title_key,
          description_key,
          required,
          allow_unknown,
          allow_skip,
          progress_weight,
          display_order
        FROM diagnosis_questions
        WHERE crop_id = $1
          AND enabled = 1
        ORDER BY display_order ASC
      `,
      [cropId],
    );

  if (questionRows.length === 0) {
    throw new Error(
      `Aucune question n’est disponible pour la culture : ${cropId}`,
    );
  }

  const questionIds = questionRows.map(
    (question) => question.id,
  );

  const placeholders = questionIds
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  const optionRows =
    await database.select<
      QuestionOptionRow[]
    >(
      `
        SELECT
          id,
          question_id,
          value,
          label_key,
          image_key,
          display_order,
          metadata_json
        FROM diagnosis_question_options
        WHERE question_id IN (${placeholders})
          AND enabled = 1
        ORDER BY
          question_id ASC,
          display_order ASC
      `,
      questionIds,
    );

  return questionRows.map((question) => ({
    id: question.id,
    cropId: question.crop_id as CropId,
    code: question.code,
    phase: question.phase,
    answerType: question.answer_type,
    titleKey: question.title_key,
    descriptionKey:
      question.description_key,
    required: question.required === 1,
    allowUnknown:
      question.allow_unknown === 1,
    allowSkip:
      question.allow_skip === 1,
    progressWeight:
      question.progress_weight,
    displayOrder:
      question.display_order,

    options: optionRows
      .filter(
        (option) =>
          option.question_id === question.id,
      )
      .map(mapQuestionOption),
  }));
}

export async function getQuestionForCrop(
  cropId: CropId,
  questionCode: string,
): Promise<DiagnosisQuestion | null> {
  const questions =
    await getQuestionsForCrop(cropId);

  return (
    questions.find(
      (question) =>
        question.code === questionCode,
    ) ?? null
  );
}

function mapQuestionOption(
  row: QuestionOptionRow,
): DiagnosisChoice {
  return {
    id: row.id,
    value: row.value,
    labelKey: row.label_key,
    sprite: resolveDiagnosisSprite(
      row.image_key,
    ),
    metadata: parseMetadata(
      row.metadata_json,
    ),
  };
}

function parseMetadata(
  value: string | null,
): Record<string, unknown> | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const parsed: unknown =
      JSON.parse(value);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      !Array.isArray(parsed)
    ) {
      return parsed as Record<
        string,
        unknown
      >;
    }

    return undefined;
  } catch {
    console.warn(
      "Métadonnées d’option invalides :",
      value,
    );

    return undefined;
  }
}

function isCropId(
  value: string,
): value is CropId {
  return [
    "maize",
    "cassava",
    "tomato",
    "plantain",
  ].includes(value);
}

function assertNativeApplication(): void {
  if (!isTauriApplication()) {
    throw new Error(
      "Les questions SQLite sont accessibles uniquement dans l’application Tauri.",
    );
  }
}