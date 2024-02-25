import { isPhasor } from "./phasor.guards";
import { Phase } from "./phasor.types";

describe('Phasor', () => {
  it('checks if a phasor is at rest', () => {
    expect(isPhasor.atRest({ phase: Phase.Rest })).toBe(true);
  });

  it('checks if a phasor is running', () => {
    expect(isPhasor.running({ phase: Phase.Run, input: 'input' })).toBe(true);
  });

  it('checks if a phasor is done', () => {
    expect(isPhasor.done({ phase: Phase.Done, result: 'result', input: 'input' })).toBe(true);
  });

  it('checks if a phasor is failed', () => {
    expect(isPhasor.failed({ phase: Phase.Fail, input: 'input', error: new Error() })).toBe(true);
  });

  it('checks if a phasor is rerunning', () => {
    expect(isPhasor.rerunning({ phase: Phase.Rerun, input: 'input' })).toBe(true);
  });

  it('checks if a phasor is settled', () => {
    expect(isPhasor.settled({ phase: Phase.Done, result: 'result', input: 'input' })).toBe(true);
    expect(isPhasor.settled({ phase: Phase.Fail, input: 'input', error: new Error() })).toBe(true);
  });

  it('checks if a phasor is pending', () => {
    expect(isPhasor.pending({ phase: Phase.Run, input: 'input' })).toBe(true);
    expect(isPhasor.pending({ phase: Phase.Rerun, input: 'input' })).toBe(true);
  });
});
