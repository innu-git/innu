import { make } from './state';
import { stateManager, state, Actions } from '../test/dummy.state';

describe('state', () => {
  it('should work', async () => {
    const { tap } = make(stateManager);

    const cause = tap<typeof state, Actions>(async (getState, action) => {
      switch (action.type) {
        case 'add':
          return {
            ...getState(),
            count: (getState().count || 0) + action.payload,
          };
        case 'clear':
          return { count: 0, lastAdd: Date.now() };
      }
    });

    await cause({ type: 'add', payload: 1 });

    expect(state.count).toBe(1);
  });
});
