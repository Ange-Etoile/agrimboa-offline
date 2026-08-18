import cassavaPartsSheet from "@/assets/images/diagnosis/cassava/parts-sheet.png";
import cassavaSymptomsSheet from "@/assets/images/diagnosis/cassava/symptoms-sheet.png";

import maizePartsSheet from "@/assets/images/diagnosis/maize/parts-sheet.png";
import maizeSymptomsSheet from "@/assets/images/diagnosis/maize/symptoms-sheet.png";

import plantainPartsSheet from "@/assets/images/diagnosis/plantain/parts-sheet.png";
import plantainSymptomsSheet from "@/assets/images/diagnosis/plantain/symptoms-sheet.png";

import tomatoPartsSheet from "@/assets/images/diagnosis/tomato/parts-sheet.png";
import tomatoSymptomsSheet from "@/assets/images/diagnosis/tomato/symptoms-sheet.png";

import type {
  CropId,
  DiagnosisSprite,
} from "@/features/diagnosis/types/diagnosis";

type IllustrationGroup =
  | "parts"
  | "symptoms";

const sheets: Record<
  CropId,
  Record<IllustrationGroup, string>
> = {
  maize: {
    parts: maizePartsSheet,
    symptoms: maizeSymptomsSheet,
  },

  cassava: {
    parts: cassavaPartsSheet,
    symptoms: cassavaSymptomsSheet,
  },

  tomato: {
    parts: tomatoPartsSheet,
    symptoms: tomatoSymptomsSheet,
  },

  plantain: {
    parts: plantainPartsSheet,
    symptoms: plantainSymptomsSheet,
  },
};

export function resolveDiagnosisSprite(
  imageKey: string | null,
): DiagnosisSprite | undefined {
  if (!imageKey) {
    return undefined;
  }

  const parts = imageKey.split(".");

  if (parts.length !== 3) {
    console.warn(
      `Clé d’image de diagnostic invalide : ${imageKey}`,
    );

    return undefined;
  }

  const [
    cropValue,
    groupValue,
    indexValue,
  ] = parts;

  if (!isCropId(cropValue)) {
    console.warn(
      `Culture d’image inconnue : ${cropValue}`,
    );

    return undefined;
  }

  if (!isIllustrationGroup(groupValue)) {
    console.warn(
      `Groupe d’image inconnu : ${groupValue}`,
    );

    return undefined;
  }

  const index = Number(indexValue);

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index > 5
  ) {
    console.warn(
      `Index d’image invalide : ${imageKey}`,
    );

    return undefined;
  }

  return {
    sheet: sheets[cropValue][groupValue],
    column: index % 3,
    row: Math.floor(index / 3),
  };
}

function isCropId(
  value: string,
): value is CropId {
  return [
    "maize",
    "cassava",
    "tomato",
    "plantain",
  ].includes(value);
}

function isIllustrationGroup(
  value: string,
): value is IllustrationGroup {
  return (
    value === "parts" ||
    value === "symptoms"
  );
}