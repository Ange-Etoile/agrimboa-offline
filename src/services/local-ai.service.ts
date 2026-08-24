import { invoke } from "@tauri-apps/api/core";
import Database from "@tauri-apps/plugin-sql";
import { z } from "zod";
import type {
  AiProvider,
  CropId,
  DiagnosisAnswers,
  DiagnosisQuestion,
  DynamicQuestionDecision,
} from "@/features/diagnosis/types/diagnosis";

const LOCAL_AI_URL = "http://127.0.0.1:11435/v1/chat/completions";
const LOCAL_MODEL = "Qwen2.5-3B-Instruct-GGUF";

const optionSchema = z.object({
  value: z.string().min(1).max(50),
  label: z.string().min(1).max(100),
});

const generatedDecisionSchema = z
  .object({
    complete: z.boolean(),
    reason: z
      .string()
      .min(1)
      .transform((value) => value.trim().slice(0, 240)),
    question: z
      .object({
        title: z.string().min(8).max(180),
        description: z.string().max(240).nullable().default(null),
        answerType: z.enum(["single_choice", "multiple_choice", "free_text"]),
        options: z.array(optionSchema).max(6).default([]),
      })
      .nullable(),
  })
  .superRefine((value, context) => {
    if (!value.complete && !value.question)
      context.addIssue({
        code: "custom",
        message: "Une question est requise.",
      });
    if (value.complete && value.question)
      context.addIssue({
        code: "custom",
        message: "La question doit être null lorsque la collecte est terminée.",
      });
    if (
      value.question &&
      value.question.answerType !== "free_text" &&
      value.question.options.length < 2
    ) {
      context.addIssue({
        code: "custom",
        message: "Une question à choix doit avoir au moins deux options.",
      });
    }
  });

interface NativeAiResult {
  content: string;
  provider: AiProvider;
  model: string;
}
interface ChatCompletionResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

function isTauriApplication(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

function cleanJson(value: string): string {
  const cleaned = value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/i, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  return start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
}

function slug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 42);
}

function toDiagnosisQuestion(
  crop: CropId,
  raw: z.infer<typeof generatedDecisionSchema>["question"],
): DiagnosisQuestion | null {
  if (!raw) return null;
  const code = `ai_${slug(raw.title)}_${Date.now().toString(36)}`;
  return {
    id: crypto.randomUUID(),
    cropId: crop,
    code,
    phase: "questions",
    answerType: raw.answerType,
    titleKey: raw.title,
    descriptionKey: raw.description,
    required: true,
    allowUnknown: true,
    allowSkip: false,
    progressWeight: 5,
    displayOrder: 100,
    options: raw.options.map((option, index) => ({
      id: `${code}_${index + 1}`,
      value: option.value,
      labelKey: option.label,
    })),
  };
}

function fallbackDecision(
  answers: DiagnosisAnswers,
  candidates: DiagnosisQuestion[],
  askedCodes: string[],
  provider: AiProvider,
  model: string,
): DynamicQuestionDecision {
  const remaining = candidates.filter(
    (question) => !askedCodes.includes(question.code),
  );
  const preferredCodes = answers.symptoms.some((value) =>
    /insect|hole|whitefl|trou|larv/i.test(value),
  )
    ? [
        "visible_pests",
        "progression",
        "distribution_pattern",
        "onset",
        "extent",
        "recent_weather",
      ]
    : answers.symptoms.some((value) => /rot|wilt|pourr|flétr/i.test(value))
      ? [
          "recent_weather",
          "progression",
          "distribution_pattern",
          "onset",
          "extent",
          "visible_pests",
        ]
      : [
          "progression",
          "onset",
          "distribution_pattern",
          "recent_weather",
          "visible_pests",
          "extent",
        ];
  const question =
    preferredCodes
      .map((code) => remaining.find((item) => item.code === code))
      .find(Boolean) ??
    remaining[0] ??
    null;
  return question
    ? {
        complete: false,
        questionCode: question.code,
        question,
        reason:
          "Le moteur n’a pas produit une question valide. Une précision de secours adaptée aux symptômes est utilisée.",
        provider,
        model,
        origin: "fallback",
      }
    : {
        complete: true,
        questionCode: null,
        question: null,
        reason:
          "Les informations disponibles permettent de poursuivre l’analyse.",
        provider,
        model,
        origin: "fallback",
      };
}

export async function generateNextDiagnosisQuestion(
  answers: DiagnosisAnswers,
  fallbackCandidates: DiagnosisQuestion[],
  askedQuestionCodes: string[],
  askedQuestionTitles: string[],
): Promise<DynamicQuestionDecision> {
  if (!answers.crop) throw new Error("Aucune culture n’est sélectionnée.");
  const cropNames = {
    maize: "maïs",
    cassava: "manioc",
    tomato: "tomate",
    plantain: "plantain",
  };
  const prompt = `Tu es un agronome camerounais expérimenté. Tu conduis un entretien de diagnostic sur le ${cropNames[answers.crop]}.
Crée toi-même UNE question courte, précise et réellement utile à partir des observations. La question doit être spécifique à cette culture, aux parties touchées, aux symptômes et aux réponses précédentes. Ne pose pas automatiquement des questions génériques sur le nombre de plants ou la durée. Ne répète aucune question déjà posée. Ne donne pas encore le diagnostic. Si aucune précision ne peut réellement distinguer les causes plausibles, mets complete=true.
OBSERVATIONS=${JSON.stringify(answers)}
QUESTIONS_DEJA_POSEES=${JSON.stringify(askedQuestionTitles)}
JSON uniquement :
{"complete":false,"reason":"utilité agronomique en moins de 160 caractères","question":{"title":"question spécifique","description":"instruction courte ou null","answerType":"single_choice|multiple_choice|free_text","options":[{"value":"code_court","label":"réponse visible"}]}}
Pour free_text, options=[]. Si complete=true, question=null.`;

  let nativeResult: NativeAiResult | null = null;
  try {
    nativeResult = isTauriApplication()
      ? await invoke<NativeAiResult>("choose_dynamic_question", {
          request: { prompt },
        })
      : await callLocalFromBrowser(prompt);
    const parsed = generatedDecisionSchema.parse(
      JSON.parse(cleanJson(nativeResult.content)),
    );
    const question = toDiagnosisQuestion(answers.crop, parsed.question);
    return {
      complete: parsed.complete,
      questionCode: question?.code ?? null,
      question,
      reason: parsed.reason,
      provider: nativeResult.provider,
      model: nativeResult.model,
      origin: "ai",
    };
  } catch (error) {
    console.warn(
      "Question IA invalide, utilisation contrôlée de la banque de secours.",
      error,
    );
    return fallbackDecision(
      answers,
      fallbackCandidates,
      askedQuestionCodes,
      nativeResult?.provider ?? "local",
      nativeResult?.model ?? LOCAL_MODEL,
    );
  }
}

export async function saveGeneratedQuestion(
  sessionId: string,
  question: DiagnosisQuestion,
  decision: DynamicQuestionDecision,
): Promise<void> {
  if (!isTauriApplication() || decision.origin !== "ai") return;
  const db = await Database.load("sqlite:agrimboa.db");
  await db.execute(
    `INSERT OR IGNORE INTO diagnosis_sessions (id,crop_id,locale,status,progress) VALUES ($1,$2,'fr','collecting',85)`,
    [sessionId, question.cropId],
  );
  await db.execute(
    `INSERT OR IGNORE INTO dynamic_questions (id,session_id,code,title,description,answer_type,options_json,reason,model_name,prompt_version,validation_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'dynamic-question-v2','accepted')`,
    [
      question.id,
      sessionId,
      question.code,
      question.titleKey,
      question.descriptionKey,
      question.answerType,
      JSON.stringify(
        question.options.map((option) => ({
          value: option.value,
          label: option.labelKey,
        })),
      ),
      decision.reason,
      decision.model,
    ],
  );
}

async function callLocalFromBrowser(prompt: string): Promise<NativeAiResult> {
  const response = await fetch(LOCAL_AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(180_000),
    body: JSON.stringify({
      model: LOCAL_MODEL,
      temperature: 0.35,
      max_tokens: 320,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Tu es un agronome. Réponds uniquement en JSON valide.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!response.ok)
    throw new Error(
      `Le moteur local a répondu avec le statut ${response.status}.`,
    );
  const payload = (await response.json()) as ChatCompletionResponse;
  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content)
    throw new Error("Le moteur local n’a retourné aucune question.");
  return { content, provider: "local", model: LOCAL_MODEL };
}
