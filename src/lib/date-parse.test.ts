import dateParse from "./date-parse";
import moment from "moment";

test("should parse date", () => {
  const input = { props: "value", createAt: "2019-11-19T04:00:00.000Z" };
  const result = dateParse(input);
  expect(result.createAt).toBeInstanceOf(moment);
  expect(result.updateAt).toBeUndefined();
  expect(result.props).toEqual("value");
});
