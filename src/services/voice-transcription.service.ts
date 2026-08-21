import { invoke } from "@tauri-apps/api/core";

export type TranscriptionProvider = "groq" | "local";

export interface VoiceTranscriptionResult {
  text: string;
  provider: TranscriptionProvider;
  model: string;
}

interface NativeVoiceRequest {
  audio: number[];
  language: string;
}

export async function transcribeVoice(
  audio: Blob,
  language = "fr",
): Promise<VoiceTranscriptionResult> {
  if (!("__TAURI_INTERNALS__" in window)) {
    throw new Error("La transcription hors ligne nécessite l’application Tauri.");
  }

  const bytes = Array.from(new Uint8Array(await audio.arrayBuffer()));
  if (!bytes.length) throw new Error("L’enregistrement audio est vide.");

  return invoke<VoiceTranscriptionResult>("transcribe_voice", {
    request: { audio: bytes, language } satisfies NativeVoiceRequest,
  });
}
