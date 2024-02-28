import { Phase } from '@innu/phasor';
import { state, stateManager } from '../../test/dummy.state';
import { make } from '../state';
import { TakerActions } from '../state.types';
import { makePhasorState } from './phasor.state';
import { PhasorAction } from './phasor.state.types';

describe('Phasor state', () => {
  it('works', async () => {
    const [phasorState, taker] = makePhasorState(
      'user',
      async (input: string) => input.toUpperCase()
    );
    const [attach] = make(stateManager);

    const [toss] = attach<typeof phasorState, TakerActions<typeof taker>>(
      taker
    );

    await toss({
      type: PhasorAction.Run,
      payload: 'hello',
      key: 'user',
    });

    expect(state.user.phase).toBe(Phase.Done);
  });
});
