import { Toss, Taker, StateManager } from './state.types';

export function make<
  State,
  Manager extends StateManager<State> = StateManager<State>
>(mgr: Manager) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const takers: Taker<any, any>[] = [];

  async function toss<Action>(action: Action) {
    for (const taker of takers) {
      const newState = await taker(mgr.getState, action, toss);
      if (newState) mgr.setState(newState);
    }
  }

  function attach<OwnState = State, OwnAction = unknown>(
    fn: Taker<State & OwnState, OwnAction>
  ) {
    takers.push(fn);
    return [toss as Toss<OwnAction>] as const;
  }

  return [attach]
}
