import React from "react";
import ReactDOM from "react-dom";
import { Profile } from "./profile";
import { User } from "../../types";
import { cleanup, render } from "@testing-library/react";

// test assets
const noop = () => void 0;
const userMeta: User = {
  name: "hello",
  username: "aaa",
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
  // @ts-ignore
  ReactDOM.render(<Profile user={userMeta} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe("DOM testing", () => {
  afterEach(cleanup);

  it("setUserMetaState will be called after on save clicked", () => {
    // Mock Fetch
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );

    const setHandler = jest.fn(noop);
    const renderResult = render(
      // @ts-ignore
      <Profile user={userMeta} updateUser={setHandler} session={mockSession} />
    );

    return new Promise((resolve, reject) => {
      renderResult.findByText("Save").then(saveButton => {
        saveButton.click();
        // wait event loop
        process.nextTick(() => {
          expect(setHandler).toBeCalled();
          resolve();
        });
      });
    });
  });
});
