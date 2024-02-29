/* eslint-disable @typescript-eslint/no-explicit-any */
import { Done, Phase, PhasorLike, Rerun, Rest, Run } from './phasor.types';

/**
 * The `ph` object represents a phasor, which is a data structure that represents the state of a process.
 * It provides utility functions for creating and manipulating phasors.
 */
export const ph = {
  /**
   * Creates a `Rest` object.
   */
  rest: (): Rest => ({ phase: Phase.Rest }),

  /**
   * Creates a `Run` object with the provided input.
   *
   * @param input - The input value.
   */
  run: <I>(input: I): Run<I> => ({ phase: Phase.Run, input }),

  /**
   * Creates a `Done` object with the provided input and result.
   *
   * @param input - The input value.
   * @param result - The result value.
   */
  done: <I, R>(input: I, result: R): Done<I, R> => ({
    phase: Phase.Done,
    input,
    result,
  }),

  /**
   * Creates a `Rerun` object with the provided input and result.
   *
   * @param input - The input value.
   * @param result - The result value.
   */
  rerun: <I, R>(input: I, result: R): Rerun<I, R> => ({
    phase: Phase.Rerun,
    input,
    result,
  }),

  /**
   * Utility functions for checking the type of a phasor.
   */
  is: {
    /**
     * Checks if the provided phasor is a `Rest` object.
     */
    rest: <I, R>(
      phasor: Rest | Run<I> | Done<I, R> | Rerun<I, R>
    ): phasor is Rest => phasor.phase === Phase.Rest,

    /**
     * Checks if the provided phasor is a `Run` object.
     */
    running: <I, R>(
      phasor: Rest | Run<I> | Done<I, R> | Rerun<I, R>
    ): phasor is Run<I> => phasor.phase === Phase.Run,

    /**
     * Checks if the provided phasor is a `Done` object.
     */
    done: <I, R>(
      phasor: Rest | Run<I> | Done<I, R> | Rerun<I, R>
    ): phasor is Done<I, R> => phasor.phase === Phase.Done,

    /**
     * Checks if the provided phasor is a `Rerun` object.
     */
    rerunning: <I, R>(
      phasor: Rest | Run<I> | Done<I, R> | Rerun<I, R>
    ): phasor is Rerun<I, R> => phasor.phase === Phase.Rerun,

    /**
     * Checks if the provided phasor is a `Run` or `Rerun` object.
     */
    pending: <I, R>(
      phasor: Rest | Run<I> | Done<I, R> | Rerun<I, R>
    ): phasor is Run<I> | Rerun<I, R> =>
      phasor.phase === Phase.Run || phasor.phase === Phase.Rerun,

    /**
     * Checks if the provided value is a phasor.
     */
    phasor: (phasor: unknown): phasor is PhasorLike => {
      if (typeof phasor !== 'object' || phasor === null) return false;
      if (!('phase' in phasor)) return false;
      if (typeof phasor.phase !== 'string') return false;
      return true;
    },
  },
};
