import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from '../../auth';

// TODO: FetchBaseQueryError を使う

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
type FeaturesGetResp = {
  features: GeoJSON.Feature[],
  totalCount: number
}

const transformGeoJSONMetaResp2GeoJSONMeta = (resp: GeoJSONMetaResp): Geolonia.GeoJSONMeta => {
  const geojsonMeta = {
    ...resp.body._source,
    id: resp.body._source.geojsonId,
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
    listGeojsonMeta: builder.query<Geolonia.GeoJSONMeta[], string>({
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
    getGeojsonMeta: builder.query<Geolonia.GeoJSONMeta, { geojsonId: string, teamId: string }>({
      query: ({geojsonId, teamId}) => `/geojsons/${geojsonId}?teamId=${teamId}`,
    }),
    updateGeoJSONMeta: builder.mutation<
    Geolonia.GeoJSONMeta,
    {
      geojsonId: string,
      name?: string,
      isPublic?: boolean,
      status?: string,
      allowedOrigins?: string[],
      primaryApiKeyId?: string,
    }
    >({
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
      invalidatesTags: (_result, _error, { geojsonId }) => ([
        { type: 'GeoJSONMeta', id: geojsonId },
      ]),
    }),
    deleteGeoJSONMeta: builder.mutation<void, { teamId: string, geojsonId: string }>({
      query: ({geojsonId}) => ({
        url: `/geojsons/${geojsonId}`,
        method: 'PUT',
        body: { deleted: true },
      }),
      invalidatesTags: (_result, _error, {teamId, geojsonId}) => ([
        { type: 'GeoJSONMeta', id: `LIST:${teamId}` },
        { type: 'GeoJSONMeta', id: geojsonId },
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
  useListGeojsonMetaQuery,
  useGetGeojsonMetaQuery,
  useUpdateGeoJSONMetaMutation,
  useDeleteGeoJSONMetaMutation,

  // features
  useGetFeatureCollectionQuery,
} = api;
