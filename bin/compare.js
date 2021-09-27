// compare bundle size for CI

const child_process = require('child_process');
const exec = require('util').promisify(child_process.exec);
const fs = require('fs/promises');

const BEFORE_DIR = 'build_prev/static';
const AFTER_DIR = 'build/static';

const statFileSize = (prefix) => (result) =>
  result.stdout
    .split('\n')
    .filter((filename) => !!filename && !filename.endsWith('.map'))
    .map(async (filepath) => {
      const { name, postfix } = filepath.match(
        new RegExp(`^${prefix}/(?<name>.*)\\.([0-9a-f]{8})(?<postfix>.*)$`),
      ).groups;
      return {
        key: `${name}${postfix}`,
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
    return `${Math.round(100 * size / 1024 ** 2) / 100}MB`;
  } else if (absSize > 1024) {
    return `${Math.round(100 * size / 1024) / 100}kB`;
  } else {
    return `${size}B`;
  }
};

const format = (each, total) => {
  return ` ## bundle size comparison

${total}

|file|before|after|diff|
|:--|:--|:--|:--|
${each.map((stat) => `|${stat.key}|${stat.before}|${stat.after}|${stat.diff}|`).join('\n')}`;
};

const compare = async () => {
  const [before, after] = await Promise.all([
    exec(`find ${BEFORE_DIR} -type f`).then(statFileSize(BEFORE_DIR)),
    exec(`find ${AFTER_DIR} -type f`).then(statFileSize(AFTER_DIR)),
  ]);

  const beforeTotal = Object.values(before).reduce((prev, size) => prev + size, 0);
  const afterTotal = Object.values(after).reduce((prev, size) => prev + size, 0);
  let diffTotal = afterTotal - beforeTotal;
  if (diffTotal >= 0) {
    diffTotal = `+${unit(diffTotal)}`;
  } else {
    diffTotal = unit(diffTotal);
  }

  const beforeFileConut = Object.keys(before).length;
  const afterFileCount = Object.keys(after).length;

  const total = `before: ${unit(beforeTotal)} (${beforeFileConut} ${beforeFileConut > 1 ? 'files' : 'file'})
after: ${unit(afterTotal)} (${afterFileCount} ${afterFileCount > 1 ? 'files' : 'file'})
**diff**: ${diffTotal}`;

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

  process.stdout.write(format(stats, total));
};

compare();
