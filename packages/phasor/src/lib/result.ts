export enum Status {
  Ok = 'Ok',
  Err = 'Err',
}

export type Ok<O> = {
  status: Status.Ok;
  value: O;
};

export type Err<E> = {
  status: Status.Err;
  error: E;
};

export type Result<O, E> = Ok<O> | Err<E>;

/**
 * The `res` object provides utility functions for creating and manipulating `Result` objects.
 */
export const res = {
  /**
   * Creates a `Result` object with status `Ok` and the provided value.
   */
  ok: <O, E>(value: O): Result<O, E> => ({ status: Status.Ok, value }),

  /**
   * Creates a `Result` object with status `Err` and the provided error.
   */
  err: <O, E>(error: E): Result<O, E> => ({ status: Status.Err, error }),

  /**
   * Utility functions for checking the type of a `Result` object.
   */
  is: {
    /**
     * Checks if the provided `Result` object has status `Ok`.
     */
    ok: <O, E>(result: Result<O, E>): result is Ok<O> =>
      result.status === Status.Ok,

    /**
     * Checks if the provided `Result` object has status `Err`.
     */
    err: <O, E>(result: Result<O, E>): result is Err<E> =>
      result.status === Status.Err,

    /**
     * Checks if the provided object is a `Result` object.
     */
    res: (result: unknown): result is Result<unknown, unknown> => {
      if (typeof result !== 'object' || result === null) return false;
      if (!('status' in result)) return false;
      if (typeof result.status !== 'string') return false;
      return true;
    }
  },
};
