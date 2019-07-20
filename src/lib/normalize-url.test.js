import
  normalizeURL
from "./normalize-url";

describe("origin normalization", () => {
  it("should be normalized", () => {
    const input = "https://example.com/aaa";
    const expectedOutput = 'https://example.com'
    expect(normalizeURL(input)).toBe(expectedOutput);
  });

  it("should be rejected", () => {
    const input = "non URL string";
    expect(normalizeURL(input)).toBe(false);
  });
});
