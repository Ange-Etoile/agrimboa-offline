import { invoke } from "@tauri-apps/api/core";
import Database from "@tauri-apps/plugin-sql";
import { z } from "zod";
import type { DiagnosisAnswers } from "@/features/diagnosis/types/diagnosis";
import type {
  DiagnosisGenerationResponse,
  DiagnosisResult,
} from "@/features/diagnosis/types/diagnosis-result";
import { isTauriApplication } from "@/services/diagnosis.service";

const resultSchema = z.object({
  title: z.string().min(5).max(140),
  summary: z.string().min(10).max(500),
  confidence: z.number().min(0).max(100),
  priority: z.enum(["low", "moderate", "high"]),
  primaryCause: z.object({
    name: z.string(),
    match: z.number().min(0).max(100),
    reason: z.string(),
  }),
  alternativeCauses: z
    .array(
      z.object({
        name: z.string(),
        match: z.number().min(0).max(100),
        reason: z.string(),
      }),
    )
    .max(4),
  immediateActions: z.array(z.string()).min(2).max(6),
  warningSigns: z.array(z.string()).min(1).max(5),
  evidence: z
    .array(
      z.object({
        label: z.string(),
        weight: z.number().min(0).max(100),
        detail: z.string(),
      }),
    )
    .min(2)
    .max(6),
  limitations: z.array(z.string()).max(5),
  sources: z.array(z.string()).max(5),
  plan: z
    .array(
      z.object({
        period: z.string(),
        title: z.string(),
        duration: z.string(),
        items: z.array(z.string()).min(1).max(5),
      }),
    )
    .min(2)
    .max(4),
  followUpDays: z.number().int().min(1).max(30),
  followUpChecks: z.array(z.string()).min(2).max(6),
});

function cleanJson(value: string): string {
  const cleaned = value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  return start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
}

function fallback(answers: DiagnosisAnswers): DiagnosisResult {
  const crop = answers.crop ?? "maize";
  const cropNames = {
    maize: "maïs",
    cassava: "manioc",
    tomato: "tomate",
    plantain: "plantain",
  };
  const yellow =
    answers.symptoms.some((v) => /yellow|jaun/i.test(v)) ||
    Boolean(answers.yellowing);
  const potassium = crop === "maize" && yellow;
  const profiles = {
    maize: {
      cause: yellow
        ? "Carence nutritionnelle probable du maïs"
        : "Stress du maïs à préciser",
      actions: [
        "Observer la base et l’extrémité des feuilles de maïs.",
        "Vérifier l’humidité et l’historique de fertilisation de la parcelle.",
        "Inspecter le cœur des plants pour rechercher larves et déjections.",
      ],
      checks: [
        "Couleur des nouvelles feuilles de maïs",
        "État du cœur et des épis",
        "Extension sur les lignes voisines",
      ],
    },
    cassava: {
      cause: "Stress foliaire ou racinaire probable du manioc",
      actions: [
        "Comparer les jeunes feuilles et les feuilles âgées du manioc.",
        "Vérifier les aleurodes sous les feuilles et les déformations en mosaïque.",
        "Examiner prudemment une racine pour rechercher une pourriture.",
      ],
      checks: [
        "Déformation des nouvelles feuilles",
        "Présence d’aleurodes",
        "État des tiges et racines tubéreuses",
      ],
    },
    tomato: {
      cause: "Stress sanitaire probable de la tomate",
      actions: [
        "Inspecter le dessous des feuilles et les tiges de tomate.",
        "Éviter de mouiller le feuillage avant d’écarter une atteinte fongique.",
        "Vérifier les fruits, fleurs et plants voisins.",
      ],
      checks: [
        "Progression des taches foliaires",
        "État des fleurs et fruits",
        "Flétrissement pendant les heures fraîches",
      ],
    },
    plantain: {
      cause: "Stress foliaire ou racinaire probable du plantain",
      actions: [
        "Comparer les plus jeunes et les plus vieilles feuilles du plantain.",
        "Observer les taches noires, le pseudo-tronc et le pied du plant.",
        "Vérifier le drainage et rechercher des dégâts de charançons.",
      ],
      checks: [
        "Évolution des taches sur les feuilles",
        "Solidité du pseudo-tronc",
        "État du rejet et du régime",
      ],
    },
  } as const;
  const profile = profiles[crop];
  const cause = potassium
    ? "Carence probable en potassium du maïs"
    : profile.cause;
  return {
    crop,
    title: potassium ? "Une carence en potassium est probable" : cause,
    summary: `Les observations enregistrées sur le ${cropNames[crop]} orientent vers cette hypothèse. Le suivi proposé concerne spécifiquement cette culture.`,
    confidence: potassium ? 74 : 62,
    priority: "moderate",
    primaryCause: {
      name: cause,
      match: potassium ? 74 : 62,
      reason:
        "La localisation des symptômes et leur aspect correspondent le mieux à cette hypothèse.",
    },
    alternativeCauses: [
      {
        name: "Stress hydrique",
        match: 41,
        reason: "Un manque ou un excès d’eau peut produire des signes proches.",
      },
      {
        name: "Atteinte fongique",
        match: 27,
        reason: "À surveiller si des taches progressent rapidement.",
      },
    ],
    immediateActions: [...profile.actions],
    warningSigns: [
      "Progression rapide vers les jeunes feuilles",
      "Flétrissement généralisé ou pourriture",
      "Plus de la moitié de la parcelle touchée",
    ],
    evidence: [
      {
        label: "Parties touchées",
        weight: 82,
        detail: answers.parts.join(", ") || "Non précisées",
      },
      {
        label: "Symptômes observés",
        weight: 76,
        detail: answers.symptoms.join(", ") || "Description libre",
      },
      {
        label: "Description du producteur",
        weight: 58,
        detail:
          answers.description || answers.voiceTranscript || "Peu détaillée",
      },
    ],
    limitations: [
      "Ce résultat est une aide à la décision et non une analyse de laboratoire.",
      "Une photo nette et l’historique de fertilisation pourraient améliorer la précision.",
    ],
    sources: [
      "Guides agricoles AgriMboa hors ligne",
      "Questionnaire agronomique validé",
    ],
    plan: [
      {
        period: "Aujourd’hui",
        title: `Vérifier le ${cropNames[crop]}`,
        duration: "15–30 min",
        items: [profile.actions[0], profile.actions[1], profile.actions[2]],
      },
      {
        period: "Dans 3 à 7 jours",
        title: "Comparer l’évolution",
        duration: "Suivi court",
        items: [profile.checks[0], profile.checks[1], profile.checks[2]],
      },
      {
        period: "Si le problème continue",
        title: "Demander un avis ciblé",
        duration: "Sans attendre",
        items: [
          `Présenter les observations concernant le ${cropNames[crop]} à un conseiller agricole.`,
          "Faire analyser le sol ou un échantillon si possible.",
        ],
      },
    ],
    followUpDays: 4,
    followUpChecks: [...profile.checks],
    provider: "fallback",
    model: "agrimboa-rules-v1",
    generatedAt: new Date().toISOString(),
  };
}

function promptFor(answers: DiagnosisAnswers, locale: string): string {
  return `Assistant agronomique prudent au Cameroun. CULTURE ET OBSERVATIONS=${JSON.stringify(answers)}. Langue=${locale}. Le diagnostic et CHAQUE action doivent concerner explicitement cette culture et ces symptômes. JSON compact uniquement: {"title":"","summary":"","confidence":0,"priority":"low|moderate|high","primaryCause":{"name":"","match":0,"reason":""},"alternativeCauses":[{"name":"","match":0,"reason":""}],"immediateActions":["",""],"warningSigns":[""],"evidence":[{"label":"","weight":0,"detail":""},{"label":"","weight":0,"detail":""}],"limitations":[""],"sources":[""],"plan":[{"period":"Aujourd’hui","title":"","duration":"","items":[""]},{"period":"Dans 3 à 7 jours","title":"","duration":"","items":[""]}],"followUpDays":4,"followUpChecks":["",""]}. Aucune certitude sans laboratoire.`;
}

function normalizeGenerated(
  value: unknown,
  safe: DiagnosisResult,
): Omit<DiagnosisResult, "crop" | "provider" | "model" | "generatedAt"> {
  const raw =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : {};
  const choose = <T>(
    schema: z.ZodType<T>,
    candidate: unknown,
    fallbackValue: T,
  ): T => {
    const checked = schema.safeParse(candidate);
    return checked.success ? checked.data : fallbackValue;
  };
  return {
    title: choose(resultSchema.shape.title, raw.title, safe.title),
    summary: choose(resultSchema.shape.summary, raw.summary, safe.summary),
    confidence: choose(
      resultSchema.shape.confidence,
      raw.confidence,
      safe.confidence,
    ),
    priority: choose(resultSchema.shape.priority, raw.priority, safe.priority),
    primaryCause: choose(
      resultSchema.shape.primaryCause,
      raw.primaryCause,
      safe.primaryCause,
    ),
    alternativeCauses: choose(
      resultSchema.shape.alternativeCauses,
      raw.alternativeCauses,
      safe.alternativeCauses,
    ),
    immediateActions: choose(
      resultSchema.shape.immediateActions,
      raw.immediateActions,
      safe.immediateActions,
    ),
    warningSigns: choose(
      resultSchema.shape.warningSigns,
      raw.warningSigns,
      safe.warningSigns,
    ),
    evidence: choose(resultSchema.shape.evidence, raw.evidence, safe.evidence),
    limitations: choose(
      resultSchema.shape.limitations,
      raw.limitations,
      safe.limitations,
    ),
    sources: choose(resultSchema.shape.sources, raw.sources, safe.sources),
    plan: choose(resultSchema.shape.plan, raw.plan, safe.plan),
    followUpDays: choose(
      resultSchema.shape.followUpDays,
      raw.followUpDays,
      safe.followUpDays,
    ),
    followUpChecks: choose(
      resultSchema.shape.followUpChecks,
      raw.followUpChecks,
      safe.followUpChecks,
    ),
  };
}

export async function generateDiagnosis(
  answers: DiagnosisAnswers,
  locale: string,
): Promise<DiagnosisResult> {
  const safe = fallback(answers);
  if (!isTauriApplication()) return safe;
  try {
    const response = await invoke<DiagnosisGenerationResponse>(
      "generate_diagnosis",
      { request: { prompt: promptFor(answers, locale) } },
    );
    const parsed = normalizeGenerated(
      JSON.parse(cleanJson(response.content)),
      safe,
    );
    return {
      ...parsed,
      crop: answers.crop ?? "maize",
      provider: response.provider,
      model: response.model,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn(
      "Résultat IA invalide ou indisponible, résultat prudent local utilisé.",
      error,
    );
    return safe;
  }
}

export async function saveDiagnosis(
  result: DiagnosisResult,
  answers: DiagnosisAnswers,
  existingSessionId?: string,
): Promise<string> {
  const id = existingSessionId || crypto.randomUUID();
  if (!isTauriApplication()) {
    localStorage.setItem(
      `agrimboa.diagnosis.history.${id}`,
      JSON.stringify({ result, answers }),
    );
    return id;
  }
  const db = await Database.load("sqlite:agrimboa.db");
  await db.execute(
    `INSERT OR IGNORE INTO diagnosis_sessions (id,crop_id,locale,status,progress,completed_at) VALUES ($1,$2,'fr','completed',100,CURRENT_TIMESTAMP)`,
    [id, answers.crop],
  );
  const nextFollowUpAt = new Date(
    Date.now() + result.followUpDays * 86400000,
  ).toISOString();
  await db.execute(
    `UPDATE diagnosis_sessions SET crop_id=$2,status='completed',progress=100,updated_at=CURRENT_TIMESTAMP,completed_at=CURRENT_TIMESTAMP,next_follow_up_at=$3 WHERE id=$1`,
    [id, answers.crop, nextFollowUpAt],
  );
  const entries = Object.entries({
    crop: answers.crop,
    parts: answers.parts,
    symptoms: answers.symptoms,
    yellowing: answers.yellowing,
    description: answers.description,
    extent: answers.extent,
    ...answers.followUpAnswers,
  });
  for (const [code, value] of entries)
    await db.execute(
      `INSERT OR REPLACE INTO diagnosis_answers (id,session_id,question_code,answer_type,value_json) VALUES ($1,$2,$3,$4,$5)`,
      [
        crypto.randomUUID(),
        id,
        code,
        Array.isArray(value) ? "multiple_choice" : "free_text",
        JSON.stringify(value),
      ],
    );
  await db.execute(
    `INSERT OR REPLACE INTO diagnosis_results (id,session_id,summary,possible_causes_json,recommendations_json,warning_signs_json,guide_sources_json,confidence,model_name,prompt_version,result_json) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'diagnosis-v2',$10)`,
    [
      crypto.randomUUID(),
      id,
      result.summary,
      JSON.stringify([result.primaryCause, ...result.alternativeCauses]),
      JSON.stringify(result.plan),
      JSON.stringify(result.warningSigns),
      JSON.stringify(result.sources),
      result.confidence >= 75
        ? "high"
        : result.confidence >= 50
          ? "medium"
          : "low",
      result.model,
      JSON.stringify(result),
    ],
  );
  return id;
}
