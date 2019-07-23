import React from "react";

export const Logo = () => (
  <h1 className={"uk-card-title uk-text-center"}>
    <a href="/">
      <img
        src={`/images/logo.png`}
        alt={"TileCloud"}
        style={{ width: 245, minWidth: "50%" }}
      />
    </a>
  </h1>
);

export default Logo;
