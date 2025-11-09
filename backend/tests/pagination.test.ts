import { describe, it, expect } from 'vitest';
import {
  normalizePaginationOptions,
  createPaginatedResult,
  PAGINATION_DEFAULTS,
} from '../src/shared/pagination';

describe('Pagination Utils', () => {
  describe('normalizePaginationOptions', () => {
    it('should use defaults when no options provided', () => {
      const result = normalizePaginationOptions();

      expect(result.page).toBe(PAGINATION_DEFAULTS.PAGE);
      expect(result.limit).toBe(PAGINATION_DEFAULTS.LIMIT);
      expect(result.offset).toBe(0);
    });

    it('should calculate offset from page', () => {
      const result = normalizePaginationOptions({ page: 3, limit: 10 });

      expect(result.page).toBe(3);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(20);
    });

    it('should respect max limit', () => {
      const result = normalizePaginationOptions({ limit: 200 });

      expect(result.limit).toBe(PAGINATION_DEFAULTS.MAX_LIMIT);
    });

    it('should enforce minimum page of 1', () => {
      const result = normalizePaginationOptions({ page: 0 });

      expect(result.page).toBe(1);
    });

    it('should use explicit offset if provided', () => {
      const result = normalizePaginationOptions({ page: 2, limit: 10, offset: 50 });

      expect(result.offset).toBe(50);
    });
  });

  describe('createPaginatedResult', () => {
    it('should create correct pagination metadata', () => {
      const data = [1, 2, 3, 4, 5];
      const result = createPaginatedResult(data, 50, { page: 2, limit: 5 });

      expect(result.data).toEqual(data);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(5);
      expect(result.pagination.total).toBe(50);
      expect(result.pagination.totalPages).toBe(10);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrev).toBe(true);
    });

    it('should indicate no next page on last page', () => {
      const result = createPaginatedResult([], 20, { page: 4, limit: 5 });

      expect(result.pagination.hasNext).toBe(false);
      expect(result.pagination.hasPrev).toBe(true);
    });

    it('should indicate no previous page on first page', () => {
      const result = createPaginatedResult([], 20, { page: 1, limit: 5 });

      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrev).toBe(false);
    });
  });
});
