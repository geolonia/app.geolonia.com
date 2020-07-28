import React from "react";
import ReactDOM from "react-dom";
import { Profile } from "./profile";

// test assets
const userMeta: Geolonia.User = {
  name: "hello",
  email: "test@geolonia.com",
  username: "aaa",
  language: "en",
  timezone: "Asia/Tokyo",
  links: { getAvatar: "", putAvatar: "" },
  avatarImage: undefined
};

it("renders without crashing", () => {
  const div = document.createElement("div");
  // @ts-ignore
  ReactDOM.render(<Profile user={userMeta} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
