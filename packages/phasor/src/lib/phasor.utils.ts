import { Done, Fail, Phase, Rerun, Rest, Run } from "./phasor.types";

export class MakePhasor {
  static rest(): Rest {
    return {
      phase: Phase.Rest
    }
  }

  static run<I>(input: I): Run<I> {
    return {
      phase: Phase.Run,
      input,
    }
  }

  static done<I, O>(input: I, result: O): Done<I, O> {
    return {
      phase: Phase.Done,
      input,
      result
    }
  }

  static fail<I, E>(input: I, error: E): Fail<I, E> {
    return {
      phase: Phase.Fail,
      input,
      error,
    }
  }

  static rerun<I, O, E>(input: I, result?: O, error?: E): Rerun<I, O, E> {
    return {
      phase: Phase.Rerun,
      input,
      result,
      error
    }
  }
}
