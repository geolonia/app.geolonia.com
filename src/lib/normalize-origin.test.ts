import normalizeOrigin from "./normalize-origin";

test("should be normalized", () => {
  const url = "  https://example.com  ";
  expect(normalizeOrigin(url)).toEqual("https://example.com");
});

test("should be normalized slashed url", () => {
  const url = "https://example.com/";
  expect(normalizeOrigin(url)).toEqual("https://example.com");
});

test("should normalize localhost", () => {
  const url = "https://localhost:12345/";
  expect(normalizeOrigin(url)).toEqual("https://localhost:12345");
});

test("should normalize ip address", () => {
  const url = "https://1.2.3.4:5678/";
  expect(normalizeOrigin(url)).toEqual("https://1.2.3.4:5678");
});

test("should not be normalized slashed url", () => {
  const url = "https://example.com";
  expect(normalizeOrigin(url)).toEqual("https://example.com");
});

test("should not normalize localhost", () => {
  const url = "https://localhost:12345";
  expect(normalizeOrigin(url)).toEqual("https://localhost:12345");
});

test("should not normalize ip address", () => {
  const url = "https://1.2.3.4:5678";
  expect(normalizeOrigin(url)).toEqual("https://1.2.3.4:5678");
});

test("should not be normalized if not matched", () => {
  const url = "invalid string";
  expect(normalizeOrigin(url)).toEqual("invalid string");
});
