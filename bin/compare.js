const child_process = require('child_process');
const exec = require('util').promisify(child_process.exec);
const fs = require('fs/promises');
const { map } = require('traverse');

const BEFORE_DIR = 'build_prev/static';
const AFTER_DIR = 'build/static';

const statFileSize = (prefix) => (result) =>
  result.stdout
    .split('\n')
    .filter((x) => !!x)
    .map(async (filepath) => {
      const { name, postfix } = filepath.match(
        new RegExp(`^${prefix}/(?<name>.*)\\.([0-9a-f]{8})(?<postfix>.*)$`),
      ).groups;
      return {
        key: `${name}.<hash>${postfix}`,
        size: (await fs.stat(filepath)).size,
      };
    })
    .reduce(async (prevPromise, itemPromise) => {
      const { key, size } = await itemPromise;
      const prev = await prevPromise;
      prev[key] = size;
      return Promise.resolve(prev);
    }, Promise.resolve({}));

const unit = (size) => {
  const absSize = Math.abs(size);
  if (absSize > 1024 ** 2) {
    return `${Math.round(size / 1024 ** 2)}MB`;
  } else if (absSize > 1024) {
    return `${Math.round(size / 1024)}kB`;
  } else {
    return `${size}B`;
  }
};

const format = (stats) => {
  return ` ## bundle size

\`\`\`makdown
|file|before|after|diff|
|:--|:--|:--|:--|
${stats.map((stat) => `|${stat.key}|${stat.before}|${stat.after}|${stat.diff}|`).join('\n')}
\`\`\``;
};

const compare = async () => {
  const [before, after] = await Promise.all([
    exec(`find ${BEFORE_DIR} -type f`).then(statFileSize(BEFORE_DIR)),
    exec(`find ${AFTER_DIR} -type f`).then(statFileSize(AFTER_DIR)),
  ]);

  const stats = Object.keys(after).map((key) => {
    if (!(key in before)) {
      return { key, before: '-', after: unit(after[key]), diff: `${unit(after[key])}(new)` };
    }

    let diff = after[key] - before[key];
    if (diff >= 0) {
      diff = `+${unit(diff)}`;
    } else {
      diff = unit(diff);
    }
    return { key, before: unit(before[key]), after: unit(after[key]), diff };
  });

  process.stdout.write(format(stats));
};

compare();
