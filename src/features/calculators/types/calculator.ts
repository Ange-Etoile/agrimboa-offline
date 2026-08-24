import type { CropId } from "@/features/diagnosis/types/diagnosis";
export type CalculatorStep="surface"|"density"|"seeds"|"inputs"|"summary"|"harvest"|"budget"|"converter";
export type ParcelShape="rectangle"|"triangle"|"irregular";
export interface CalculatorDraft { id:string; name:string; crop:CropId; shape:ParcelShape; length:number; width:number; surfaceM2:number; rowSpacingCm:number; plantSpacingCm:number; plantsPerHole:number; plants:number; germinationRate:number; safetyMargin:number; thousandSeedWeightG:number; seedUnits:number; seedKg:number; inputType:string; productName:string; dosePerHa:number; packageKg:number; applications:number; inputKg:number; note:string; updatedAt:string }
export interface CalculatorHistoryItem { id:string; projectId:string; step:CalculatorStep; label:string; result:string; payload:Record<string,unknown>; createdAt:string }
export interface CalculatorAdvice { summary:string; checks:string[]; warning:string|null; nextAction:string; provider:string; model:string }

