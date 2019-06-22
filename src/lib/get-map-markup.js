export default (apiKey, opts = {}) => {
  const { noScript = false } = opts;

  const div = `<div
    class="tilecloud"
    data-key="${apiKey}"
    data-lat="35.681236"
    data-lng="139.767125"
    data-zoom="16"
  ></div>`;

  const script = noScript
    ? ""
    : `\n<script src="https://api.tilecloud.io/v1/embed"></script>`;

  return `${div}${script}`;
};
