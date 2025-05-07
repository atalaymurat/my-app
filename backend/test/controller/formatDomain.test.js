const formatDomain = require('../../controllers/utils/formatDomain');

describe('formatDomain Utility Function', () => {
  test('should remove www. prefix from domain', () => {
    const input = 'www.domain.com';
    const expected = 'domain.com';
    expect(formatDomain(input)).toBe(expected);
  });

  test('should handle www. with http://', () => {
    const input = 'http://www.domain.com';
    const expected = 'domain.com';
    expect(formatDomain(input)).toBe(expected);
  });

  test('should handle www. with https://', () => {
    const input = 'https://www.domain.com';
    const expected = 'domain.com';
    expect(formatDomain(input)).toBe(expected);
  });

  test('should preserve domains without www.', () => {
    const input = 'domain.com';
    const expected = 'domain.com';
    expect(formatDomain(input)).toBe(expected);
  });

  test('should handle www. with trailing slash', () => {
    const input = 'www.domain.com/';
    const expected = 'domain.com';
    expect(formatDomain(input)).toBe(expected);
  });

  test('should return non-string values unchanged', () => {
    expect(formatDomain(null)).toBeNull();
    expect(formatDomain(undefined)).toBeUndefined();
    expect(formatDomain(123)).toBe(123);
  });
});