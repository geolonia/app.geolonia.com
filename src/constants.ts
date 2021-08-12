import { __ } from '@wordpress/i18n';

export const Roles = {
  Owner: 'Owner' as const,
  Member: 'Member' as const,
  Suspended: 'Suspended' as const,
};

export const errorCodes = {
  UnAuthorized: 'UnAuthorized' as const,
  Unknown: 'Unknown' as const,
  Network: 'Network' as const,
};

export const avatarLimitSize = 10; // Unit: MB
export const messageDisplayDuration = 3_000; // Unit: milli sec.
export const GeoJsonMaxUploadSize = 1_000_000; // 1MB
export const GeoJsonMaxUploadSizePaid = 100_000_000; // 100MB
export const SpritesEndpoint = 'https://sprites.geolonia.com/basic.json';
export const pageTransitionInterval = 500;

export const MapStylesAPI = 'https://cdn.geolonia.com/style/styles.json';

export const getErrorMessage: (code: Geolonia.ErrorCodes) => string = (code) => {
  switch (code) {
    case errorCodes.UnAuthorized:
      return __('You are not authorized to do this operation.');
    case errorCodes.Network:
      return __('Network error.');
    case errorCodes.Unknown:
      return __('Unknown error.');
    default:
      return __('Unknown error.');
  }
};
