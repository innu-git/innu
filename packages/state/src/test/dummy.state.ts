import { Phase, Rest } from "@ella/phasor";
import { StateManager } from "../lib/state.types";

export const state = {
  count: 0,
  lastAdd: Date.now(),
  user: {
    phase: Phase.Rest
  } as Rest,
};

export function clearState() {
  state.count = 0;
  state.lastAdd = Date.now();
}

export const stateManager: StateManager<typeof state> = {
  getState: () => state,
  setState: (newState) => {
    Object.assign(state, newState);
  },
};

export type Actions =
  | {
      type: 'add';
      payload: number;
    }
  | {
      type: 'clear';
    };
