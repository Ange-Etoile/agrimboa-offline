import { invoke } from "@tauri-apps/api/core";
import { z } from "zod";
import type {
  CalculatorAdvice,
  CalculatorDraft,
  CalculatorStep,
} from "@/features/calculators/types/calculator";
const schema = z.object({
  summary: z.string().min(1).max(360),
  checks: z.array(z.string().max(180)).max(4),
  warning: z.string().max(240).nullable(),
  nextAction: z.string().min(1).max(180),
});
interface NativeResult {
  content: string;
  provider: string;
  model: string;
}
function clean(v: string) {
  const c = v
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/i, "");
  return c.slice(c.indexOf("{"), c.lastIndexOf("}") + 1);
}
export async function getCalculatorAdvice(
  draft: CalculatorDraft,
  step: CalculatorStep,
  locale: string,
): Promise<CalculatorAdvice> {
  const prompt = `Tu es un agronome camerounais prudent. Analyse la COHERENCE d'un calcul agricole déjà effectué par des formules déterministes. Ne recalcule pas et ne prescris aucune dose. Explique simplement le résultat dans la langue ${locale}. Culture=${draft.crop}; étape=${step}; données=${JSON.stringify(draft)}. Réponds uniquement: {"summary":"...","checks":["..."],"warning":null,"nextAction":"..."}`;
  try {
    const r = await invoke<NativeResult>("generate_calculator_advice", {
      request: { prompt },
    });
    const p = schema.parse(JSON.parse(clean(r.content)));
    return { ...p, provider: r.provider, model: r.model };
  } catch {
    return {
      summary:
        "Le calcul est fondé sur les valeurs saisies et reste disponible hors ligne.",
      checks: [
        "Vérifiez les unités et les mesures.",
        "Comparez avec les pratiques adaptées à votre culture.",
      ],
      warning:
        "Cette estimation ne remplace pas l’étiquette du produit ni l’avis d’un technicien.",
      nextAction: "Enregistrez le calcul ou poursuivez vers l’étape suivante.",
      provider: "fallback",
      model: "deterministic-v1",
    };
  }
}
