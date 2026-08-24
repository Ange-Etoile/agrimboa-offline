export type LibraryCrop = "maize" | "cassava" | "tomato" | "plantain" | "general";
export type LibraryCategory = "crop" | "disease" | "deficiency" | "pest" | "practice" | "guide";
export interface LibraryContent { symptoms?: string[]; confusions?: string[]; actions?: string[]; prevention?: string[] }
export interface LibraryGuide { id:string; slug:string; crop:LibraryCrop; category:LibraryCategory; title:string; summary:string; readingMinutes:number; imageKey:string|null; featured:boolean; recommended:boolean; installed:boolean; bookmarked:boolean; progress:number; content:LibraryContent }
export interface LibraryCropSummary { crop: Exclude<LibraryCrop,"general">; count:number; summary:string }
