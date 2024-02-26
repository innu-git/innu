import { Phasor } from '@ella/phasor';

export enum PhasorActionType {
  Run = 'run',
  Rerun = 'rerun',
}

export type PhasorActions<I, K> =
  | {
      key: K;
      type: PhasorActionType.Run;
      payload: I;
    }
  | {
      key: K;
      type: PhasorActionType.Rerun;
      payload: I;
    };

export type PhasorInnerActions<I, O, E, K> =
  | {
      type: 'set';
      key: K;
      payload: Phasor<I, O, E>;
    }
  | PhasorActions<I, K>;
