import React from "react";
import ReactDOM from "react-dom";
import { Profile } from "./profile";
import { User } from "../../types";

// test assets
const userMeta: User = {
  name: "hello",
  email: "test@geolonia.com",
  username: "aaa",
  language: "en",
  timezone: "Aasia/Tokyo",
  links: { getAvatar: "", putAvatar: "" },
  avatarImage: undefined
};

it("renders without crashing", () => {
  const div = document.createElement("div");
  // @ts-ignore
  ReactDOM.render(<Profile user={userMeta} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
