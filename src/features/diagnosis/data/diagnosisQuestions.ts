import cassavaParts from "@/assets/images/diagnosis/cassava/parts-sheet.png";
import cassavaSymptoms from "@/assets/images/diagnosis/cassava/symptoms-sheet.png";

import maizeParts from "@/assets/images/diagnosis/maize/parts-sheet.png";
import maizeSymptoms from "@/assets/images/diagnosis/maize/symptoms-sheet.png";

import plantainParts from "@/assets/images/diagnosis/plantain/parts-sheet.png";
import plantainSymptoms from "@/assets/images/diagnosis/plantain/symptoms-sheet.png";

import tomatoParts from "@/assets/images/diagnosis/tomato/parts-sheet.png";
import tomatoSymptoms from "@/assets/images/diagnosis/tomato/symptoms-sheet.png";

import affectedArea from "@/assets/images/diagnosis/affected-area-sheet.png";

import maizeImage from "@/assets/images/home/crop-maize.png";
import cassavaImage from "@/assets/images/home/crop-cassava.png";
import tomatoImage from "@/assets/images/home/crop-tomato.png";

import type {
  CropId,
  DiagnosisChoice,
  DiagnosisSprite,
} from "@/features/diagnosis/types/diagnosis";

function sprite(
  sheet: string,
  index: number,
): DiagnosisSprite {
  return {
    sheet,
    column: index % 3,
    row: Math.floor(index / 3),
  };
}

export const cropChoices: DiagnosisChoice[] = [
  {
    id: "maize",
    value: "maize",
    labelKey: "diagnosis.crop.maize",
    subtitleKey:
      "diagnosis.crop.maizeCategory",
    image: maizeImage,
  },
  {
    id: "cassava",
    value: "cassava",
    labelKey:
      "diagnosis.crop.cassava",
    subtitleKey:
      "diagnosis.crop.cassavaCategory",
    image: cassavaImage,
  },
  {
    id: "tomato",
    value: "tomato",
    labelKey:
      "diagnosis.crop.tomato",
    subtitleKey:
      "diagnosis.crop.tomatoCategory",
    image: tomatoImage,
  },
  {
    id: "plantain",
    value: "plantain",
    labelKey:
      "diagnosis.crop.plantain",
    subtitleKey:
      "diagnosis.crop.plantainCategory",
    sprite: sprite(
      plantainParts,
      5,
    ),
  },
];

const partsByCrop: Record<
  CropId,
  DiagnosisChoice[]
> = {
  maize: createChoices(
    [
      "leaves",
      "stem",
      "roots",
      "ears",
      "wholePlant",
      "unknown",
    ],
    [
      "leaves",
      "stem",
      "roots",
      "ears",
      "whole_plant",
      "unknown",
    ],
    "diagnosis.parts",
    maizeParts,
  ),

  cassava: createChoices(
    [
      "leaves",
      "stems",
      "tuberousRoots",
      "collar",
      "wholePlant",
      "unknown",
    ],
    [
      "leaves",
      "stem",
      "tuberous_roots",
      "collar",
      "whole_plant",
      "unknown",
    ],
    "diagnosis.parts",
    cassavaParts,
  ),

  tomato: createChoices(
    [
      "leaves",
      "stems",
      "roots",
      "flowers",
      "fruits",
      "wholePlant",
    ],
    [
      "leaves",
      "stem",
      "roots",
      "flowers",
      "fruits",
      "whole_plant",
    ],
    "diagnosis.parts",
    tomatoParts,
  ),

  plantain: createChoices(
    [
      "leaves",
      "pseudostem",
      "corm",
      "inflorescence",
      "fruitBunch",
      "wholePlant",
    ],
    [
      "leaves",
      "pseudostem",
      "corm",
      "inflorescence",
      "fruit_bunch",
      "whole_plant",
    ],
    "diagnosis.parts",
    plantainParts,
  ),
};

const symptomsByCrop: Record<
  CropId,
  DiagnosisChoice[]
> = {
  maize: createChoices(
    [
      "yellowing",
      "spots",
      "holes",
      "dryEdges",
      "deformation",
      "insects",
    ],
    [
      "yellowing",
      "spots",
      "holes",
      "dry_edges",
      "deformation",
      "insects",
    ],
    "diagnosis.observations",
    maizeSymptoms,
  ),

  cassava: createChoices(
    [
      "mosaic",
      "deformation",
      "brownSpots",
      "wilting",
      "rootRot",
      "whiteflies",
    ],
    [
      "mosaic",
      "deformation",
      "brown_spots",
      "wilting",
      "root_rot",
      "whiteflies",
    ],
    "diagnosis.observations",
    cassavaSymptoms,
  ),

  tomato: createChoices(
    [
      "yellowing",
      "spots",
      "wilting",
      "leafCurling",
      "blossomEndRot",
      "insects",
    ],
    [
      "yellowing",
      "spots",
      "wilting",
      "leaf_curling",
      "blossom_end_rot",
      "insects",
    ],
    "diagnosis.observations",
    tomatoSymptoms,
  ),

  plantain: createChoices(
    [
      "yellowing",
      "blackSpots",
      "holes",
      "wilting",
      "pseudostemRot",
      "fruitDamage",
    ],
    [
      "yellowing",
      "black_spots",
      "holes",
      "wilting",
      "pseudostem_rot",
      "fruit_damage",
    ],
    "diagnosis.observations",
    plantainSymptoms,
  ),
};

export const yellowingChoices: DiagnosisChoice[] =
  [
    {
      id: "lower_leaves",
      value: "lower_leaves",
      labelKey:
        "diagnosis.yellowing.lowerLeaves",
      sprite: sprite(maizeParts, 4),
    },
    {
      id: "new_leaves",
      value: "new_leaves",
      labelKey:
        "diagnosis.yellowing.newLeaves",
      sprite: sprite(maizeParts, 4),
    },
    {
      id: "leaf_tips",
      value: "leaf_tips",
      labelKey:
        "diagnosis.yellowing.leafTips",
      sprite: sprite(maizeSymptoms, 0),
    },
    {
      id: "leaf_edges",
      value: "leaf_edges",
      labelKey:
        "diagnosis.yellowing.leafEdges",
      sprite: sprite(maizeSymptoms, 3),
    },
    {
      id: "whole_plant",
      value: "whole_plant",
      labelKey:
        "diagnosis.yellowing.wholePlant",
      sprite: sprite(maizeParts, 4),
    },
    {
      id: "unknown",
      value: "unknown",
      labelKey:
        "diagnosis.yellowing.unknown",
      sprite: sprite(maizeParts, 5),
    },
  ];

export const extentChoices: DiagnosisChoice[] =
  [
    "onePlant",
    "fewPlants",
    "smallArea",
    "severalAreas",
    "almostField",
    "unknown",
  ].map((key, index) => ({
    id: [
      "one_plant",
      "few_plants",
      "small_area",
      "several_areas",
      "almost_field",
      "unknown",
    ][index],
    value: [
      "one_plant",
      "few_plants",
      "small_area",
      "several_areas",
      "almost_field",
      "unknown",
    ][index],
    labelKey:
      `diagnosis.extent.${key}`,
    sprite: sprite(
      affectedArea,
      index,
    ),
  }));

export function getFallbackParts(
  cropId: CropId,
): DiagnosisChoice[] {
  return partsByCrop[cropId];
}

export function getFallbackSymptoms(
  cropId: CropId,
): DiagnosisChoice[] {
  return symptomsByCrop[cropId];
}

function createChoices(
  translationKeys: string[],
  values: string[],
  translationPrefix: string,
  sheet: string,
): DiagnosisChoice[] {
  return translationKeys.map(
    (translationKey, index) => ({
      id: values[index],
      value: values[index],
      labelKey:
        `${translationPrefix}.${translationKey}`,
      sprite: sprite(
        sheet,
        index,
      ),
    }),
  );
}