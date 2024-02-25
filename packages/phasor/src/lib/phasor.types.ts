export enum Phase {
  Rest = 'Rest',
  Run = 'Run',
  Done = 'Done',
  Fail = 'Fail',
  Rerun = 'Rerun',
}

export type Rest = {
  phase: Phase.Rest;
}

export type Run<I> = {
  phase: Phase.Run;
  input: I;
}

export type Done<I, O> = {
  phase: Phase.Done;
  result: O;
  input: I;
}

export type Fail<I, E> = {
  phase: Phase.Fail;
  input: I;
  error: E
}

export type Rerun<I, O, E> = {
  phase: Phase.Rerun;
  input: I;
  result?: O
  error?: E
}

export type Settled<I, O, E> = Done<I, O> | Fail<I, E>;
export type Running<I, O, E> = Run<I> | Rerun<I, O, E>;
export type Phasor<I, O, E> = Rest | Running<I, O, E> | Settled<I, O, E>;
