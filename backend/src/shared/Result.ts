export type Ok<T> = { ok: true; value: T };
export type Err<E> = { ok: false; error: E };
export type Result<T, E> = Ok<T> | Err<E>;

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const err = <E>(error: E): Err<E> => ({ ok: false, error });

// Backwards-compatible helper: some files import { Result } and call Result.ok/Result.err
export const Result = { ok, err };

// Default export for modules that import default
export default Result;
