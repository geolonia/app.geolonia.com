import {
  normalize
} from "./normalize-origin";

describe("origin normalization validation", () => {
  it("should be normalized", () => {
    const input = "https://example.com/";
    const expectedOutput = 'https://example.com'
    expect(normalize(input)).toBe(expectedOutput);
  });
});
