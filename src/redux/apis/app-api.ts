import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from '../../auth';

type TeamUpdateParam = {
  teamId: string
  updates: Partial<Omit<Geolonia.Team, 'teamId' | 'role' | 'avatarImage' | 'links' | 'isDeleted'>>
}

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_APP_API_BASE}/${process.env.REACT_APP_STAGE}/`,
    prepareHeaders: async (headers, { getState }) => {
      const session = await getSession();
      if (session) {
        headers.set('authorization', session.getIdToken().getJwtToken());
      }
      return headers;
    },
  }),
  tagTypes: [
    'Team',
  ],
  endpoints: (builder) => ({
    getTeams: builder.query<Geolonia.Team[], undefined>({
      query: () => 'teams',
      providesTags: (result) => (
        result ?
          [
            ...result.map(({teamId}) => ({ type: 'Team', id: teamId } as const)),
            { type: 'Team', id: 'LIST' },
          ] : [
            { type: 'Team', id: 'LIST' },
          ]
      ),
      transformResponse: (resp: Geolonia.Team[]) => (
        resp.filter((team) => !team.isDeleted)
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
    }),
    deleteTeam: builder.mutation<void, string>({
      query: (teamId) => ({
        url: `/teams/${teamId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, teamId) => ([
        { type: 'Team', id: teamId },
      ]),
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = appApi;
