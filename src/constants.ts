import { __ } from "@wordpress/i18n";

export const Roles = {
  Owner: "Owner" as "Owner",
  Member: "Member" as "Member",
  Suspended: "Suspended" as "Suspended"
};

export const errorCodes = {
  UnAuthorized: "UnAuthorized" as "UnAuthorized",
  Unknown: "Unknown" as "Unknown",
  Network: "Network" as "Network"
};

export const avatarLimitSize = 10; // Unit: MB
export const messageDisplayDuration = 3000; // Unit: milli sec.
export const GeoJsonMaxUploadSize = 5000000; // 5MB
export const SpritesEndpoint = "https://sprites.geolonia.com/basic.json";
export const pageTransitionInterval = 500;

export const MapStylesAPI = "https://cdn.geolonia.com/style/styles.json";

export const getErrorMessage = (code: Geolonia.ErrorCodes) => {
  switch (code) {
    case errorCodes.UnAuthorized:
      return __("You are not authorized to do this operation.");
    case errorCodes.Network:
      return __("Network error.");
    case errorCodes.Unknown:
      return __("Unknown error.");
    default:
      return __("Unknown error.");
  }
};
