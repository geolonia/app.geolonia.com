const fs = require("fs");
const path = require("path");
const assert = require("assert");

const basePath = path.resolve(__dirname, "..", "src", "lang");
const jeds = fs
  .readdirSync(basePath)
  .filter(filename => filename.match(/\.json$/))
  .map(filename => `${basePath}/${filename}`);

for (const jed of jeds) {
  const jedObject = JSON.parse(fs.readFileSync(jed, "utf-8"));
  const messages = jedObject.locale_data.messages;
  delete messages[""];
  const translationKeys = Object.keys(jedObject.locale_data.messages);
  for (const translationKey of translationKeys) {
    let failure = false;
    if (Array.isArray(messages[translationKey])) {
      failure = messages[translationKey].join("") === "";
    } else if (typeof messages[translationKey] === "string") {
      failure = messages[translationKey] === "";
    } else {
      failure = true;
    }
    if (failure) {
      throw new Error(`[Failure] No translation found for ${translationKey}.\n`);
    }
  }
}
process.stderr.write(`[Success] Everything seems to have been translated..\n`);
