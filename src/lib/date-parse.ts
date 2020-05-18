import moment from "moment";

type DateInclusive = {
  updateAt?: string;
  createAt?: string;
};

/**
 * parase date params as moment objects
 * @param data
 */
export const dateParse = <A extends DateInclusive>(data: A) => {
  const createAt = data.createAt ? moment(data.createAt) : void 0;
  const updateAt = data.updateAt ? moment(data.updateAt) : void 0;
  return {
    ...data,
    createAt,
    updateAt
  };
};

export default dateParse;
