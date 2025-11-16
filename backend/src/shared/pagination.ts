/**
 * Options de pagination pour les requêtes de liste
 */
export interface PaginationOptions {
  page?: number;      // Numéro de page (commence à 1)
  limit?: number;     // Nombre d'éléments par page
  offset?: number;    // Décalage (calculé automatiquement si page fourni)
}

/**
 * Résultat paginé
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Constantes de pagination
 */
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * Normalise les options de pagination
 */
export function normalizePaginationOptions(options?: PaginationOptions): Required<PaginationOptions> {
  const page = Math.max(1, options?.page || PAGINATION_DEFAULTS.PAGE);
  const limit = Math.min(
    Math.max(1, options?.limit || PAGINATION_DEFAULTS.LIMIT),
    PAGINATION_DEFAULTS.MAX_LIMIT
  );
  const offset = options?.offset !== undefined ? options.offset : (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Crée un résultat paginé
 */
export function createPaginatedResult<T>(
  data: T[],
  total: number,
  options: PaginationOptions
): PaginatedResult<T> {
  const normalized = normalizePaginationOptions(options);
  const totalPages = Math.ceil(total / normalized.limit);

  return {
    data,
    pagination: {
      page: normalized.page,
      limit: normalized.limit,
      total,
      totalPages,
      hasNext: normalized.page < totalPages,
      hasPrev: normalized.page > 1,
    },
  };
}
