import React from "react";
import ReactDOM from "react-dom";
import { Profile } from "./profile";
import { UserMetaState } from "../../redux/actions/user-meta";
import { cleanup, render } from "@testing-library/react";
import { nextTick } from "q";

// test assets
const noop = () => void 0;
const userMeta: UserMetaState = {
  name: "hello",
  language: "en",
  timezone: "Aasia/Tokyo",
  links: { getAvatar: "", putAvatar: "" },
  avatarImage: undefined
};
const mockSession: any = {
  getIdToken: () => ({
    decodePayload: () => ({ sub: "mock-sub" }),
    getJwtToken: () => "mock id token",
    payload: {}
  })
};

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Profile userMeta={userMeta} setUserMetaState={noop} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe("DOM testing", () => {
  afterEach(cleanup);

  it("setUserMetaState will be called after on save clicked", () => {
    // Mock Fetch
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => ({}) })
    );

    const setHandler = jest.fn(noop);
    const renderResult = render(
      <Profile
        userMeta={userMeta}
        setUserMetaState={setHandler}
        session={mockSession}
      />
    );

    return new Promise((resolve, reject) => {
      renderResult.findByText("Save").then(saveButton => {
        saveButton.click();
        // wait event loop
        nextTick(() => {
          expect(setHandler).toBeCalled();
          resolve();
        });
      });
    });
  });
});
