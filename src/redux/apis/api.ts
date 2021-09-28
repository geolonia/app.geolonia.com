import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getSession } from '../../auth';

type CreateGeojsonMetaParam = {
  teamId: string
  name: string
}

type GeoJSONMetaCollectionResp = {
  geojsons: Geolonia.GeoJSONMeta[]
  totalCount: number
}
type GeoJSONMetaResp = {
  body: {
    _id: string;
    _source: Omit<Geolonia.GeoJSONMeta, 'id'> & { geojsonId: string }
  }
}
type UpdateGeoJSONMetaParam = {
  geojsonId: string,
  name?: string,
  isPublic?: boolean,
  status?: string,
  allowedOrigins?: string[],
  primaryApiKeyId?: string,
}
type UploadLocationDataParam = {
  locationDataFile: File,
  geojsonId: string,
  teamId: string,
}
type LocationDataLinksResp = {
  links: {
    putGeoJSON: string;
    putCSV: string;
    putMBTiles: string;
  }
};
type FeaturesGetResp = {
  features: GeoJSON.Feature[],
  totalCount: number
}

const transformGeoJSONMetaResp2GeoJSONMeta = (resp: GeoJSONMetaResp): Geolonia.GeoJSONMeta => {
  const source = resp.body._source;
  const geojsonMeta = {
    ...source,
    id: source.geojsonId,
    geojsonId: undefined,
  } as Geolonia.GeoJSONMeta;
  return geojsonMeta;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE}/${process.env.REACT_APP_STAGE}/`,
    prepareHeaders: async (headers) => {
      const session = await getSession();
      if (session) {
        headers.set('authorization', session.getIdToken().getJwtToken());
      }
      return headers;
    },
  }),
  tagTypes: [
    'GeoJSONMeta',
  ],
  endpoints: (builder) => ({
    // Geojson Meta
    createGeoJSONMeta: builder.mutation<Geolonia.GeoJSONMeta, CreateGeojsonMetaParam>({
      query: (args) => ({
        url: `/geojsons?teamId=${args.teamId}`,
        method: 'POST',
        body: { name: args.name },
      }),
      transformResponse: transformGeoJSONMetaResp2GeoJSONMeta,
      invalidatesTags: (_result, _error, {teamId}) => ([
        {type: 'GeoJSONMeta', id: `LIST:${teamId}`},
      ]),
    }),
    getGeoJSONMetaCollection: builder.query<Geolonia.GeoJSONMeta[], string>({
      query: (teamId) => `/geojsons?teamId=${teamId}&per_page=10000`,
      transformResponse: (resp: GeoJSONMetaCollectionResp) => resp.geojsons,
      providesTags: (result, _error, teamId) => {
        return (
          result ?
            [
              ...result.map(({id}) => ({ type: 'GeoJSONMeta', id } as const)),
              { type: 'GeoJSONMeta', id: `LIST:${teamId}` },
            ] : [
              { type: 'GeoJSONMeta', id: `LIST:${teamId}` },
            ]
        );
      },
    }),
    getGeoJSONMeta: builder.query<Geolonia.GeoJSONMeta, { geojsonId: string, teamId: string }>({
      query: ({geojsonId, teamId}) => `/geojsons/${geojsonId}?teamId=${teamId}`,
    }),
    updateGeoJSONMeta: builder.mutation<Geolonia.GeoJSONMeta, UpdateGeoJSONMetaParam>({
      query: ({ geojsonId, name, isPublic, status, allowedOrigins, primaryApiKeyId }) => {
        const body: { [key: string]: any } = {};
        if (typeof name === 'string') {
          body.name = name;
        }
        if (typeof isPublic === 'boolean') {
          body.isPublic = isPublic;
        }
        if (typeof status === 'string') {
          body.status = status;
        }
        if (Array.isArray(allowedOrigins)) {
          body.allowedOrigins = allowedOrigins;
        }
        if (typeof primaryApiKeyId === 'string') {
          body.primaryApiKeyId = primaryApiKeyId;
        }
        return ({
          url: `/geojsons/${geojsonId}`,
          method: 'PUT',
          body,
        });
      },
      transformResponse: transformGeoJSONMetaResp2GeoJSONMeta,
      invalidatesTags: (_result, _error, { geojsonId }) => {
        return ([
          { type: 'GeoJSONMeta', id: geojsonId },
        ]);
      },
    }),
    deleteGeoJSONMeta: builder.mutation<void, { teamId: string, geojsonId: string }>({
      query: ({geojsonId}) => ({
        url: `/geojsons/${geojsonId}`,
        method: 'PUT',
        body: { deleted: true },
      }),
      invalidatesTags: (_result, _error, { teamId, geojsonId }) => ([
        { type: 'GeoJSONMeta', id: `LIST:${teamId}` },
        { type: 'GeoJSONMeta', id: geojsonId },
      ]),
    }),
    updateLocationData: builder.mutation<void, UploadLocationDataParam>({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        // First, get the signed URL endpoint
        const signedURLResult = await fetchWithBQ(`geojsons/${arg.geojsonId}/links?teamId=${arg.teamId}`);
        if (signedURLResult.error) throw signedURLResult.error;
        const data = signedURLResult.data as LocationDataLinksResp;
        let signedURL = data.links.putGeoJSON;
        let contentType = 'application/json';
        if (arg.locationDataFile.name.endsWith('.csv')) {
          signedURL = data.links.putCSV;
          contentType = 'text/csv';
        } else if (arg.locationDataFile.name.endsWith('.mbtiles')) {
          signedURL = data.links.putMBTiles;
          contentType = 'application/octet-stream';
        }
        try {
          // Use fetch instead of fetchWithBQ because we don't want to send the authorization
          // header.
          await fetch(signedURL, {
            method: 'PUT',
            headers: { 'Content-Type': contentType },
            body: arg.locationDataFile,
          });
        } catch (e: any) {
          return { error: { status: 'FETCH_ERROR', error: e.name } as FetchBaseQueryError };
        }
        return { data: undefined };
      },
      invalidatesTags: (_result, _error, { teamId }) => ([
        { type: 'GeoJSONMeta', id: teamId },
      ]),
    }),

    // NOTE: not in use currently
    getFeatureCollection: builder.query<GeoJSON.FeatureCollection, { geojsonId: string }>({
      query: ({ geojsonId }) => `/geojsons/${geojsonId}/features`,
      transformResponse: (resp: FeaturesGetResp) => ({
        type: 'FeatureCollection',
        features: resp.features,
      }),
    }),
  }),
});

export const {
  // Geojson Meta
  useCreateGeoJSONMetaMutation,
  useGetGeoJSONMetaCollectionQuery,
  useGetGeoJSONMetaQuery,
  useUpdateGeoJSONMetaMutation,
  useDeleteGeoJSONMetaMutation,

  // LocationData
  useUpdateLocationDataMutation,

  // features
  useGetFeatureCollectionQuery,
} = api;
