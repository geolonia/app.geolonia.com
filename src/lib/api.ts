export const buildApiAppUrl = (path: string) => (
  `${process.env.REACT_APP_APP_API_BASE}/${process.env.REACT_APP_STAGE}${path}`
);

export const buildApiUrl = (path: string) => (
  `${process.env.REACT_APP_API_BASE}/${process.env.REACT_APP_STAGE}${path}`
);
