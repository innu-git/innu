import { Phase } from '@ella/phasor';
import { state, stateManager } from '../../test/dummy.state';
import { make } from '../state';
import { EffectActions } from '../state.types';
import { makePhasorState } from './phasor.state';

describe('Phasor state', () => {
  it('works', async () => {
    const [phasorState, effect] = makePhasorState(
      'user',
      async (input: string) => input.toUpperCase()
    );
    const { tap } = make(stateManager);

    const cause = tap<typeof phasorState, EffectActions<typeof effect>>(effect);

    await cause({
      type: 'run',
      payload: 'hello',
      key: 'user',
    });

    expect(state.user.phase).toBe(Phase.Done);
  });
});
