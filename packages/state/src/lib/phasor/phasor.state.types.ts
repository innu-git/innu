import { Phasor } from '@innu/phasor';

export enum PhasorAction {
  Run = 'run',
  Rerun = 'rerun',
}

export type PhasorActions<I, K> =
  | {
      key: K;
      type: PhasorAction.Run;
      payload: I;
    }
  | {
      key: K;
      type: PhasorAction.Rerun;
      payload: I;
    };

export type PhasorInnerActions<I, O, K> =
  | {
      type: 'set';
      key: K;
      payload: Phasor<I, O>;
    }
  | PhasorActions<I, K>;
