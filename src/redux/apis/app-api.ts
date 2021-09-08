import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from '../../auth';
import { byCreateAtString } from '../../lib/by-create-at';

type TeamUpdateParam = {
  teamId: string
  updates: Partial<Omit<Geolonia.Team, 'teamId' | 'role' | 'avatarImage' | 'links' | 'isDeleted'>>
}

type TeamCreateParam = {
  name: string
  billingEmail: string
}

type ApiKeyUpdateParam = {
  teamId: string
  keyId: string
  updates: Partial<Omit<Geolonia.Key, 'teamId' | 'keyId' | 'userKey' | 'updateAt' | 'createAt' | 'forceDisabled'>>
}

type ApiKeyCreateParam = {
  teamId: string
  name: string
}

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_APP_API_BASE}/${process.env.REACT_APP_STAGE}/`,
    prepareHeaders: async (headers) => {
      const session = await getSession();
      if (session) {
        headers.set('authorization', session.getIdToken().getJwtToken());
      }
      return headers;
    },
  }),
  tagTypes: [
    'Team',
    'MapKey',
  ],
  endpoints: (builder) => ({
    // Teams
    createTeam: builder.mutation<Geolonia.Team, TeamCreateParam>({
      query: (args) => ({
        url: '/teams',
        method: 'POST',
        body: {
          name: args.name,
          billingEmail: args.billingEmail,
        },
      }),
      invalidatesTags: [
        { type: 'Team', id: 'LIST' },
      ],
    }),
    getTeams: builder.query<Geolonia.Team[], undefined>({
      query: () => '/teams',
      transformResponse: (resp: Geolonia.Team[]) => (
        resp.filter((team) => !team.isDeleted)
      ),
      providesTags: (result) => (
        result ?
          [
            ...result.map(({teamId}) => ({ type: 'Team', id: teamId } as const)),
            { type: 'Team', id: 'LIST' },
          ] : [
            { type: 'Team', id: 'LIST' },
          ]
      ),
    }),
    updateTeam: builder.mutation<void, TeamUpdateParam>({
      query: (args) => ({
        url: `teams/${args.teamId}`,
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: args.updates,
      }),
      invalidatesTags: (_result, _error, {teamId}) => ([
        { type: 'Team', id: teamId },
      ]),
      async onQueryStarted({ teamId, updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          appApi.util.updateQueryData('getTeams', undefined, (draft) => {
            return draft.map((team) => {
              if (team.teamId !== teamId) return team;
              return { ...team, ...updates };
            });
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteTeam: builder.mutation<void, string>({
      query: (teamId) => ({
        url: `/teams/${teamId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, teamId) => ([
        { type: 'Team', id: 'LIST' },
        { type: 'Team', id: teamId },
      ]),
    }),

    // Map Keys
    createApiKey: builder.mutation<Geolonia.DateStringify<Geolonia.Key>, ApiKeyCreateParam>({
      query: (args) => ({
        url: `teams/${args.teamId}/keys`,
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: { name: args.name },
      }),
      invalidatesTags: (_result, _error, {teamId}) => ([
        { type: 'MapKey', id: `LIST:${teamId}` },
      ]),
    }),
    getApiKeys: builder.query<Geolonia.DateStringify<Geolonia.Key>[], { teamId: string }>({
      query: ({ teamId }) => `teams/${teamId}/keys`,
      transformResponse: (resp: Geolonia.DateStringify<Geolonia.Key>[]) => {
        resp.sort(byCreateAtString);
        return resp;
      },
      providesTags: (result, _error, { teamId }) => (
        result ?
          [
            ...result.map(({keyId}) => ({ type: 'MapKey', id: keyId } as const)),
            { type: 'MapKey', id: `LIST:${teamId}` },
          ] : [
            { type: 'MapKey', id: `LIST:${teamId}` },
          ]
      ),
    }),
    updateApiKey: builder.mutation<void, ApiKeyUpdateParam>({
      query: (args) => ({
        url: `teams/${args.teamId}/keys/${args.keyId}`,
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: args.updates,
      }),
      invalidatesTags: (_result, _error, {keyId}) => ([
        { type: 'MapKey', id: keyId },
      ]),
    }),
    deleteApiKey: builder.mutation<void, { teamId: string, keyId: string }>({
      query: ({teamId, keyId}) => ({
        url: `/teams/${teamId}/keys/${keyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, {teamId, keyId}) => ([
        { type: 'MapKey', id: `LIST:${teamId}` },
        { type: 'MapKey', id: keyId },
      ]),
    }),
  }),
});

export const {
  // Teams
  useCreateTeamMutation,
  useGetTeamsQuery,
  useUpdateTeamMutation,
  useDeleteTeamMutation,

  // Map Keys
  useCreateApiKeyMutation,
  useGetApiKeysQuery,
  useUpdateApiKeyMutation,
  useDeleteApiKeyMutation,
} = appApi;
