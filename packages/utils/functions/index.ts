type Success<T> = { ok: true; data: T; error: null };
type Failure<E = Error> = { ok: false; error: E; data: null };

type Result<T, E = Error> = Success<T> | Failure<E>;

export const tryCatch = async <T, E = Error>(
  fn: () => Promise<T>,
): Promise<Result<T, E>> => {
  return fn()
    .then((data) => ({ ok: true, data, error: null }) as const)
    .catch((error) => ({ ok: false, error: error as E, data: null }) as const);
};
