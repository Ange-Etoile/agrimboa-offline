use tauri_plugin_sql::{
    Migration,
    MigrationKind,
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!(
        "Hello, {}! You've been greeted from Rust!",
        name
    )
}

fn database_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create_initial_agrimboa_schema",
            sql: include_str!(
                "../migrations/001_initial_schema.sql"
            ),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "seed_agricultural_guides",
            sql: include_str!(
                "../migrations/002_seed_agricultural_guides.sql"
            ),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_diagnosis_engine",
            sql: include_str!(
                "../migrations/003_diagnosis_engine.sql"
            ),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "seed_mvp_question_banks",
            sql: include_str!(
                "../migrations/004_seed_mvp_question_banks.sql"
            ),
            kind: MigrationKind::Up,
        },
    ]
}

#[cfg_attr(
    mobile,
    tauri::mobile_entry_point
)]
pub fn run() {
    let migrations = database_migrations();

    let sql_plugin =
        tauri_plugin_sql::Builder::default()
            .add_migrations(
                "sqlite:agrimboa.db",
                migrations,
            )
            .build();

    tauri::Builder::default()
        /*
         * Base SQLite locale :
         * cultures, questions, réponses,
         * guides, consultations et résultats.
         */
        .plugin(sql_plugin)

        /*
         * Permettra de lancer les moteurs
         * locaux llama.cpp et whisper.cpp
         * comme sidecars sur desktop.
         */
        .plugin(tauri_plugin_shell::init())

        /*
         * Journalisation locale.
         */
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(
                    tauri_plugin_log::log::LevelFilter::Info,
                )
                .build(),
        )

        /*
         * Plugins natifs AgriMboa.
         */
        .plugin(
            tauri_plugin_notification::init(),
        )
        .plugin(
            tauri_plugin_dialog::init(),
        )
        .plugin(
            tauri_plugin_fs::init(),
        )
        .plugin(
            tauri_plugin_store::Builder::new()
                .build(),
        )
        .plugin(
            tauri_plugin_opener::init(),
        )

        /*
         * Les futures commandes Rust seront
         * ajoutées ici :
         *
         * - créer une consultation ;
         * - enregistrer une réponse ;
         * - générer une question dynamique ;
         * - transcrire un fichier audio ;
         * - produire un résultat.
         */
        .invoke_handler(
            tauri::generate_handler![
                greet,
            ],
        )
        .run(
            tauri::generate_context!(),
        )
        .expect(
            "error while running AgriMboa Offline",
        );
}