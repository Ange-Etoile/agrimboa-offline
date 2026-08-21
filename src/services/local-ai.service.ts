import { invoke } from "@tauri-apps/api/core";
import { z } from "zod";
import type { AiProvider, DiagnosisAnswers, DiagnosisQuestion, DynamicQuestionDecision } from "@/features/diagnosis/types/diagnosis";

const LOCAL_AI_URL = "http://127.0.0.1:11435/v1/chat/completions";
const LOCAL_MODEL = "Qwen2.5-3B-Instruct-GGUF";

const modelDecisionSchema = z.object({
  complete: z.boolean(),
  questionCode: z.string().nullable(),
  reason: z.string().min(1).transform((value) => value.trim().slice(0, 240)),
}).superRefine((value, context) => {
  if (!value.complete && !value.questionCode) context.addIssue({ code: "custom", message: "questionCode est requis lorsque complete vaut false." });
  if (value.complete && value.questionCode !== null) context.addIssue({ code: "custom", message: "questionCode doit être null lorsque complete vaut true." });
});

interface NativeAiResult { content: string; provider: AiProvider; model: string }
interface ChatCompletionResponse { choices?: Array<{ message?: { content?: string } }> }

export async function chooseNextDiagnosisQuestion(
  answers: DiagnosisAnswers,
  candidates: DiagnosisQuestion[],
  askedQuestionCodes: string[],
): Promise<DynamicQuestionDecision> {
  const availableQuestions = candidates
    .filter((question) => !askedQuestionCodes.includes(question.code))
    .map((question) => ({ code: question.code, title: question.titleKey, answerType: question.answerType, allowedValues: question.options.map((option) => option.value ?? option.id) }));

  if (!availableQuestions.length) {
    return { complete: true, questionCode: null, reason: "Toutes les précisions disponibles ont déjà été demandées.", provider: "local", model: LOCAL_MODEL };
  }

  const prompt = `Tu contrôles la complétude d'une observation agricole au Cameroun.
Tu ne poses pas de diagnostic et tu n'inventes aucune question.
Choisis au maximum UNE question dans QUESTIONS_AUTORISEES, seulement si l'information manque réellement.
Ne choisis jamais une question déjà posée. Si les informations suffisent, réponds complete=true.
La raison doit faire moins de 160 caractères.

REPONSES=${JSON.stringify(answers)}
QUESTIONS_DEJA_POSEES=${JSON.stringify(askedQuestionCodes)}
QUESTIONS_AUTORISEES=${JSON.stringify(availableQuestions)}

Réponds uniquement en JSON :
{"complete":false,"questionCode":"code_exact","reason":"raison courte"}
ou {"complete":true,"questionCode":null,"reason":"raison courte"}`;

  const nativeResult = isTauriApplication()
    ? await invoke<NativeAiResult>("choose_dynamic_question", { request: { prompt } })
    : await callLocalFromBrowser(prompt);

  const cleaned = nativeResult.content.trim().replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
  const parsed = modelDecisionSchema.parse(JSON.parse(cleaned));

  if (parsed.complete) {
    return { ...parsed, provider: nativeResult.provider, model: nativeResult.model };
  }

  /*
   * Un petit modèle local peut ajouter un préfixe, changer la casse ou inventer
   * un code. Le modèle ne décide jamais directement de l'objet affiché : nous
   * résolvons son choix contre la liste SQLite, puis utilisons la prochaine
   * question validée si sa sortie ne correspond à aucun code autorisé.
   */
  const requestedCode = parsed.questionCode?.trim().toLowerCase() ?? "";
  const selected = availableQuestions.find((question) =>
    question.code.toLowerCase() === requestedCode
    || requestedCode.endsWith(`_${question.code.toLowerCase()}`)
    || requestedCode.endsWith(`-${question.code.toLowerCase()}`),
  ) ?? availableQuestions[0];

  return {
    complete: false,
    questionCode: selected.code,
    reason: selected.code === parsed.questionCode
      ? parsed.reason
      : "Une précision agricole validée reste utile avant l’analyse.",
    provider: nativeResult.provider,
    model: nativeResult.model,
  };
}

function isTauriApplication(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

async function callLocalFromBrowser(prompt: string): Promise<NativeAiResult> {
  const response = await fetch(LOCAL_AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(180_000),
    body: JSON.stringify({ model: LOCAL_MODEL, temperature: 0.1, max_tokens: 120, response_format: { type: "json_object" }, messages: [
      { role: "system", content: "Réponds uniquement en JSON valide." }, { role: "user", content: prompt },
    ] }),
  });
  if (!response.ok) throw new Error(`Le moteur local a répondu avec le statut ${response.status}.`);
  const payload = await response.json() as ChatCompletionResponse;
  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Le moteur local n’a retourné aucune décision.");
  return { content, provider: "local", model: LOCAL_MODEL };
}
