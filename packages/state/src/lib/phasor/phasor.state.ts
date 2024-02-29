import { Phasor, ph, res } from '@innu/phasor';
import { Taker } from '../state.types';
import {
  PhasorAction,
  PhasorActions,
  PhasorInnerActions,
} from './phasor.state.types';

export function makePhasorState<I, O, K extends string>(
  key: K,
  fn: (input: I) => Promise<O>
) {
  type ThisPhasor = Phasor<I, O>;
  type ThisState = Record<K, ThisPhasor>;

  const state = {
    [key]: ph.rest(),
  } as ThisState;

  const taker: Taker<ThisState, PhasorInnerActions<I, O, K>> = async (
    getState,
    action,
    cause
  ) => {
    if (action.key !== key) return; // not for us

    const _phasor = () => getState()[key];

    switch (action.type) {
      case 'set':
        return {
          [key]: action.payload,
        } as ThisState;
      case PhasorAction.Rerun:
      case PhasorAction.Run: {
        const phasor = _phasor();

        if (!ph.is.rest(phasor) && !ph.is.done(phasor)) {
          return {}; // ignore but return something so that `toss` completes.
        }

        await cause({
          type: 'set',
          key,
          payload: ph.is.rest(phasor)
            ? ph.run(action.payload)
            : ph.rerun(action.payload, phasor.result),
        });

        try {
          const result = await fn(action.payload);
          const donePhasor = res.is.res(result)
            ? ph.done(action.payload, result)
            : ph.done(action.payload, res.ok(result));

          return {
            [key]: donePhasor,
          } as ThisState;
        } catch (error) {
          const errorPhasor = ph.done(action.payload, res.err(error));
          return {
            [key]: errorPhasor,
          } as ThisState;
        }
      }
    }
  };

  return [state, taker as Taker<ThisState, PhasorActions<I, K>>] as const;
}
