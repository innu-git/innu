import { Phasor } from '@ella/phasor';

export type PhasorActions<I, K> =
  | {
      key: K;
      type: 'run';
      payload: I;
    }
  | {
      key: K;
      type: 'rerun';
      payload: I;
    };

export type PhasorInnerActions<I, O, E, K> =
  | {
      type: 'set';
      key: K;
      payload: Phasor<I, O, E>;
    }
  | PhasorActions<I, K>;
