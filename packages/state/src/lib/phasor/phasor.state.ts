import { Phasor, MakePhasor, isPhasor } from '@innu/phasor';
import { Taker } from '../state.types';
import { PhasorAction, PhasorActions, PhasorInnerActions } from './phasor.state.types';

export function makePhasorState<I, O, E, K extends string>(
  key: K,
  fn: (input: I) => Promise<O>
) {
  type PhasorState = Record<K, Phasor<I, O, E>>;

  const state = {
    [key]: MakePhasor.rest(),
  } as PhasorState;

  const taker: Taker<PhasorState, PhasorInnerActions<I, O, E, K>> = async (
    getState,
    action,
    cause
  ) => {
    if(action.key !== key) return; // not for us

    const currentState = () => getState()[key];

    switch (action.type) {
      case 'set':
        return {
          [key]: action.payload,
        } as PhasorState;
      case PhasorAction.Rerun:
      case PhasorAction.Run: {
        const currentStateNow = currentState();

        let nextPhasor: undefined | Phasor<I, O, E>;

        if (isPhasor.atRest(currentStateNow)) {
          nextPhasor = MakePhasor.run(action.payload);
        } else if (isPhasor.done(currentStateNow)) {
          nextPhasor = MakePhasor.rerun(
            action.payload,
            currentStateNow.result
          );
        } else if (isPhasor.failed(currentStateNow)) {
          nextPhasor = MakePhasor.rerun(
            action.payload,
            undefined,
            currentStateNow.error
          );
        } else {
          nextPhasor = undefined;
        }

        if (!nextPhasor) return; // not a scenario we must handle.

        await cause({
          type: 'set',
          key,
          payload: nextPhasor,
        });

        try {
          const result = await fn(action.payload);
          return {
            [key]: MakePhasor.done(action.payload, result),
          } as PhasorState;
        } catch (error) {
          return {
            [key]: MakePhasor.fail(action.payload, error),
          } as PhasorState;
        }
      }
    }
  };

  return [state, taker as Taker<PhasorState, PhasorActions<I, K>>] as const;
}
