import { ph } from './phasor';
import { Phase, Rerun, Rest, Run } from './phasor.types';

describe('ph', () => {
  describe('rest', () => {
    it('should return a Rest object', () => {
      const result = ph.rest();
      expect(result).toEqual({ phase: Phase.Rest });
    });
  });

  describe('run', () => {
    it('should return a Run object with the provided input', () => {
      const input = 'test';
      const result = ph.run(input);
      expect(result).toEqual({ phase: Phase.Run, input });
    });
  });

  describe('done', () => {
    it('should return a Done object with the provided input and result', () => {
      const input = 'test';
      const resultValue = 42;
      const result = ph.done(input, resultValue);
      expect(result).toEqual({ phase: Phase.Done, input, result: resultValue });
    });
  });

  describe('rerun', () => {
    it('should return a Rerun object with the provided input and result', () => {
      const input = 'test';
      const resultValue = 42;
      const result = ph.rerun(input, resultValue);
      expect(result).toEqual({
        phase: Phase.Rerun,
        input,
        result: resultValue,
      });
    });
  });

  describe('is', () => {
    describe('rest', () => {
      it('should return true for a Rest object', () => {
        const phasor: Rest = { phase: Phase.Rest };
        const result = ph.is.rest(phasor);
        expect(result).toBe(true);
      });

      it('should return false for non-Rest objects', () => {
        const phasor: Run<string> = { phase: Phase.Run, input: 'test' };
        const result = ph.is.rest(phasor);
        expect(result).toBe(false);
      });
    });

    // Add similar tests for other is functions (running, done, rerunning, pending, phasor)

    describe('pending', () => {
      it('should return true for a Run object', () => {
        const phasor: Run<string> = { phase: Phase.Run, input: 'test' };
        const result = ph.is.pending(phasor);
        expect(result).toBe(true);
      });

      it('should return true for a Rerun object', () => {
        const phasor: Rerun<string, number> = {
          phase: Phase.Rerun,
          input: 'test',
          result: 42,
        };
        const result = ph.is.pending(phasor);
        expect(result).toBe(true);
      });

      it('should return false for non-pending objects', () => {
        const phasor: Rest = { phase: Phase.Rest };
        const result = ph.is.pending(phasor);
        expect(result).toBe(false);
      });
    });

    describe('phasor', () => {
      it('should return true for a Rest object', () => {
        const phasor: Rest = { phase: Phase.Rest };
        const result = ph.is.phasor(phasor);
        expect(result).toBe(true);
      });

      it('should return true for a Run object', () => {
        const phasor: Run<string> = { phase: Phase.Run, input: 'test' };
        const result = ph.is.phasor(phasor);
        expect(result).toBe(true);
      });

      // Add similar tests for other phasor types

      it('should return false for non-phasor objects', () => {
        const phasor = 'test';
        const result = ph.is.phasor(phasor);
        expect(result).toBe(false);
      });
    });
  });
});
