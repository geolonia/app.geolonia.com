import React from "react";
import { __ } from "@wordpress/i18n";

export const FeaturesRoute = () => {
  return (
    <main
      className={
        "geolonia-app uk-container uk-container-medium uk-margin uk-padding"
      }
    >
      <ul className={"uk-breadcrumb"}>
        <li>
          <span>{__("features", "geolonia-dashboard")}</span>
        </li>
      </ul>
      <span>{__("comming soon", "geolonia-dashboard")}</span>
    </main>
  );
};

export default FeaturesRoute;
