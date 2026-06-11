import dateParse from './date-parse';
import moment from 'moment';

describe('dateParse', () => {
  it('should parse createAt string to moment object', () => {
    const input = { props: 'value', createAt: '2019-11-19T04:00:00.000Z' };
    const result = dateParse(input);
    expect(result.createAt).toBeInstanceOf(moment);
    expect(result.props).toEqual('value');
  });

  it('should parse updateAt string to moment object', () => {
    const input = { createAt: '2024-01-01T00:00:00Z', updateAt: '2024-06-01T00:00:00Z' };
    const result = dateParse(input);
    expect(result.createAt).toBeInstanceOf(moment);
    expect(result.updateAt).toBeInstanceOf(moment);
  });

  it('should return undefined for missing createAt', () => {
    const input: { createAt?: string; updateAt?: string } = {};
    const result = dateParse(input);
    expect(result.createAt).toBeUndefined();
    expect(result.updateAt).toBeUndefined();
  });

  it('should return undefined for missing updateAt', () => {
    const input = { createAt: '2024-01-01T00:00:00Z' };
    const result = dateParse(input);
    expect(result.updateAt).toBeUndefined();
  });

  it('should preserve other properties', () => {
    const input = { createAt: '2024-01-01T00:00:00Z', foo: 42, bar: 'baz' };
    const result = dateParse(input);
    expect(result.foo).toBe(42);
    expect(result.bar).toBe('baz');
  });

  it('should parse correct date value', () => {
    const input = { createAt: '2024-03-15T12:30:00.000Z' };
    const result = dateParse(input);
    expect((result.createAt as moment.Moment).toISOString()).toBe('2024-03-15T12:30:00.000Z');
  });
});
