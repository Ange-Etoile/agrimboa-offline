PRAGMA foreign_keys = ON;

-- Questions complémentaires communes. crop_id NULL signifie qu'elles sont
-- disponibles pour toutes les cultures. Qwen choisit uniquement dans cette banque.
INSERT OR IGNORE INTO diagnosis_questions
(id, crop_id, code, phase, answer_type, title_key, description_key, required, allow_unknown, allow_skip, progress_weight, display_order, enabled)
VALUES
('follow-up-extent', NULL, 'extent', 'questions', 'single_choice',
 'Quelle proportion de vos plants semble touchée ?',
 'Donnez une estimation, même approximative.', 1, 1, 0, 5, 1, 1),
('follow-up-onset', NULL, 'onset', 'questions', 'single_choice',
 'Depuis quand avez-vous remarqué ce problème ?',
 'Cette information aide à comprendre l’évolution du problème.', 1, 1, 0, 5, 2, 1),
('follow-up-progression', NULL, 'progression', 'questions', 'single_choice',
 'Comment le problème évolue-t-il ?',
 'Indiquez si la situation reste stable ou s’aggrave.', 1, 1, 0, 5, 3, 1),
('follow-up-distribution', NULL, 'distribution_pattern', 'questions', 'single_choice',
 'Comment les plants atteints sont-ils répartis dans la parcelle ?',
 'Observez s’ils sont regroupés ou dispersés.', 1, 1, 0, 5, 4, 1),
('follow-up-weather', NULL, 'recent_weather', 'questions', 'single_choice',
 'Quel temps a principalement précédé l’apparition du problème ?',
 'Pensez aux derniers jours avant les premiers signes.', 1, 1, 0, 5, 5, 1),
('follow-up-pests', NULL, 'visible_pests', 'questions', 'single_choice',
 'Avez-vous vu des insectes, des larves ou leurs traces ?',
 'Regardez aussi sous les feuilles et près des parties abîmées.', 1, 1, 0, 5, 6, 1);

INSERT OR IGNORE INTO diagnosis_question_options
(id, question_id, value, label_key, display_order, enabled)
VALUES
('extent-one', 'follow-up-extent', 'one_plant', 'Un seul plant', 1, 1),
('extent-few', 'follow-up-extent', 'few_plants', 'Quelques plants', 2, 1),
('extent-area', 'follow-up-extent', 'small_area', 'Une petite zone', 3, 1),
('extent-several', 'follow-up-extent', 'several_areas', 'Plusieurs zones', 4, 1),
('extent-most', 'follow-up-extent', 'almost_field', 'Presque toute la parcelle', 5, 1),
('extent-unknown', 'follow-up-extent', 'unknown', 'Je ne sais pas', 6, 1),
('onset-today', 'follow-up-onset', 'today', 'Aujourd’hui', 1, 1),
('onset-days', 'follow-up-onset', 'few_days', 'Depuis quelques jours', 2, 1),
('onset-week', 'follow-up-onset', 'one_two_weeks', 'Depuis une à deux semaines', 3, 1),
('onset-month', 'follow-up-onset', 'more_than_month', 'Depuis plus d’un mois', 4, 1),
('onset-unknown', 'follow-up-onset', 'unknown', 'Je ne sais pas', 5, 1),
('progression-stable', 'follow-up-progression', 'stable', 'Cela reste stable', 1, 1),
('progression-slow', 'follow-up-progression', 'slow', 'Cela s’aggrave lentement', 2, 1),
('progression-fast', 'follow-up-progression', 'fast', 'Cela s’aggrave rapidement', 3, 1),
('progression-improving', 'follow-up-progression', 'improving', 'Cela semble s’améliorer', 4, 1),
('progression-unknown', 'follow-up-progression', 'unknown', 'Je ne sais pas', 5, 1),
('distribution-one', 'follow-up-distribution', 'isolated', 'Un plant isolé', 1, 1),
('distribution-grouped', 'follow-up-distribution', 'grouped', 'Des plants regroupés', 2, 1),
('distribution-lines', 'follow-up-distribution', 'rows', 'Le long de certaines lignes', 3, 1),
('distribution-scattered', 'follow-up-distribution', 'scattered', 'Dispersés dans la parcelle', 4, 1),
('distribution-edge', 'follow-up-distribution', 'edges', 'Surtout sur les bordures', 5, 1),
('distribution-unknown', 'follow-up-distribution', 'unknown', 'Je ne sais pas', 6, 1),
('weather-rain', 'follow-up-weather', 'heavy_rain', 'Fortes pluies ou sol très humide', 1, 1),
('weather-dry', 'follow-up-weather', 'dry_heat', 'Sécheresse ou forte chaleur', 2, 1),
('weather-normal', 'follow-up-weather', 'normal', 'Temps habituel', 3, 1),
('weather-change', 'follow-up-weather', 'sudden_change', 'Changement brusque de temps', 4, 1),
('weather-unknown', 'follow-up-weather', 'unknown', 'Je ne sais pas', 5, 1),
('pests-yes', 'follow-up-pests', 'yes', 'Oui', 1, 1),
('pests-no', 'follow-up-pests', 'no', 'Non', 2, 1),
('pests-traces', 'follow-up-pests', 'traces_only', 'Seulement des traces ou déjections', 3, 1),
('pests-unknown', 'follow-up-pests', 'unknown', 'Je ne sais pas', 4, 1);
