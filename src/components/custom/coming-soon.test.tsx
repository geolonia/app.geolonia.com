import React from "react";
import { ComingSoon } from "./coming-soon";
import renderer from "react-test-renderer";

test("it should render label", () => {
  const component = renderer.create(
    <ComingSoon>
      <div style={{ width: 100, height: 100 }}>
        <span>{"hello"}</span>
      </div>
    </ComingSoon>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
