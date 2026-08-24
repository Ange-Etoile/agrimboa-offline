PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS calculator_projects(id TEXT PRIMARY KEY NOT NULL,name TEXT NOT NULL,crop_id TEXT NOT NULL,draft_json TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'active' CHECK(status IN('active','completed','archived')),created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_calculator_projects_updated ON calculator_projects(updated_at DESC);
CREATE TABLE IF NOT EXISTS calculator_results(id TEXT PRIMARY KEY NOT NULL,project_id TEXT NOT NULL,calculator_type TEXT NOT NULL CHECK(calculator_type IN('surface','density','seeds','inputs','summary','harvest','budget','converter')),label TEXT NOT NULL,result_text TEXT NOT NULL,input_json TEXT NOT NULL,output_json TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(project_id) REFERENCES calculator_projects(id) ON DELETE CASCADE);
CREATE INDEX IF NOT EXISTS idx_calculator_results_project ON calculator_results(project_id,created_at DESC);
CREATE TABLE IF NOT EXISTS calculator_ai_advice(id TEXT PRIMARY KEY NOT NULL,project_id TEXT NOT NULL,calculator_type TEXT NOT NULL,input_hash TEXT NOT NULL,advice_json TEXT NOT NULL,provider TEXT NOT NULL,model_name TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(project_id) REFERENCES calculator_projects(id) ON DELETE CASCADE);

