import {
  Done,
  Fail,
  Phase,
  Phasor,
  Rerun,
  Rest,
  Run,
  Running,
  Settled,
} from './phasor.types';

function atRest<I, O, E>(phasor: Phasor<I, O, E>): phasor is Rest {
  return phasor.phase === Phase.Rest;
}

function running<I, O, E>(phasor: Phasor<I, O, E>): phasor is Run<I> {
  return phasor.phase === Phase.Run;
}

function done<I, O, E>(phasor: Phasor<I, O, E>): phasor is Done<I, O> {
  return phasor.phase === Phase.Done;
}

function failed<I, O, E>(phasor: Phasor<I, O, E>): phasor is Fail<I, E> {
  return phasor.phase === Phase.Fail;
}

function rerunning<I, O, E>(phasor: Phasor<I, O, E>): phasor is Rerun<I, O, E> {
  return phasor.phase === Phase.Rerun;
}

function settled<I, O, E>(phasor: Phasor<I, O, E>): phasor is Settled<I, O, E> {
  return done(phasor) || failed(phasor);
}

function pending<I, O, E>(phasor: Phasor<I, O, E>): phasor is Running<I, O, E> {
  return running(phasor) || rerunning(phasor);
}

export const isPhasor = {
  atRest,
  running,
  done,
  failed,
  rerunning,
  settled,
  pending,
};
