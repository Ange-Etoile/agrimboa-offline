import { isTauri } from "@tauri-apps/api/core";
import Database from "@tauri-apps/plugin-sql";

export interface AgriculturalGuide {
  id: string;
  title: string;
  language: string;
  crop: string | null;
  category: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  content: string;
}

interface AgriculturalGuideRow {
  id: string;
  title: string;
  language: string;
  crop: string | null;
  category: string | null;
  source_name: string | null;
  source_url: string | null;
  content: string;
}

let guideDatabasePromise: Promise<Database> | null = null;

async function openGuideDatabase(): Promise<Database> {
  if (!guideDatabasePromise) {
    guideDatabasePromise = Database.load(
      "sqlite:agrimboa.db",
    );
  }

  return guideDatabasePromise;
}

export async function findRelevantGuides(
  question: string,
  crop?: string,
  limit = 4,
): Promise<AgriculturalGuide[]> {
  if (!isTauri()) {
    return [];
  }

  const database = await openGuideDatabase();

  const rows = await database.select<
    AgriculturalGuideRow[]
  >(
    `
      SELECT
        id,
        title,
        language,
        crop,
        category,
        source_name,
        source_url,
        content
      FROM agricultural_guides
      WHERE is_available_offline = 1
    `,
  );

  const questionTokens = tokenize(question);
  const normalizedCrop = crop
    ? normalizeText(crop)
    : null;

  return rows
    .map((row) => ({
      guide: mapGuide(row),
      score: calculateScore(
        row,
        questionTokens,
        normalizedCrop,
      ),
    }))
    .filter((result) => result.score > 0)
    .sort((first, second) => {
      return second.score - first.score;
    })
    .slice(0, limit)
    .map((result) => result.guide);
}

function calculateScore(
  guide: AgriculturalGuideRow,
  questionTokens: string[],
  crop: string | null,
): number {
  const title = normalizeText(guide.title);
  const content = normalizeText(guide.content);
  const guideCrop = normalizeText(guide.crop ?? "");

  let score = 0;

  if (
    crop &&
    cropMatches(crop, guideCrop)
  ) {
    score += 20;
  }

  for (const token of questionTokens) {
    if (title.includes(token)) {
      score += 4;
    }

    if (content.includes(token)) {
      score += 1;
    }

    if (guideCrop.includes(token)) {
      score += 6;
    }
  }

  return score;
}

function cropMatches(
  requestedCrop: string,
  guideCrop: string,
): boolean {
  const equivalents: Record<string, string[]> = {
    cassava: ["cassava", "manioc"],
    manioc: ["cassava", "manioc"],
    maize: ["maize", "mais"],
    mais: ["maize", "mais"],
  };

  const acceptedValues =
    equivalents[requestedCrop] ?? [requestedCrop];

  return acceptedValues.includes(guideCrop);
}

function tokenize(value: string): string[] {
  return [
    ...new Set(
      normalizeText(value)
        .split(/\s+/)
        .filter((token) => token.length >= 4),
    ),
  ];
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapGuide(
  row: AgriculturalGuideRow,
): AgriculturalGuide {
  return {
    id: row.id,
    title: row.title,
    language: row.language,
    crop: row.crop,
    category: row.category,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    content: row.content,
  };
}