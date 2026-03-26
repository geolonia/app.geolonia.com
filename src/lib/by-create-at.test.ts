import moment from 'moment';
import { byCreateAt, byCreateAtString } from './by-create-at';

describe('byCreateAt', () => {
  it('should sort newer items first', () => {
    const a = { createAt: moment('2024-01-01') };
    const b = { createAt: moment('2024-06-01') };
    expect(byCreateAt(a, b)).toBeGreaterThan(0);
    expect(byCreateAt(b, a)).toBeLessThan(0);
  });

  it('should return 0 for equal dates', () => {
    const a = { createAt: moment('2024-01-01') };
    const b = { createAt: moment('2024-01-01') };
    expect(byCreateAt(a, b)).toBe(0);
  });

  it('should treat undefined createAt as epoch (oldest)', () => {
    const a = { createAt: moment('2024-01-01') };
    const b = { createAt: undefined as moment.Moment | void };
    expect(byCreateAt(a, b)).toBeLessThan(0);
  });

  it('should work with Array.sort', () => {
    const items = [
      { createAt: moment('2024-03-01'), name: 'mid' },
      { createAt: moment('2024-01-01'), name: 'old' },
      { createAt: moment('2024-06-01'), name: 'new' },
    ];
    items.sort(byCreateAt);
    expect(items.map((i) => i.name)).toEqual(['new', 'mid', 'old']);
  });
});

describe('byCreateAtString', () => {
  it('should sort by ISO string ascending', () => {
    const a = { createAt: '2024-01-01T00:00:00Z' };
    const b = { createAt: '2024-06-01T00:00:00Z' };
    expect(byCreateAtString(a, b)).toBe(-1);
    expect(byCreateAtString(b, a)).toBe(1);
  });

  it('should return 0 for equal strings', () => {
    const a = { createAt: '2024-01-01T00:00:00Z' };
    const b = { createAt: '2024-01-01T00:00:00Z' };
    expect(byCreateAtString(a, b)).toBe(0);
  });

  it('should treat undefined createAt as epoch', () => {
    const a: { createAt?: string } = { createAt: undefined };
    const b: { createAt?: string } = { createAt: '2024-01-01T00:00:00Z' };
    expect(byCreateAtString(a, b)).toBe(-1);
  });

  it('should work with Array.sort', () => {
    const items = [
      { createAt: '2024-03-01T00:00:00Z', name: 'mid' },
      { createAt: '2024-01-01T00:00:00Z', name: 'old' },
      { createAt: '2024-06-01T00:00:00Z', name: 'new' },
    ];
    items.sort(byCreateAtString);
    expect(items.map((i) => i.name)).toEqual(['old', 'mid', 'new']);
  });
});
