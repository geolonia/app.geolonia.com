import { sleep } from './sleep';

const catched = Symbol('has catched');

const delayPromise = (promise: Promise<any>, msec: number): Promise<any> => {
  const catchablePromise = promise.catch((err: any) => ({ [catched]: err }));

  return Promise.all([catchablePromise, sleep(msec)]).then((results) => {
    if (Object.prototype.hasOwnProperty.call(results[0], catched)) {
      throw results[0][catched];
    } else {
      return results[0];
    }
  });
};

export default delayPromise;
