import Database from "@tauri-apps/plugin-sql";
import type {
  LibraryCategory,
  LibraryContent,
  LibraryCrop,
  LibraryGuide,
} from "@/features/library/types/library";
import { isTauriApplication } from "@/services/diagnosis.service";
interface Row {
  id: string;
  slug: string;
  crop_id: LibraryCrop;
  category: LibraryCategory;
  title_fr: string;
  title_en: string;
  title_pcm: string;
  summary_fr: string;
  summary_en: string;
  summary_pcm: string;
  reading_minutes: number;
  image_key: string | null;
  featured: number;
  recommended: number;
  installed: number;
  content_json: string;
  bookmarked: number;
  progress: number;
}
let promise: Promise<Database> | null = null;
const db = () => (promise ??= Database.load("sqlite:agrimboa.db"));
function map(row: Row, locale: string): LibraryGuide {
  const title =
    locale === "en"
      ? row.title_en
      : locale === "pcm"
        ? row.title_pcm
        : row.title_fr;
  const summary =
    locale === "en"
      ? row.summary_en
      : locale === "pcm"
        ? row.summary_pcm
        : row.summary_fr;
  let content: LibraryContent = {};
  try {
    content = JSON.parse(row.content_json);
  } catch {}
  return {
    id: row.id,
    slug: row.slug,
    crop: row.crop_id,
    category: row.category,
    title,
    summary,
    readingMinutes: row.reading_minutes,
    imageKey: row.image_key,
    featured: row.featured === 1,
    recommended: row.recommended === 1,
    installed: row.installed === 1,
    bookmarked: row.bookmarked === 1,
    progress: row.progress,
    content,
  };
}
export async function listLibraryGuides(
  locale: string,
): Promise<LibraryGuide[]> {
  if (!isTauriApplication()) return [];
  const rows = await (
    await db()
  ).select<Row[]>(
    `SELECT g.*,CASE WHEN b.guide_id IS NULL THEN 0 ELSE 1 END bookmarked,COALESCE(p.progress,0) progress FROM library_guides g LEFT JOIN library_bookmarks b ON b.guide_id=g.id LEFT JOIN library_reading_progress p ON p.guide_id=g.id WHERE g.installed=1 ORDER BY g.display_order`,
  );
  return rows.map((r) => map(r, locale));
}
export async function getLibraryGuide(
  slug: string,
  locale: string,
): Promise<LibraryGuide | null> {
  return (await listLibraryGuides(locale)).find((g) => g.slug === slug) ?? null;
}
export async function toggleLibraryBookmark(
  id: string,
  bookmarked: boolean,
): Promise<void> {
  if (!isTauriApplication()) return;
  const database = await db();
  if (bookmarked)
    await database.execute(`DELETE FROM library_bookmarks WHERE guide_id=$1`, [
      id,
    ]);
  else
    await database.execute(
      `INSERT OR IGNORE INTO library_bookmarks(guide_id) VALUES($1)`,
      [id],
    );
}
export async function updateReadingProgress(
  id: string,
  progress: number,
): Promise<void> {
  if (!isTauriApplication()) return;
  await (
    await db()
  ).execute(
    `INSERT INTO library_reading_progress(guide_id,progress,updated_at) VALUES($1,$2,CURRENT_TIMESTAMP) ON CONFLICT(guide_id) DO UPDATE SET progress=excluded.progress,updated_at=CURRENT_TIMESTAMP`,
    [id, Math.max(0, Math.min(100, progress))],
  );
}
