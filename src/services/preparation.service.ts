import { checkLocalAiHealth } from "@/services/ai.service";
import {
  getGuideCount,
  initializeDatabase,
  isNativeApplication,
  testLocalStorage,
  updateResourceStatus,
  type ResourceStatus,
} from "@/services/database.service";

export type PreparationResourceId =
  "local-ai-model" | "agricultural-guides" | "local-storage";

export interface PreparationResourceState {
  id: PreparationResourceId;
  status: ResourceStatus;
  message: string | null;
}

export interface PreparationResult {
  completed: boolean;
  progress: number;
  resources: PreparationResourceState[];
}

export type PreparationListener = (result: PreparationResult) => void;

const resourceIds: PreparationResourceId[] = [
  "local-ai-model",
  "agricultural-guides",
  "local-storage",
];

export async function prepareApplication(
  listener?: PreparationListener,
): Promise<PreparationResult> {
  const state: PreparationResult = {
    completed: false,
    progress: 0,
    resources: resourceIds.map((id) => ({
      id,
      status: "pending",
      message: null,
    })),
  };

  notify(listener, state);

  await initializeDatabase();

  /*
   * Vérification du stockage local.
   *
   * Sous Tauri, une écriture et une lecture sont
   * effectuées dans SQLite.
   *
   * Dans le navigateur, localStorage est utilisé.
   */
  await runCheck(
    state,
    "local-storage",
    async () => {
      await testLocalStorage();
    },
    listener,
  );

  /*
   * Vérification des guides agricoles.
   *
   * La ressource est considérée prête uniquement
   * lorsqu’au moins un guide hors ligne existe
   * réellement dans SQLite.
   */
  await runCheck(
    state,
    "agricultural-guides",
    async () => {
      const guideCount = await getGuideCount();

      if (guideCount === 0) {
        throw new Error(
          isNativeApplication()
            ? "Aucun guide agricole n’est encore installé."
            : "Les guides seront vérifiés dans l’application Tauri.",
        );
      }
    },
    listener,
  );

  /*
   * Vérification du modèle IA.
   *
   * L’application appelle réellement l’adresse :
   * http://127.0.0.1:11435/health
   *
   * Le modèle est prêt uniquement si llama-server
   * répond avec le statut "ok".
   */
  await runCheck(
    state,
    "local-ai-model",
    async () => {
      await checkLocalAiHealth();
    },
    listener,
  );

  /*
   * La préparation est terminée uniquement lorsque
   * les trois ressources sont réellement prêtes.
   */
  state.completed = state.resources.every(
    (resource) => resource.status === "ready",
  );

  updateProgress(state);
  notify(listener, state);

  return cloneResult(state);
}

async function runCheck(
  state: PreparationResult,
  resourceId: PreparationResourceId,
  check: () => Promise<void>,
  listener?: PreparationListener,
): Promise<void> {
  const resource = findResource(state, resourceId);

  resource.status = "loading";
  resource.message = null;

  await updateResourceStatus(resourceId, "loading");

  updateProgress(state);
  notify(listener, state);

  try {
    await check();

    resource.status = "ready";
    resource.message = null;

    await updateResourceStatus(resourceId, "ready");
  } catch (error: unknown) {
    resource.status = "error";
    resource.message = getErrorMessage(error);

    await updateResourceStatus(resourceId, "error");
  }

  updateProgress(state);
  notify(listener, state);
}

function findResource(
  state: PreparationResult,
  resourceId: PreparationResourceId,
): PreparationResourceState {
  const resource = state.resources.find((item) => item.id === resourceId);

  if (!resource) {
    throw new Error(`Ressource de préparation inconnue : ${resourceId}`);
  }

  return resource;
}

function updateProgress(state: PreparationResult): void {
  const readyResources = state.resources.filter(
    (resource) => resource.status === "ready",
  ).length;

  state.progress = Math.round((readyResources / state.resources.length) * 100);
}

function notify(
  listener: PreparationListener | undefined,
  state: PreparationResult,
): void {
  listener?.(cloneResult(state));
}

function cloneResult(state: PreparationResult): PreparationResult {
  return {
    completed: state.completed,
    progress: state.progress,
    resources: state.resources.map((resource) => ({
      ...resource,
    })),
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inconnue est survenue.";
}
