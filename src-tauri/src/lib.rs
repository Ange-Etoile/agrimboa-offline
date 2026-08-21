use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{env, fs, process::Command, time::Duration};
use tauri_plugin_sql::{Migration, MigrationKind};

const GROQ_URL: &str = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL: &str = "qwen/qwen3.6-27b";
const LOCAL_URL: &str = "http://127.0.0.1:11435/v1/chat/completions";
const LOCAL_MODEL: &str = "Qwen2.5-3B-Instruct-GGUF";
const GROQ_TRANSCRIPTION_URL: &str = "https://api.groq.com/openai/v1/audio/transcriptions";
const GROQ_WHISPER_MODEL: &str = "whisper-large-v3-turbo";
const LOCAL_WHISPER_MODEL: &str = "whisper.cpp-base";

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct DynamicQuestionRequest {
    prompt: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct DynamicQuestionResponse {
    content: String,
    provider: String,
    model: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct DiagnosisGenerationRequest { prompt: String }

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct VoiceTranscriptionRequest {
    audio: Vec<u8>,
    language: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct VoiceTranscriptionResponse {
    text: String,
    provider: String,
    model: String,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn choose_dynamic_question(
    request: DynamicQuestionRequest,
) -> Result<DynamicQuestionResponse, String> {
    let client = reqwest::Client::builder()
        .connect_timeout(Duration::from_secs(8))
        .build()
        .map_err(|error| format!("Impossible de préparer le client IA : {error}"))?;

    let groq_key = env::var("GROQ_API_KEY")
        .ok()
        .filter(|value| !value.trim().is_empty());

    let mut groq_error = String::from("clé GROQ_API_KEY non configurée");

    if let Some(api_key) = groq_key {
        match call_groq(&client, &api_key, &request.prompt).await {
            Ok(content) => {
                return Ok(DynamicQuestionResponse {
                    content,
                    provider: "groq".to_string(),
                    model: GROQ_MODEL.to_string(),
                });
            }
            Err(error) => {
                groq_error = error;
            }
        }
    }

    match call_local(&client, &request.prompt).await {
        Ok(content) => Ok(DynamicQuestionResponse {
            content,
            provider: "local".to_string(),
            model: LOCAL_MODEL.to_string(),
        }),
        Err(local_error) => Err(format!(
            "Groq indisponible ({groq_error}). Moteur local indisponible ({local_error})."
        )),
    }
}

#[tauri::command]
async fn generate_diagnosis(
    request: DiagnosisGenerationRequest,
) -> Result<DynamicQuestionResponse, String> {
    let client = reqwest::Client::builder()
        .connect_timeout(Duration::from_secs(8))
        .build()
        .map_err(|error| format!("Impossible de préparer le client IA : {error}"))?;
    let mut online_error = "clé GROQ_API_KEY non configurée".to_string();
    if let Some(key) = env::var("GROQ_API_KEY").ok().filter(|v| !v.trim().is_empty()) {
        match call_model(&client, GROQ_URL, Some(&key), GROQ_MODEL, &request.prompt, 1400, 55).await {
            Ok(content) => return Ok(DynamicQuestionResponse { content, provider: "groq".into(), model: GROQ_MODEL.into() }),
            Err(error) => online_error = error,
        }
    }
    call_model(&client, LOCAL_URL, None, LOCAL_MODEL, &request.prompt, 900, 300).await
        .map(|content| DynamicQuestionResponse { content, provider: "local".into(), model: LOCAL_MODEL.into() })
        .map_err(|local| format!("Groq indisponible ({online_error}). Moteur local indisponible ({local})."))
}

async fn call_model(client: &reqwest::Client, url: &str, key: Option<&str>, model: &str, prompt: &str, max_tokens: u32, timeout: u64) -> Result<String, String> {
    let body = json!({ "model": model, "temperature": 0.15, "max_tokens": max_tokens, "response_format": {"type":"json_object"}, "messages": [
        {"role":"system","content":"Tu es un assistant agronomique prudent. Réponds uniquement avec un objet JSON valide, sans markdown."},
        {"role":"user","content":prompt}
    ]});
    let mut request = client.post(url).json(&body).timeout(Duration::from_secs(timeout));
    if let Some(token) = key { request = request.bearer_auth(token); }
    let response = request.send().await.map_err(|e| format!("connexion impossible : {e}"))?;
    let status = response.status();
    let payload: Value = response.json().await.map_err(|e| format!("réponse illisible : {e}"))?;
    if !status.is_success() { return Err(format!("HTTP {} : {}", status.as_u16(), payload.pointer("/error/message").and_then(Value::as_str).unwrap_or("erreur sans détail"))); }
    extract_content(&payload).ok_or_else(|| "réponse vide".to_string())
}

#[tauri::command]
async fn transcribe_voice(
    request: VoiceTranscriptionRequest,
) -> Result<VoiceTranscriptionResponse, String> {
    if request.audio.len() < 44 {
        return Err("L’enregistrement WAV est vide ou invalide.".to_string());
    }

    let language = match request.language.as_str() {
        "en" => "en",
        "fr" => "fr",
        _ => "auto",
    };

    let client = reqwest::Client::builder()
        .connect_timeout(Duration::from_secs(8))
        .build()
        .map_err(|error| format!("Impossible de préparer Whisper : {error}"))?;

    let mut groq_error = String::from("clé GROQ_API_KEY non configurée");

    if let Some(api_key) = env::var("GROQ_API_KEY")
        .ok()
        .filter(|value| !value.trim().is_empty())
    {
        match transcribe_with_groq(&client, &api_key, &request.audio, language).await {
            Ok(text) => {
                return Ok(VoiceTranscriptionResponse {
                    text,
                    provider: "groq".to_string(),
                    model: GROQ_WHISPER_MODEL.to_string(),
                });
            }
            Err(error) => groq_error = error,
        }
    }

    match transcribe_with_local_whisper(request.audio, language.to_string()).await {
        Ok(text) => Ok(VoiceTranscriptionResponse {
            text,
            provider: "local".to_string(),
            model: LOCAL_WHISPER_MODEL.to_string(),
        }),
        Err(local_error) => Err(format!(
            "Whisper Groq indisponible ({groq_error}). Whisper local indisponible ({local_error})."
        )),
    }
}

async fn transcribe_with_groq(
    client: &reqwest::Client,
    api_key: &str,
    audio: &[u8],
    language: &str,
) -> Result<String, String> {
    let audio_part = reqwest::multipart::Part::bytes(audio.to_vec())
        .file_name("agrimboa-observation.wav")
        .mime_str("audio/wav")
        .map_err(|error| format!("audio invalide : {error}"))?;

    let mut form = reqwest::multipart::Form::new()
        .part("file", audio_part)
        .text("model", GROQ_WHISPER_MODEL.to_string())
        .text("response_format", "json".to_string())
        .text("temperature", "0".to_string());

    if language != "auto" {
        form = form.text("language", language.to_string());
    }

    let response = client
        .post(GROQ_TRANSCRIPTION_URL)
        .bearer_auth(api_key)
        .multipart(form)
        .timeout(Duration::from_secs(45))
        .send()
        .await
        .map_err(|error| format!("connexion impossible : {error}"))?;

    let status = response.status();
    let payload: Value = response
        .json()
        .await
        .map_err(|error| format!("réponse illisible : {error}"))?;

    if !status.is_success() {
        let message = payload
            .pointer("/error/message")
            .and_then(Value::as_str)
            .unwrap_or("erreur Groq sans détail");
        return Err(format!("HTTP {} : {}", status.as_u16(), message));
    }

    payload
        .get("text")
        .and_then(Value::as_str)
        .map(str::trim)
        .filter(|text| !text.is_empty())
        .map(ToOwned::to_owned)
        .ok_or_else(|| "transcription Groq vide".to_string())
}

async fn transcribe_with_local_whisper(
    audio: Vec<u8>,
    language: String,
) -> Result<String, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let cli_path = env::var("WHISPER_CLI_PATH")
            .map_err(|_| "variable WHISPER_CLI_PATH non configurée".to_string())?;
        let model_path = env::var("WHISPER_MODEL_PATH")
            .map_err(|_| "variable WHISPER_MODEL_PATH non configurée".to_string())?;

        if !std::path::Path::new(&cli_path).is_file() {
            return Err(format!("whisper-cli introuvable : {cli_path}"));
        }
        if !std::path::Path::new(&model_path).is_file() {
            return Err(format!("modèle Whisper introuvable : {model_path}"));
        }

        let identifier = uuid::Uuid::new_v4();
        let temp_directory = env::temp_dir();
        let audio_path = temp_directory.join(format!("agrimboa-{identifier}.wav"));
        let output_prefix = temp_directory.join(format!("agrimboa-{identifier}-transcript"));
        let transcript_path = output_prefix.with_extension("txt");

        fs::write(&audio_path, audio)
            .map_err(|error| format!("impossible d’écrire l’audio temporaire : {error}"))?;

        let result = Command::new(&cli_path)
            .arg("-m")
            .arg(&model_path)
            .arg("-f")
            .arg(&audio_path)
            .arg("-l")
            .arg(&language)
            .arg("-nt")
            .arg("-otxt")
            .arg("-of")
            .arg(&output_prefix)
            .output();

        let transcription = match result {
            Ok(output) if output.status.success() => fs::read_to_string(&transcript_path)
                .map(|text| text.trim().to_string())
                .map_err(|error| format!("transcription locale introuvable : {error}")),
            Ok(output) => Err(format!(
                "whisper-cli a échoué : {}",
                String::from_utf8_lossy(&output.stderr).trim()
            )),
            Err(error) => Err(format!("impossible de lancer whisper-cli : {error}")),
        };

        let _ = fs::remove_file(&audio_path);
        let _ = fs::remove_file(&transcript_path);

        let text = transcription?;
        if text.is_empty() {
            return Err("Whisper local n’a détecté aucun texte.".to_string());
        }
        Ok(text)
    })
    .await
    .map_err(|error| format!("tâche Whisper interrompue : {error}"))?
}

async fn call_groq(
    client: &reqwest::Client,
    api_key: &str,
    prompt: &str,
) -> Result<String, String> {
    let body = json!({
        "model": GROQ_MODEL,
        "temperature": 0.1,
        "max_completion_tokens": 160,
        "reasoning_effort": "none",
        "response_format": { "type": "json_object" },
        "messages": [
            { "role": "system", "content": "Tu réponds uniquement avec un objet JSON valide et concis." },
            { "role": "user", "content": prompt }
        ]
    });

    let response = client
        .post(GROQ_URL)
        .bearer_auth(api_key)
        .json(&body)
        .timeout(Duration::from_secs(25))
        .send()
        .await
        .map_err(|error| format!("connexion impossible : {error}"))?;

    let status = response.status();
    let payload: Value = response
        .json()
        .await
        .map_err(|error| format!("réponse illisible : {error}"))?;

    if !status.is_success() {
        let message = payload
            .pointer("/error/message")
            .and_then(Value::as_str)
            .unwrap_or("erreur Groq sans détail");
        return Err(format!("HTTP {} : {}", status.as_u16(), message));
    }

    let content = extract_content(&payload)
        .ok_or_else(|| "réponse Groq vide".to_string())?;

    validate_decision_content(&content)
        .map_err(|error| format!("réponse Groq invalide : {error}"))?;

    Ok(content)
}

async fn call_local(
    client: &reqwest::Client,
    prompt: &str,
) -> Result<String, String> {
    let body = json!({
        "model": LOCAL_MODEL,
        "temperature": 0.1,
        "max_tokens": 120,
        "response_format": { "type": "json_object" },
        "messages": [
            { "role": "system", "content": "Tu réponds uniquement avec un objet JSON valide et concis." },
            { "role": "user", "content": prompt }
        ]
    });

    let response = client
        .post(LOCAL_URL)
        .json(&body)
        .timeout(Duration::from_secs(180))
        .send()
        .await
        .map_err(|error| format!("connexion impossible : {error}"))?;

    let status = response.status();
    let payload: Value = response
        .json()
        .await
        .map_err(|error| format!("réponse illisible : {error}"))?;

    if !status.is_success() {
        return Err(format!("HTTP {}", status.as_u16()));
    }

    extract_content(&payload).ok_or_else(|| "réponse locale vide".to_string())
}

fn extract_content(payload: &Value) -> Option<String> {
    payload
        .pointer("/choices/0/message/content")
        .and_then(Value::as_str)
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(ToOwned::to_owned)
}

fn validate_decision_content(content: &str) -> Result<(), String> {
    let cleaned = content
        .trim()
        .strip_prefix("```json")
        .unwrap_or(content.trim())
        .strip_suffix("```")
        .unwrap_or(content.trim())
        .trim();

    let value: Value = serde_json::from_str(cleaned)
        .map_err(|error| error.to_string())?;

    let complete = value
        .get("complete")
        .and_then(Value::as_bool)
        .ok_or_else(|| "champ complete manquant".to_string())?;

    if value.get("reason").and_then(Value::as_str).is_none() {
        return Err("champ reason manquant".to_string());
    }

    let question_code = value.get("questionCode");
    if complete && !matches!(question_code, None | Some(Value::Null)) {
        return Err("questionCode doit être null lorsque complete vaut true".to_string());
    }
    if !complete && question_code.and_then(Value::as_str).is_none() {
        return Err("questionCode est requis lorsque complete vaut false".to_string());
    }

    Ok(())
}

fn database_migrations() -> Vec<Migration> {
    vec![
        Migration { version: 1, description: "create_initial_agrimboa_schema", sql: include_str!("../migrations/001_initial_schema.sql"), kind: MigrationKind::Up },
        Migration { version: 2, description: "seed_agricultural_guides", sql: include_str!("../migrations/002_seed_agricultural_guides.sql"), kind: MigrationKind::Up },
        Migration { version: 3, description: "create_diagnosis_engine", sql: include_str!("../migrations/003_diagnosis_engine.sql"), kind: MigrationKind::Up },
        Migration { version: 4, description: "seed_mvp_question_banks", sql: include_str!("../migrations/004_seed_mvp_question_banks.sql"), kind: MigrationKind::Up },
        Migration { version: 5, description: "seed_follow_up_questions", sql: include_str!("../migrations/005_seed_follow_up_questions.sql"), kind: MigrationKind::Up },
    ]
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = database_migrations();
    let sql_plugin = tauri_plugin_sql::Builder::default()
        .add_migrations("sqlite:agrimboa.db", migrations)
        .build();

    tauri::Builder::default()
        .plugin(sql_plugin)
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_log::Builder::new().level(tauri_plugin_log::log::LevelFilter::Info).build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            choose_dynamic_question,
            generate_diagnosis,
            transcribe_voice
        ])
        .run(tauri::generate_context!())
        .expect("error while running AgriMboa Offline");
}
