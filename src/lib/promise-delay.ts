const wait = (msec: number) =>
  new Promise<void>(resolve => setTimeout(resolve, msec));

const catched = Symbol("has catched");

const delayPromise = (promise: Promise<any>, msec: number) => {
  const catchablePromise = promise.catch((err: any) => ({ [catched]: err }));

  return Promise.all([catchablePromise, wait(msec)]).then(results => {
    if (results[0].hasOwnProperty(catched)) {
      throw results[0][catched];
    } else {
      return results[0];
    }
  });
};

export default delayPromise;

type extractGeneric<Type> = Type extends Promise<infer X> ? X : never;

type extracted = extractGeneric<Promise<string>>;
