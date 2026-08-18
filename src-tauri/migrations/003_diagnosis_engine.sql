PRAGMA foreign_keys = ON;

-- =========================================================
-- CULTURES
-- =========================================================

CREATE TABLE IF NOT EXISTS crops (
    id TEXT PRIMARY KEY NOT NULL,
    translation_key TEXT NOT NULL UNIQUE,
    scientific_name TEXT,
    category TEXT NOT NULL,
    image_key TEXT,
    enabled INTEGER NOT NULL DEFAULT 1,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_crops_enabled
ON crops(enabled, display_order);

-- =========================================================
-- QUESTIONS VALIDÉES
-- =========================================================

CREATE TABLE IF NOT EXISTS diagnosis_questions (
    id TEXT PRIMARY KEY NOT NULL,
    crop_id TEXT,
    code TEXT NOT NULL,
    phase TEXT NOT NULL CHECK (
        phase IN (
            'crop',
            'observations',
            'questions'
        )
    ),
    answer_type TEXT NOT NULL CHECK (
        answer_type IN (
            'single_choice',
            'multiple_choice',
            'free_text',
            'number',
            'boolean'
        )
    ),
    title_key TEXT NOT NULL,
    description_key TEXT,
    required INTEGER NOT NULL DEFAULT 1,
    allow_unknown INTEGER NOT NULL DEFAULT 0,
    allow_skip INTEGER NOT NULL DEFAULT 0,
    progress_weight INTEGER NOT NULL DEFAULT 1,
    display_order INTEGER NOT NULL DEFAULT 0,
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (crop_id)
        REFERENCES crops(id)
        ON DELETE CASCADE,

    UNIQUE(crop_id, code)
);

CREATE INDEX IF NOT EXISTS idx_diagnosis_questions_crop
ON diagnosis_questions(
    crop_id,
    enabled,
    display_order
);

-- =========================================================
-- OPTIONS DES QUESTIONS
-- =========================================================

CREATE TABLE IF NOT EXISTS diagnosis_question_options (
    id TEXT PRIMARY KEY NOT NULL,
    question_id TEXT NOT NULL,
    value TEXT NOT NULL,
    label_key TEXT NOT NULL,
    image_key TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    enabled INTEGER NOT NULL DEFAULT 1,
    metadata_json TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (question_id)
        REFERENCES diagnosis_questions(id)
        ON DELETE CASCADE,

    UNIQUE(question_id, value)
);

CREATE INDEX IF NOT EXISTS idx_question_options_question
ON diagnosis_question_options(
    question_id,
    enabled,
    display_order
);

-- =========================================================
-- RÈGLES CONDITIONNELLES
-- =========================================================

CREATE TABLE IF NOT EXISTS diagnosis_question_rules (
    id TEXT PRIMARY KEY NOT NULL,
    crop_id TEXT NOT NULL,
    source_question_code TEXT NOT NULL,
    operator TEXT NOT NULL CHECK (
        operator IN (
            'equals',
            'not_equals',
            'contains',
            'contains_any',
            'contains_all',
            'is_empty',
            'is_not_empty'
        )
    ),
    expected_value_json TEXT,
    next_question_code TEXT NOT NULL,
    priority INTEGER NOT NULL DEFAULT 0,
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (crop_id)
        REFERENCES crops(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_question_rules_crop
ON diagnosis_question_rules(
    crop_id,
    enabled,
    priority DESC
);

-- =========================================================
-- CONSULTATIONS
-- =========================================================

CREATE TABLE IF NOT EXISTS diagnosis_sessions (
    id TEXT PRIMARY KEY NOT NULL,
    crop_id TEXT,
    locale TEXT NOT NULL DEFAULT 'fr',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (
        status IN (
            'draft',
            'collecting',
            'analyzing',
            'completed',
            'failed',
            'cancelled'
        )
    ),
    current_question_code TEXT,
    progress INTEGER NOT NULL DEFAULT 0 CHECK (
        progress >= 0 AND progress <= 100
    ),
    started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT,

    FOREIGN KEY (crop_id)
        REFERENCES crops(id)
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_diagnosis_sessions_status
ON diagnosis_sessions(status, updated_at DESC);

-- =========================================================
-- RÉPONSES
-- =========================================================

CREATE TABLE IF NOT EXISTS diagnosis_answers (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL,
    question_code TEXT NOT NULL,
    answer_type TEXT NOT NULL,
    value_json TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'user' CHECK (
        source IN (
            'user',
            'voice',
            'inferred',
            'system'
        )
    ),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id)
        REFERENCES diagnosis_sessions(id)
        ON DELETE CASCADE,

    UNIQUE(session_id, question_code)
);

CREATE INDEX IF NOT EXISTS idx_diagnosis_answers_session
ON diagnosis_answers(session_id, created_at);

-- =========================================================
-- QUESTIONS DYNAMIQUES PRODUITES PAR L’IA
-- =========================================================

CREATE TABLE IF NOT EXISTS dynamic_questions (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    answer_type TEXT NOT NULL CHECK (
        answer_type IN (
            'single_choice',
            'multiple_choice',
            'free_text',
            'boolean'
        )
    ),
    options_json TEXT,
    reason TEXT NOT NULL,
    model_name TEXT NOT NULL,
    prompt_version TEXT NOT NULL,
    validation_status TEXT NOT NULL CHECK (
        validation_status IN (
            'accepted',
            'rejected',
            'fallback'
        )
    ),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id)
        REFERENCES diagnosis_sessions(id)
        ON DELETE CASCADE,

    UNIQUE(session_id, code)
);

CREATE INDEX IF NOT EXISTS idx_dynamic_questions_session
ON dynamic_questions(session_id, created_at);

-- =========================================================
-- NOTES VOCALES
-- =========================================================

CREATE TABLE IF NOT EXISTS diagnosis_voice_notes (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL,
    audio_path TEXT NOT NULL,
    audio_format TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    language TEXT NOT NULL DEFAULT 'fr',
    transcription TEXT,
    corrected_transcription TEXT,
    transcription_status TEXT NOT NULL DEFAULT 'pending' CHECK (
        transcription_status IN (
            'pending',
            'transcribing',
            'completed',
            'failed'
        )
    ),
    transcription_model TEXT,
    error_message TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id)
        REFERENCES diagnosis_sessions(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_voice_notes_session
ON diagnosis_voice_notes(
    session_id,
    created_at
);

-- =========================================================
-- RÉSULTATS
-- =========================================================

CREATE TABLE IF NOT EXISTS diagnosis_results (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    possible_causes_json TEXT NOT NULL,
    recommendations_json TEXT NOT NULL,
    warning_signs_json TEXT NOT NULL,
    guide_sources_json TEXT NOT NULL,
    confidence TEXT NOT NULL CHECK (
        confidence IN (
            'low',
            'medium',
            'high'
        )
    ),
    model_name TEXT NOT NULL,
    prompt_version TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id)
        REFERENCES diagnosis_sessions(id)
        ON DELETE CASCADE
);

-- =========================================================
-- JOURNAL DES APPELS IA
-- =========================================================

CREATE TABLE IF NOT EXISTS ai_generation_events (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT,
    event_type TEXT NOT NULL CHECK (
        event_type IN (
            'dynamic_question',
            'diagnosis',
            'summary',
            'transcription'
        )
    ),
    model_name TEXT NOT NULL,
    prompt_version TEXT NOT NULL,
    input_json TEXT NOT NULL,
    output_json TEXT,
    status TEXT NOT NULL CHECK (
        status IN (
            'started',
            'completed',
            'failed',
            'rejected'
        )
    ),
    duration_ms INTEGER,
    error_message TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id)
        REFERENCES diagnosis_sessions(id)
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_events_session
ON ai_generation_events(
    session_id,
    created_at DESC
);