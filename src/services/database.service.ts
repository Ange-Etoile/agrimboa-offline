import { isTauri } from "@tauri-apps/api/core";
import Database from "@tauri-apps/plugin-sql";

export type ResourceStatus =
  | "pending"
  | "loading"
  | "ready"
  | "error";

export interface AppResource {
  id: string;
  resourceType: string;
  name: string;
  version: string | null;
  status: ResourceStatus;
  localPath: string | null;
  sizeBytes: number;
  checksum: string | null;
  installedAt: string | null;
  updatedAt: string;
}

interface AppResourceRow {
  id: string;
  resource_type: string;
  name: string;
  version: string | null;
  status: ResourceStatus;
  local_path: string | null;
  size_bytes: number;
  checksum: string | null;
  installed_at: string | null;
  updated_at: string;
}

const DATABASE_URL = "sqlite:agrimboa.db";

let databasePromise: Promise<Database> | null = null;

export function isNativeApplication(): boolean {
  return isTauri();
}

async function openDatabase(): Promise<Database> {
  if (!isNativeApplication()) {
    throw new Error(
      "SQLite est uniquement disponible dans l’application Tauri.",
    );
  }

  if (!databasePromise) {
    databasePromise = Database.load(DATABASE_URL);
  }

  return databasePromise;
}

export async function initializeDatabase(): Promise<void> {
  if (!isNativeApplication()) {
    testBrowserStorage();
    return;
  }

  const database = await openDatabase();

  await database.select<{ result: number }[]>(
    "SELECT 1 AS result",
  );
}

export async function testLocalStorage(): Promise<void> {
  if (!isNativeApplication()) {
    testBrowserStorage();
    return;
  }

  const database = await openDatabase();

  await database.execute(
    `
      UPDATE app_resources
      SET
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    ["ready", "local-storage"],
  );

  const rows = await database.select<
    Array<{ status: ResourceStatus }>
  >(
    `
      SELECT status
      FROM app_resources
      WHERE id = ?
      LIMIT 1
    `,
    ["local-storage"],
  );

  if (rows[0]?.status !== "ready") {
    throw new Error(
      "La vérification du stockage local a échoué.",
    );
  }
}

export async function getGuideCount(): Promise<number> {
  if (!isNativeApplication()) {
    return 0;
  }

  const database = await openDatabase();

  const rows = await database.select<
    Array<{ total: number }>
  >(
    `
      SELECT COUNT(*) AS total
      FROM agricultural_guides
      WHERE is_available_offline = 1
    `,
  );

  return Number(rows[0]?.total ?? 0);
}

export async function getAppResources(): Promise<
  AppResource[]
> {
  if (!isNativeApplication()) {
    return getBrowserResources();
  }

  const database = await openDatabase();

  const rows = await database.select<AppResourceRow[]>(
    `
      SELECT
        id,
        resource_type,
        name,
        version,
        status,
        local_path,
        size_bytes,
        checksum,
        installed_at,
        updated_at
      FROM app_resources
      ORDER BY
        CASE id
          WHEN 'local-ai-model' THEN 1
          WHEN 'agricultural-guides' THEN 2
          WHEN 'local-storage' THEN 3
          ELSE 4
        END
    `,
  );

  return rows.map(mapResourceRow);
}

export async function updateResourceStatus(
  resourceId: string,
  status: ResourceStatus,
  options?: {
    localPath?: string | null;
    sizeBytes?: number;
    checksum?: string | null;
  },
): Promise<void> {
  if (!isNativeApplication()) {
    updateBrowserResource(resourceId, status);
    return;
  }

  const database = await openDatabase();

  await database.execute(
    `
      UPDATE app_resources
      SET
        status = ?,
        local_path = COALESCE(?, local_path),
        size_bytes = COALESCE(?, size_bytes),
        checksum = COALESCE(?, checksum),
        installed_at = CASE
          WHEN ? = 'ready' THEN CURRENT_TIMESTAMP
          ELSE installed_at
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [
      status,
      options?.localPath ?? null,
      options?.sizeBytes ?? null,
      options?.checksum ?? null,
      status,
      resourceId,
    ],
  );
}

function mapResourceRow(
  row: AppResourceRow,
): AppResource {
  return {
    id: row.id,
    resourceType: row.resource_type,
    name: row.name,
    version: row.version,
    status: row.status,
    localPath: row.local_path,
    sizeBytes: Number(row.size_bytes),
    checksum: row.checksum,
    installedAt: row.installed_at,
    updatedAt: row.updated_at,
  };
}

function testBrowserStorage(): void {
  const testKey = "agrimboa.storage.test";
  const testValue = crypto.randomUUID();

  localStorage.setItem(testKey, testValue);

  const savedValue = localStorage.getItem(testKey);

  localStorage.removeItem(testKey);

  if (savedValue !== testValue) {
    throw new Error(
      "Le stockage du navigateur est indisponible.",
    );
  }
}

function getBrowserResources(): AppResource[] {
  const savedValue = localStorage.getItem(
    "agrimboa.development.resources",
  );

  if (savedValue) {
    try {
      return JSON.parse(savedValue) as AppResource[];
    } catch {
      localStorage.removeItem(
        "agrimboa.development.resources",
      );
    }
  }

  const now = new Date().toISOString();

  return [
    {
      id: "local-ai-model",
      resourceType: "model",
      name: "Modèle local AgriMboa",
      version: "1",
      status: "pending",
      localPath: null,
      sizeBytes: 0,
      checksum: null,
      installedAt: null,
      updatedAt: now,
    },
    {
      id: "agricultural-guides",
      resourceType: "guides",
      name: "Guides agricoles",
      version: "1",
      status: "pending",
      localPath: null,
      sizeBytes: 0,
      checksum: null,
      installedAt: null,
      updatedAt: now,
    },
    {
      id: "local-storage",
      resourceType: "storage",
      name: "Stockage local AgriMboa",
      version: "1",
      status: "ready",
      localPath: null,
      sizeBytes: 0,
      checksum: null,
      installedAt: now,
      updatedAt: now,
    },
  ];
}

function updateBrowserResource(
  resourceId: string,
  status: ResourceStatus,
): void {
  const resources = getBrowserResources();
  const resource = resources.find(
    (item) => item.id === resourceId,
  );

  if (!resource) {
    return;
  }

  const now = new Date().toISOString();

  resource.status = status;
  resource.updatedAt = now;

  if (status === "ready") {
    resource.installedAt = now;
  }

  localStorage.setItem(
    "agrimboa.development.resources",
    JSON.stringify(resources),
  );
}