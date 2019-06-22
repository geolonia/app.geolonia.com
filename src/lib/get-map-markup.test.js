import getMapMarkup from "./get-map-markup";

describe("get simple markup", () => {
  it("should write full markup", () => {
    const apiKey = "MY-API-KEY";
    const result = `<div
  class="tilecloud"
  data-key="MY-API-KEY"
  data-lat="35.681236"
  data-lng="139.767125"
  data-zoom="16"
></div>
<script src="https://api.tilecloud.io/v1/embed"></script>`;
    expect(getMapMarkup(apiKey)).toBe(result);
  });

  it("should write full markup without script", () => {
    const apiKey = "MY-API-KEY";
    const result = `<div
  class="tilecloud"
  data-key="MY-API-KEY"
  data-lat="35.681236"
  data-lng="139.767125"
  data-zoom="16"
></div>`;
    expect(getMapMarkup(apiKey, { noScript: true })).toBe(result);
  });
});
