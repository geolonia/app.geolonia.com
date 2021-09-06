import moment from 'moment';

// This is Array.prototype.sort comparison funtion

type DateInclusive = { createAt: moment.Moment | void };

export const byCreateAt = <P extends DateInclusive>(a: P, b: P) => {
  const numA = a.createAt ? a.createAt.unix() : 0;
  const numB = b.createAt ? b.createAt.unix() : 0;
  return numB - numA;
};

export default byCreateAt;
