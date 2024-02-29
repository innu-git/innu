/**
 * Represents the different phases of a process.
 */
export enum Phase {
  Rest = 'Rest',
  Run = 'Run',
  Done = 'Done',
  Rerun = 'Rerun',
}

/**
 * Represents a rest in music notation.
 */
export type Rest = {
  phase: Phase.Rest;
};

/**
 * Represents a Run object.
 *
 * @template I - The type of the input.
 */
export type Run<I> = {
  phase: Phase.Run;
  input: I;
};

/**
 * Represents a completed phase with a result and input.
 *
 * @template I The type of the input.
 * @template R The type of the result.
 */
export type Done<I, R> = {
  phase: Phase.Done;
  result: R;
  input: I;
};

/**
 * Represents a rerun object with the input, result, and phase.
 * @template I The type of the input.
 * @template R The type of the result.
 */
export type Rerun<I, R> = {
  phase: Phase.Rerun;
  result: R;
  input: I;
};

/**
 * Represents a type that can either be a `Run` or a `Rerun`.
 * @template I The input type.
 * @template R The result type.
 */
export type Pending<I, R> = Run<I> | Rerun<I, R>;

/**
 * Represents a Phasor, which can be in one of three states: Rest, Pending, or Done.
 *
 * @template I The input type.
 * @template R The result type.
 */
export type Phasor<I, R> = Rest | Pending<I, R> | Done<I, R>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PhasorLike = Phasor<any, any>;

/**
 * Represents the input type of a Phasor.
 * If the input type of the Phasor is `Phasor<I, unknown>`, then `PhasorInput` is `I`.
 * Otherwise, it is `never`.
 */
export type PhasorInput<P extends PhasorLike> = P extends Phasor<
  infer I,
  unknown
>
  ? I
  : never;

/**
 * Represents the result type of a Phasor operation.
 * If the input type `P` is a Phasor with an output type `O`,
 * the result type is `O`. Otherwise, it is `never`.
 */
export type PhasorResult<P extends PhasorLike> = P extends Phasor<
  unknown,
  infer O
>
  ? O
  : never;

/**
 * Represents the type of the "run" property of a `Phasor` object.
 * If the input type `P` is a `Phasor<I, unknown>`, then `RunOf<P>` is the same as `Run<I>`.
 * Otherwise, it is `never`.
 */
export type RunOf<P extends PhasorLike> = P extends Phasor<infer I, unknown>
  ? Run<I>
  : never;

/**
 * Represents the `Done` type of a `Phasor` object.
 * If the input type `P` is a `Phasor<I, O>`, then `DoneOf<P>` is equivalent to `Done<I, O>`.
 * Otherwise, it is `never`.
 */
export type DoneOf<P extends PhasorLike> = P extends Phasor<infer I, infer O>
  ? Done<I, O>
  : never;

/**
 * Represents the type of a rerun operation on a `PhasorLike` object.
 * If the input type of the `PhasorLike` object is `Phasor<I, O>`, then the `RerunOf` type
 * is `Rerun<I, O>`. Otherwise, it is `never`.
 */
export type RerunOf<P extends PhasorLike> = P extends Phasor<infer I, infer O>
  ? Rerun<I, O>
  : never;

/**
 * Represents a type that can be either a `RunOf` or a `RerunOf` type.
 * @template P - The type parameter representing the Phasor-like type.
 */
export type PendingOf<P extends PhasorLike> = RunOf<P> | RerunOf<P>;
