import { describe, it, expect } from 'vitest';
import { version } from './index.js';

describe('Core Package', () => {
  it('should export version', () => {
    expect(version).toBe('0.0.1');
  });
});
