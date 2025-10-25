import { catchError, map, Observable, of } from "rxjs";

export const tryCatch$ = <T, E = Error>(observable: Observable<T>) => {
  return observable.pipe(
    map((result) => ({ ok: true, result }) as const),
    catchError((error: E) => of({ ok: false, error } as const)),
  );
};
