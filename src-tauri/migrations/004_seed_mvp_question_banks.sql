PRAGMA foreign_keys = ON;

-- =========================================================
-- CULTURES DU MVP
-- =========================================================

INSERT OR IGNORE INTO crops (
    id,
    translation_key,
    scientific_name,
    category,
    image_key,
    enabled,
    display_order
) VALUES
(
    'maize',
    'diagnosis.crop.maize',
    'Zea mays',
    'cereal',
    'crop-maize',
    1,
    1
),
(
    'cassava',
    'diagnosis.crop.cassava',
    'Manihot esculenta',
    'root_and_tuber',
    'crop-cassava',
    1,
    2
),
(
    'tomato',
    'diagnosis.crop.tomato',
    'Solanum lycopersicum',
    'vegetable',
    'crop-tomato',
    1,
    3
),
(
    'plantain',
    'diagnosis.crop.plantain',
    'Musa paradisiaca',
    'fruit',
    'crop-plantain',
    1,
    4
);

-- =========================================================
-- QUESTIONS : PARTIE TOUCHÉE
-- =========================================================

INSERT OR IGNORE INTO diagnosis_questions (
    id,
    crop_id,
    code,
    phase,
    answer_type,
    title_key,
    description_key,
    required,
    allow_unknown,
    allow_skip,
    progress_weight,
    display_order,
    enabled
) VALUES
(
    'maize-plant-part',
    'maize',
    'plant_part',
    'observations',
    'multiple_choice',
    'diagnosis.plantPart.maize.title',
    'diagnosis.plantPart.commonDescription',
    1,
    1,
    0,
    20,
    1,
    1
),
(
    'cassava-plant-part',
    'cassava',
    'plant_part',
    'observations',
    'multiple_choice',
    'diagnosis.plantPart.cassava.title',
    'diagnosis.plantPart.commonDescription',
    1,
    1,
    0,
    20,
    1,
    1
),
(
    'tomato-plant-part',
    'tomato',
    'plant_part',
    'observations',
    'multiple_choice',
    'diagnosis.plantPart.tomato.title',
    'diagnosis.plantPart.commonDescription',
    1,
    1,
    0,
    20,
    1,
    1
),
(
    'plantain-plant-part',
    'plantain',
    'plant_part',
    'observations',
    'multiple_choice',
    'diagnosis.plantPart.plantain.title',
    'diagnosis.plantPart.commonDescription',
    1,
    1,
    0,
    20,
    1,
    1
);

-- =========================================================
-- OPTIONS : PARTIES DU MAÏS
-- Ordre des images dans maize/parts-sheet.png
-- =========================================================

INSERT OR IGNORE INTO diagnosis_question_options (
    id,
    question_id,
    value,
    label_key,
    image_key,
    display_order
) VALUES
(
    'maize-part-leaves',
    'maize-plant-part',
    'leaves',
    'diagnosis.parts.leaves',
    'maize.parts.0',
    1
),
(
    'maize-part-stem',
    'maize-plant-part',
    'stem',
    'diagnosis.parts.stem',
    'maize.parts.1',
    2
),
(
    'maize-part-roots',
    'maize-plant-part',
    'roots',
    'diagnosis.parts.roots',
    'maize.parts.2',
    3
),
(
    'maize-part-ears',
    'maize-plant-part',
    'ears',
    'diagnosis.parts.ears',
    'maize.parts.3',
    4
),
(
    'maize-part-whole',
    'maize-plant-part',
    'whole_plant',
    'diagnosis.parts.wholePlant',
    'maize.parts.4',
    5
),
(
    'maize-part-unknown',
    'maize-plant-part',
    'unknown',
    'diagnosis.parts.unknown',
    'maize.parts.5',
    6
);

-- =========================================================
-- OPTIONS : PARTIES DU MANIOC
-- =========================================================

INSERT OR IGNORE INTO diagnosis_question_options (
    id,
    question_id,
    value,
    label_key,
    image_key,
    display_order
) VALUES
(
    'cassava-part-leaves',
    'cassava-plant-part',
    'leaves',
    'diagnosis.parts.leaves',
    'cassava.parts.0',
    1
),
(
    'cassava-part-stem',
    'cassava-plant-part',
    'stem',
    'diagnosis.parts.stems',
    'cassava.parts.1',
    2
),
(
    'cassava-part-roots',
    'cassava-plant-part',
    'tuberous_roots',
    'diagnosis.parts.tuberousRoots',
    'cassava.parts.2',
    3
),
(
    'cassava-part-collar',
    'cassava-plant-part',
    'collar',
    'diagnosis.parts.collar',
    'cassava.parts.3',
    4
),
(
    'cassava-part-whole',
    'cassava-plant-part',
    'whole_plant',
    'diagnosis.parts.wholePlant',
    'cassava.parts.4',
    5
),
(
    'cassava-part-unknown',
    'cassava-plant-part',
    'unknown',
    'diagnosis.parts.unknown',
    'cassava.parts.5',
    6
);

-- =========================================================
-- OPTIONS : PARTIES DE LA TOMATE
-- =========================================================

INSERT OR IGNORE INTO diagnosis_question_options (
    id,
    question_id,
    value,
    label_key,
    image_key,
    display_order
) VALUES
(
    'tomato-part-leaves',
    'tomato-plant-part',
    'leaves',
    'diagnosis.parts.leaves',
    'tomato.parts.0',
    1
),
(
    'tomato-part-stem',
    'tomato-plant-part',
    'stem',
    'diagnosis.parts.stems',
    'tomato.parts.1',
    2
),
(
    'tomato-part-roots',
    'tomato-plant-part',
    'roots',
    'diagnosis.parts.roots',
    'tomato.parts.2',
    3
),
(
    'tomato-part-flowers',
    'tomato-plant-part',
    'flowers',
    'diagnosis.parts.flowers',
    'tomato.parts.3',
    4
),
(
    'tomato-part-fruits',
    'tomato-plant-part',
    'fruits',
    'diagnosis.parts.fruits',
    'tomato.parts.4',
    5
),
(
    'tomato-part-whole',
    'tomato-plant-part',
    'whole_plant',
    'diagnosis.parts.wholePlant',
    'tomato.parts.5',
    6
);

-- =========================================================
-- OPTIONS : PARTIES DU PLANTAIN
-- =========================================================

INSERT OR IGNORE INTO diagnosis_question_options (
    id,
    question_id,
    value,
    label_key,
    image_key,
    display_order
) VALUES
(
    'plantain-part-leaves',
    'plantain-plant-part',
    'leaves',
    'diagnosis.parts.leaves',
    'plantain.parts.0',
    1
),
(
    'plantain-part-pseudostem',
    'plantain-plant-part',
    'pseudostem',
    'diagnosis.parts.pseudostem',
    'plantain.parts.1',
    2
),
(
    'plantain-part-corm',
    'plantain-plant-part',
    'corm',
    'diagnosis.parts.corm',
    'plantain.parts.2',
    3
),
(
    'plantain-part-flower',
    'plantain-plant-part',
    'inflorescence',
    'diagnosis.parts.inflorescence',
    'plantain.parts.3',
    4
),
(
    'plantain-part-bunch',
    'plantain-plant-part',
    'fruit_bunch',
    'diagnosis.parts.fruitBunch',
    'plantain.parts.4',
    5
),
(
    'plantain-part-whole',
    'plantain-plant-part',
    'whole_plant',
    'diagnosis.parts.wholePlant',
    'plantain.parts.5',
    6
);

-- =========================================================
-- QUESTIONS : SYMPTÔMES
-- =========================================================

INSERT OR IGNORE INTO diagnosis_questions (
    id,
    crop_id,
    code,
    phase,
    answer_type,
    title_key,
    description_key,
    required,
    allow_unknown,
    allow_skip,
    progress_weight,
    display_order,
    enabled
) VALUES
(
    'maize-symptoms',
    'maize',
    'symptoms',
    'observations',
    'multiple_choice',
    'diagnosis.symptoms.maize.title',
    'diagnosis.symptoms.commonDescription',
    1,
    1,
    0,
    20,
    2,
    1
),
(
    'cassava-symptoms',
    'cassava',
    'symptoms',
    'observations',
    'multiple_choice',
    'diagnosis.symptoms.cassava.title',
    'diagnosis.symptoms.commonDescription',
    1,
    1,
    0,
    20,
    2,
    1
),
(
    'tomato-symptoms',
    'tomato',
    'symptoms',
    'observations',
    'multiple_choice',
    'diagnosis.symptoms.tomato.title',
    'diagnosis.symptoms.commonDescription',
    1,
    1,
    0,
    20,
    2,
    1
),
(
    'plantain-symptoms',
    'plantain',
    'symptoms',
    'observations',
    'multiple_choice',
    'diagnosis.symptoms.plantain.title',
    'diagnosis.symptoms.commonDescription',
    1,
    1,
    0,
    20,
    2,
    1
);

-- =========================================================
-- SYMPTÔMES DU MAÏS
-- =========================================================

INSERT OR IGNORE INTO diagnosis_question_options (
    id,
    question_id,
    value,
    label_key,
    image_key,
    display_order
) VALUES
(
    'maize-symptom-yellowing',
    'maize-symptoms',
    'yellowing',
    'diagnosis.observations.yellowing',
    'maize.symptoms.0',
    1
),
(
    'maize-symptom-spots',
    'maize-symptoms',
    'spots',
    'diagnosis.observations.spots',
    'maize.symptoms.1',
    2
),
(
    'maize-symptom-holes',
    'maize-symptoms',
    'holes',
    'diagnosis.observations.holes',
    'maize.symptoms.2',
    3
),
(
    'maize-symptom-dry-edges',
    'maize-symptoms',
    'dry_edges',
    'diagnosis.observations.dryEdges',
    'maize.symptoms.3',
    4
),
(
    'maize-symptom-deformation',
    'maize-symptoms',
    'deformation',
    'diagnosis.observations.deformation',
    'maize.symptoms.4',
    5
),
(
    'maize-symptom-insects',
    'maize-symptoms',
    'insects',
    'diagnosis.observations.insects',
    'maize.symptoms.5',
    6
);

-- =========================================================
-- SYMPTÔMES DU MANIOC
-- =========================================================

INSERT OR IGNORE INTO diagnosis_question_options (
    id,
    question_id,
    value,
    label_key,
    image_key,
    display_order
) VALUES
(
    'cassava-symptom-mosaic',
    'cassava-symptoms',
    'mosaic',
    'diagnosis.observations.mosaic',
    'cassava.symptoms.0',
    1
),
(
    'cassava-symptom-deformation',
    'cassava-symptoms',
    'deformation',
    'diagnosis.observations.deformation',
    'cassava.symptoms.1',
    2
),
(
    'cassava-symptom-brown-spots',
    'cassava-symptoms',
    'brown_spots',
    'diagnosis.observations.brownSpots',
    'cassava.symptoms.2',
    3
),
(
    'cassava-symptom-wilting',
    'cassava-symptoms',
    'wilting',
    'diagnosis.observations.wilting',
    'cassava.symptoms.3',
    4
),
(
    'cassava-symptom-root-rot',
    'cassava-symptoms',
    'root_rot',
    'diagnosis.observations.rootRot',
    'cassava.symptoms.4',
    5
),
(
    'cassava-symptom-whiteflies',
    'cassava-symptoms',
    'whiteflies',
    'diagnosis.observations.whiteflies',
    'cassava.symptoms.5',
    6
);

-- =========================================================
-- SYMPTÔMES DE LA TOMATE
-- =========================================================

INSERT OR IGNORE INTO diagnosis_question_options (
    id,
    question_id,
    value,
    label_key,
    image_key,
    display_order
) VALUES
(
    'tomato-symptom-yellowing',
    'tomato-symptoms',
    'yellowing',
    'diagnosis.observations.yellowing',
    'tomato.symptoms.0',
    1
),
(
    'tomato-symptom-spots',
    'tomato-symptoms',
    'spots',
    'diagnosis.observations.spots',
    'tomato.symptoms.1',
    2
),
(
    'tomato-symptom-wilting',
    'tomato-symptoms',
    'wilting',
    'diagnosis.observations.wilting',
    'tomato.symptoms.2',
    3
),
(
    'tomato-symptom-curling',
    'tomato-symptoms',
    'leaf_curling',
    'diagnosis.observations.leafCurling',
    'tomato.symptoms.3',
    4
),
(
    'tomato-symptom-blossom-rot',
    'tomato-symptoms',
    'blossom_end_rot',
    'diagnosis.observations.blossomEndRot',
    'tomato.symptoms.4',
    5
),
(
    'tomato-symptom-insects',
    'tomato-symptoms',
    'insects',
    'diagnosis.observations.insects',
    'tomato.symptoms.5',
    6
);

-- =========================================================
-- SYMPTÔMES DU PLANTAIN
-- =========================================================

INSERT OR IGNORE INTO diagnosis_question_options (
    id,
    question_id,
    value,
    label_key,
    image_key,
    display_order
) VALUES
(
    'plantain-symptom-yellowing',
    'plantain-symptoms',
    'yellowing',
    'diagnosis.observations.yellowing',
    'plantain.symptoms.0',
    1
),
(
    'plantain-symptom-black-spots',
    'plantain-symptoms',
    'black_spots',
    'diagnosis.observations.blackSpots',
    'plantain.symptoms.1',
    2
),
(
    'plantain-symptom-holes',
    'plantain-symptoms',
    'holes',
    'diagnosis.observations.holes',
    'plantain.symptoms.2',
    3
),
(
    'plantain-symptom-wilting',
    'plantain-symptoms',
    'wilting',
    'diagnosis.observations.wilting',
    'plantain.symptoms.3',
    4
),
(
    'plantain-symptom-pseudostem-rot',
    'plantain-symptoms',
    'pseudostem_rot',
    'diagnosis.observations.pseudostemRot',
    'plantain.symptoms.4',
    5
),
(
    'plantain-symptom-fruit-damage',
    'plantain-symptoms',
    'fruit_damage',
    'diagnosis.observations.fruitDamage',
    'plantain.symptoms.5',
    6
);