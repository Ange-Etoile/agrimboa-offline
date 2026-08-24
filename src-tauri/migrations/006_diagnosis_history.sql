PRAGMA foreign_keys = ON;

ALTER TABLE diagnosis_sessions ADD COLUMN next_follow_up_at TEXT;
ALTER TABLE diagnosis_results ADD COLUMN result_json TEXT;

CREATE TABLE IF NOT EXISTS diagnosis_follow_ups (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL,
    evolution TEXT NOT NULL CHECK (evolution IN ('improving', 'stable', 'worsening')),
    extent TEXT,
    note TEXT NOT NULL DEFAULT '',
    photo_path TEXT,
    actions_completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES diagnosis_sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_diagnosis_follow_ups_session
ON diagnosis_follow_ups(session_id, created_at DESC);
