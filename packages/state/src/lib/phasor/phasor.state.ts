import { Phase, Phasor, PhasorFactory, isPhasor } from '@ella/phasor';
import { Effect } from '../state.types';
import { PhasorActions, PhasorInnerActions } from './phasor.state.types';

export function makePhasorState<I, O, E, K extends string>(
  key: K,
  fn: (input: I) => Promise<O>
) {
  type PhasorState = Record<K, Phasor<I, O, E>>;

  const state = {
    [key]: {
      phase: Phase.Rest,
    },
  } as PhasorState;

  const effect: Effect<PhasorState, PhasorInnerActions<I, O, E, K>> = async (
    getState,
    action,
    cause
  ) => {
    const currentState = () => getState()[key];
    switch (action.type) {
      case 'set':
        return {
          [key]: action.payload,
        } as PhasorState;
      case 'rerun':
      case 'run': {
        const currentStateNow = currentState();

        const nextPhasor: undefined | Phasor<I, O, E> = isPhasor.atRest(
          currentStateNow
        )
          ? PhasorFactory.run(action.payload)
          : isPhasor.done(currentStateNow)
          ? PhasorFactory.rerun(action.payload, currentStateNow.result)
          : isPhasor.failed(currentStateNow)
          ? PhasorFactory.rerun(
              action.payload,
              undefined,
              currentStateNow.error
            )
          : undefined;

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

  return [state, effect as  Effect<PhasorState, PhasorActions<I, K>>] as const;
}
