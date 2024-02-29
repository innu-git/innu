import { res, Status } from './result';

describe('res', () => {
  describe('ok', () => {
    it('should return a Result object with status Ok and the provided value', () => {
      const value = 'test';
      const result = res.ok(value);
      expect(result).toEqual({ status: Status.Ok, value });
    });
  });

  describe('err', () => {
    it('should return a Result object with status Err and the provided error', () => {
      const error = new Error('Test error');
      const result = res.err(error);
      expect(result).toEqual({ status: Status.Err, error });
    });
  });

  describe('is', () => {
    describe('ok', () => {
      it('should return true for a Result object with status Ok', () => {
        const result = { status: Status.Ok, value: 'test' };
        const isOk = res.is.ok(result);
        expect(isOk).toBe(true);
      });

      it('should return false for a Result object with status Err', () => {
        const result = { status: Status.Err, error: new Error('Test error') };
        const isOk = res.is.ok(result);
        expect(isOk).toBe(false);
      });
    });

    describe('err', () => {
      it('should return true for a Result object with status Err', () => {
        const result = { status: Status.Err, error: new Error('Test error') };
        const isErr = res.is.err(result);
        expect(isErr).toBe(true);
      });

      it('should return false for a Result object with status Ok', () => {
        const result = { status: Status.Ok, value: 'test' };
        const isErr = res.is.err(result);
        expect(isErr).toBe(false);
      });
    });

    describe('res', () => {
      it('should return true for a valid Result object', () => {
        const result = { status: Status.Ok, value: 'test' };
        const isResult = res.is.res(result);
        expect(isResult).toBe(true);
      });

      it('should return false for a non-Result object', () => {
        const result = 'test';
        const isResult = res.is.res(result);
        expect(isResult).toBe(false);
      });
    });
  });
});
