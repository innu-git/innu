import { Cause, Effect, StateManager } from './state.types';

export function make<State>(mgr: StateManager<State>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effects: Effect<any, any>[] = [];

  async function cause<Action>(action: Action) {
    for (const responder of effects) {
      const newState = await responder(mgr.getState, action, cause);
      if (newState) mgr.setState(newState);
    }
  }

  function tap<State, Action>(fn: Effect<State, Action>) {
    effects.push(fn);
    return cause as Cause<Action>;
  }

  return {
    tap,
  };
}
