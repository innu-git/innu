import { Phasor, PhasorFactory, isPhasor } from '@ella/phasor';
import { Effect } from '../state.types';
import { PhasorActionType, PhasorActions, PhasorInnerActions } from './phasor.state.types';

export function makePhasorState<I, O, E, K extends string>(
  key: K,
  fn: (input: I) => Promise<O>
) {
  type PhasorState = Record<K, Phasor<I, O, E>>;

  const state = {
    [key]: PhasorFactory.rest(),
  } as PhasorState;

  const effect: Effect<PhasorState, PhasorInnerActions<I, O, E, K>> = async (
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
      case PhasorActionType.Rerun:
      case PhasorActionType.Run: {
        const currentStateNow = currentState();

        let nextPhasor: undefined | Phasor<I, O, E>;

        if (isPhasor.atRest(currentStateNow)) {
          nextPhasor = PhasorFactory.run(action.payload);
        } else if (isPhasor.done(currentStateNow)) {
          nextPhasor = PhasorFactory.rerun(
            action.payload,
            currentStateNow.result
          );
        } else if (isPhasor.failed(currentStateNow)) {
          nextPhasor = PhasorFactory.rerun(
            action.payload,
            undefined,
            currentStateNow.error
          );
        } else {
          nextPhasor = undefined;
        }

        if (!nextPhasor) return; // not a scenario we can handle.

        await cause({
          type: 'set',
          key,
          payload: nextPhasor,
        });

        try {
          const result = await fn(action.payload);
          return {
            [key]: PhasorFactory.done(action.payload, result),
          } as PhasorState;
        } catch (error) {
          return {
            [key]: PhasorFactory.fail(action.payload, error),
          } as PhasorState;
        }
      }
    }
  };

  return [state, effect as Effect<PhasorState, PhasorActions<I, K>>] as const;
}
