const wait = (msec: number) =>
  new Promise(resolve => setTimeout(resolve, msec));

const catched = Symbol("is-catched");

const delayPromise = (promise: Promise<any>, msec: number) => {
  const catchedPromise = promise.catch(err => ({ [catched]: err }));

  return Promise.all([catchedPromise, wait(msec)]).then(result => {
    if (result[0][catched]) {
      throw result[0][catched];
    } else {
      return result[0];
    }
  });
};

export default delayPromise;
