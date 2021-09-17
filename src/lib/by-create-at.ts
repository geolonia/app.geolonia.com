import moment from 'moment';

// This is Array.prototype.sort comparison funtion

type DateInclusive = { createAt: moment.Moment | void };
type DateInclusiveStr = { createAt?: string };

export const byCreateAt = <P extends DateInclusive>(a: P, b: P) => {
  const numA = a.createAt ? a.createAt.unix() : 0;
  const numB = b.createAt ? b.createAt.unix() : 0;
  return numB - numA;
};

export const byCreateAtString = <P extends DateInclusiveStr>(a: P, b: P) => {
  const A = a.createAt ? a.createAt : '1970-01-01T00:00:00Z';
  const B = b.createAt ? b.createAt : '1970-01-01T00:00:00Z';
  if (A < B)
    return -1;
  if (A > B)
    return 1;
  return 0;
};

export default byCreateAt;
