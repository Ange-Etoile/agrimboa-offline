PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS app_resources (
    id TEXT PRIMARY KEY NOT NULL,
    resource_type TEXT NOT NULL,
    name TEXT NOT NULL,
    version TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    local_path TEXT,
    size_bytes INTEGER NOT NULL DEFAULT 0,
    checksum TEXT,
    installed_at TEXT,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agricultural_guides (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    language TEXT NOT NULL DEFAULT 'fr',
    crop TEXT,
    category TEXT,
    source_name TEXT,
    source_url TEXT,
    content TEXT NOT NULL,
    is_available_offline INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consultations (
    id TEXT PRIMARY KEY NOT NULL,
    language TEXT NOT NULL DEFAULT 'fr',
    crop TEXT,
    description TEXT NOT NULL,
    diagnosis TEXT,
    recommendations TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_guides_language
ON agricultural_guides(language);

CREATE INDEX IF NOT EXISTS idx_guides_crop
ON agricultural_guides(crop);

CREATE INDEX IF NOT EXISTS idx_consultations_created_at
ON consultations(created_at);

INSERT OR IGNORE INTO app_resources (
    id,
    resource_type,
    name,
    version,
    status
)
VALUES (
    'local-storage',
    'storage',
    'Stockage local AgriMboa',
    '1',
    'ready'
);

INSERT OR IGNORE INTO app_resources (
    id,
    resource_type,
    name,
    version,
    status
)
VALUES (
    'agricultural-guides',
    'guides',
    'Guides agricoles',
    '1',
    'pending'
);

INSERT OR IGNORE INTO app_resources (
    id,
    resource_type,
    name,
    version,
    status
)
VALUES (
    'local-ai-model',
    'model',
    'Modèle local AgriMboa',
    '1',
    'pending'
);