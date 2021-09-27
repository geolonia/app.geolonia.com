import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getSession } from '../../auth';

type CreateGeojsonMetaParam = {
  teamId: string
  name: string
}

type GeoJSONMetaGetResp = {
  geojsons: Geolonia.GeoJSONMeta[]
  totalCount: number
}
type GeoJSONMetaPostResp = {
  body: {
    _id: string;
    _source: Omit<Geolonia.GeoJSONMeta, 'geojsonId'> | { geojsonId: string }
  }
}

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
    createGeojsonMeta: builder.mutation<string, CreateGeojsonMetaParam>({
      query: (args) => ({
        url: `/geojsons?teamId=${args.teamId}`,
        method: 'POST',
        body: { name: args.name },
      }),
      transformResponse: (resp: GeoJSONMetaPostResp) => resp.body._id,
      invalidatesTags: (_result, _error, {teamId}) => ([
        {type: 'GeoJSONMeta', id: `LIST:${teamId}`},
      ]),
    }),
    getGeojsonMeta: builder.query<Geolonia.GeoJSONMeta[], string>({
      query: (teamId) => `/geojsons?teamId=${teamId}&per_page=10000`,
      transformResponse: (resp: GeoJSONMetaGetResp) => resp.geojsons,
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
  }),
});

export const {
  // Geojson Meta
  useCreateGeojsonMetaMutation,
  useGetGeojsonMetaQuery,
} = api;
