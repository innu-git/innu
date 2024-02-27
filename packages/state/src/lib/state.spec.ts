import { make } from './state';
import { stateManager, state, Actions } from '../test/dummy.state';

describe('state', () => {
  it('should work', async () => {
    const [attach] = make(stateManager);

    const [toss] = attach<typeof state, Actions>(async (getState, action) => {
      switch (action.type) {
        case 'add':
          return {
            count: (getState().count || 0) + action.payload,
          };
        case 'clear':
          return { count: 0, lastAdd: Date.now() };
      }
    });

    await toss({ type: 'add', payload: 1 });

    expect(state.count).toBe(1);
  });
});
