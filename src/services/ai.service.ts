import {
  findRelevantGuides,
  type AgriculturalGuide,
} from "@/services/guide.service";
import type { SupportedLocale } from "@/types/preferences";

const AI_SERVER_URL = "http://127.0.0.1:11435";

const MODEL_ID =
  "Qwen/Qwen2.5-1.5B-Instruct-GGUF:Q4_K_M";

interface AiHealthResponse {
  status?: string;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;

  error?: {
    message?: string;
  };
}

export interface AgriculturalAdviceRequest {
  question: string;
  language: SupportedLocale;
  crop?: string;
}

export interface AgriculturalAdvice {
  answer: string;
  guides: AgriculturalGuide[];
  model: string;
}

export async function checkLocalAiHealth(): Promise<void> {
  let response: Response;

  try {
    response = await fetch(
      `${AI_SERVER_URL}/health`,
    );
  } catch {
    throw new Error(
      "Le moteur d’intelligence artificielle local est arrêté.",
    );
  }

  if (!response.ok) {
    throw new Error(
      "Le moteur d’intelligence artificielle ne répond pas.",
    );
  }

  const data =
    (await response.json()) as AiHealthResponse;

  if (data.status !== "ok") {
    throw new Error(
      "Le modèle d’intelligence artificielle n’est pas prêt.",
    );
  }
}

export async function generateAgriculturalAdvice(
  request: AgriculturalAdviceRequest,
): Promise<AgriculturalAdvice> {
  const question = request.question.trim();

  if (!question) {
    throw new Error(
      "La question agricole ne peut pas être vide.",
    );
  }

  await checkLocalAiHealth();

  const guides = await findRelevantGuides(
    question,
    request.crop,
  );

  if (guides.length === 0) {
    throw new Error(
      "Aucun guide agricole pertinent n’a été trouvé.",
    );
  }

  const response = await fetch(
    `${AI_SERVER_URL}/v1/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL_ID,
        temperature: 0.1,
        max_tokens: 350,
        stream: false,
        messages: [
          {
            role: "system",
            content: createSystemPrompt(
              request.language,
            ),
          },
          {
            role: "user",
            content: createUserPrompt(
              question,
              guides,
            ),
          },
        ],
      }),
    },
  );

  const data =
    (await response.json()) as ChatCompletionResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.message ??
        "Le modèle local n’a pas pu générer de réponse.",
    );
  }

  const answer =
    data.choices?.[0]?.message?.content?.trim();

  if (!answer) {
    throw new Error(
      "Le modèle local a retourné une réponse vide.",
    );
  }

  return {
    answer,
    guides,
    model: MODEL_ID,
  };
}

function createSystemPrompt(
  language: SupportedLocale,
): string {
  const languageInstruction: Record<
    SupportedLocale,
    string
  > = {
    fr: "Réponds exclusivement en français simple.",
    en: "Answer exclusively in clear English.",
    pcm: "Answer only in clear Cameroon Pidgin.",
  };

  return `
Tu es AgriMboa, un assistant agricole prudent fonctionnant hors ligne.

${languageInstruction[language]}

Règles obligatoires :
- Utilise uniquement les informations des guides fournis.
- Ne présente jamais une observation comme un diagnostic certain.
- Si les guides ne suffisent pas, dis-le clairement.
- Ne crée aucune dose de pesticide.
- Ne recommande aucun produit non mentionné dans les guides.
- Encourage la consultation d’un agent agricole en cas de doute.
- Sépare clairement : observations, vérifications et actions prudentes.
- Cite les titres des guides utilisés.
- Reste concis, clair et compréhensible.
  `.trim();
}

function createUserPrompt(
  question: string,
  guides: AgriculturalGuide[],
): string {
  const context = guides
    .map((guide, index) => {
      return `
GUIDE ${index + 1}
Titre : ${guide.title}
Culture : ${guide.crop ?? "non précisée"}
Source : ${guide.sourceName ?? "source locale"}
Contenu :
${guide.content}
      `.trim();
    })
    .join("\n\n");

  return `
QUESTION DE L’AGRICULTEUR :
${question}

GUIDES AGRICOLES DISPONIBLES :
${context}

Réponds uniquement à partir de ces guides.
  `.trim();
}