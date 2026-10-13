import { ApiResponse } from '../types';

export function genericFilter<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

export function genericSortBy<T, K extends keyof T>(
  items: T[],
  key: K,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (valA === valB) return 0;
    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;

    let comparison = 0;
    if (typeof valA === 'string' && typeof valB === 'string') {
      comparison = valA.localeCompare(valB, 'vi');
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      comparison = valA - valB;
    } else {
      comparison = String(valA).localeCompare(String(valB));
    }

    return order === 'asc' ? comparison : -comparison;
  });
}

export function wrapApiResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function extractUniqueValues<T, K extends keyof T>(items: T[], key: K): Array<T[K]> {
  const seen = new Set<T[K]>();
  const result: Array<T[K]> = [];
  for (const item of items) {
    const val = item[key];
    if (val !== undefined && val !== null && !seen.has(val)) {
      seen.add(val);
      result.push(val);
    }
  }
  return result;
}
