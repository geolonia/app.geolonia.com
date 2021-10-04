import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getSession } from '../../auth';
import { byCreateAtString } from '../../lib/by-create-at';

type UpdateTeamParam = {
  teamId: string
  updates: Partial<Omit<Geolonia.Team, 'teamId' | 'role' | 'avatarImage' | 'links' | 'isDeleted'>>
}

type UpdateTeamAvatarParam = {
  teamId: string
  file: File
}

type CreateTeamParam = {
  name: string
  billingEmail: string
}

type UpdateApiKeyParam = {
  teamId: string
  keyId: string
  updates: Partial<Omit<Geolonia.Key, 'teamId' | 'keyId' | 'userKey' | 'updateAt' | 'createAt' | 'forceDisabled'>>
}

type CreateApiKeyParam = {
  teamId: string
  name: string
}

type CreateTeamMemberInvitationParam = {
  teamId: string
  email: string
}

type UpdateTeamMemberParam = {
  teamId: string
  memberSub: string
  role: Geolonia.Role
}

type UpdateTeamPlanParam = {
  teamId: string
  planId: string | null
}

type UpdateTeamPaymentMethodParam = {
  teamId: string
  token: string
  last2: string
}

type StripeWrappedResp<T = any> = {
  has_more: boolean
  data: T
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
    'TeamMember',
    'TeamPlan',
    'Plan',
    'TeamInvoice',
    'TeamCharge',
  ],
  endpoints: (builder) => ({
    // Teams
    createTeam: builder.mutation<Geolonia.Team, CreateTeamParam>({
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
    getTeams: builder.query<Geolonia.Team[], void>({
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
    updateTeam: builder.mutation<void, UpdateTeamParam>({
      query: (args) => ({
        url: `teams/${args.teamId}`,
        method: 'PUT',
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
    updateTeamAvatar: builder.mutation<void, UpdateTeamAvatarParam>({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        // First, get the signed URL endpoint
        const signedURLResult = await fetchWithBQ(`/teams/${arg.teamId}/avatar/links`);
        if (signedURLResult.error) throw signedURLResult.error;
        const data = signedURLResult.data as { links: { putAvatar: string } };
        const signedURL = data.links.putAvatar;
        try {
          // Use fetch instead of fetchWithBQ because we don't want to send the authorization
          // header.
          await fetch(signedURL, {
            method: 'PUT',
            headers: {
              'Content-Type': arg.file.type,
            },
            body: arg.file,
          });
        } catch (e: any) {
          return { error: { status: 'FETCH_ERROR', error: e.name } as FetchBaseQueryError };
        }
        return { data: undefined };
      },
      invalidatesTags: (_result, _error, { teamId }) => ([
        { type: 'Team', id: teamId },
      ]),
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
    createApiKey: builder.mutation<Geolonia.DateStringify<Geolonia.Key>, CreateApiKeyParam>({
      query: (args) => ({
        url: `teams/${args.teamId}/keys`,
        method: 'POST',
        body: { name: args.name },
      }),
      invalidatesTags: (_result, _error, {teamId}) => ([
        { type: 'MapKey', id: `LIST:${teamId}` },
      ]),
    }),
    getApiKeys: builder.query<Geolonia.DateStringify<Geolonia.Key>[], string>({
      query: (teamId) => `teams/${teamId}/keys`,
      transformResponse: (resp: Geolonia.DateStringify<Geolonia.Key>[]) => {
        resp.sort(byCreateAtString);
        return resp;
      },
      providesTags: (result, _error, teamId) => (
        result ?
          [
            ...result.map(({keyId}) => ({ type: 'MapKey', id: keyId } as const)),
            { type: 'MapKey', id: `LIST:${teamId}` },
          ] : [
            { type: 'MapKey', id: `LIST:${teamId}` },
          ]
      ),
    }),
    updateApiKey: builder.mutation<void, UpdateApiKeyParam>({
      query: (args) => ({
        url: `teams/${args.teamId}/keys/${args.keyId}`,
        method: 'PUT',
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

    // Team Members
    getTeamMembers: builder.query<Geolonia.Member[], string>({
      query: (teamId) => `teams/${teamId}/members`,
      providesTags: (result, _error, teamId) => (
        result ?
          [
            ...result.map(({userSub}) => ({ type: 'TeamMember', id: userSub } as const)),
            { type: 'TeamMember', id: `LIST:${teamId}` },
          ] : [
            { type: 'TeamMember', id: `LIST:${teamId}` },
          ]
      ),
    }),
    createTeamMemberInvitation: builder.mutation<void, CreateTeamMemberInvitationParam>({
      query: (args) => ({
        url: `teams/${args.teamId}/invitation`,
        method: 'POST',
        body: {
          email: args.email,
        },
      }),
    }),
    updateTeamMember: builder.mutation<void, UpdateTeamMemberParam>({
      query: (args) => ({
        url: `/teams/${args.teamId}/members/${args.memberSub}`,
        method: 'PUT',
        body: { role: args.role },
      }),
      invalidatesTags: (_result, _error, {teamId, memberSub}) => ([
        { type: 'TeamMember', id: memberSub },
        { type: 'TeamMember', id: `LIST:${teamId}` },
      ]),
    }),
    deleteTeamMember: builder.mutation<void, { teamId: string, memberSub: string }>({
      query: ({teamId, memberSub}) => ({
        url: `/teams/${teamId}/members/${memberSub}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, {teamId, memberSub}) => ([
        { type: 'TeamMember', id: memberSub },
        { type: 'TeamMember', id: `LIST:${teamId}` },
      ]),
    }),

    // Team member invitation
    describeInvitation: builder.query<{ email: string, exp: number }, string>({
      query: (invitationToken) => `/invitation/${invitationToken}`,
    }),
    acceptInvitation: builder.mutation<void, { invitationToken: string, email: string }>({
      query: (args) => ({
        url: '/accept-invitation',
        method: 'POST',
        body: args,
      }),
    }),

    // Billing
    getTeamPlan: builder.query<Geolonia.TeamPlanDetails, string>({
      query: (teamId) => ({
        url: `/teams/${teamId}/plan`,
      }),
      providesTags: (_result, _error, teamId) => ([
        { type: 'TeamPlan', id: teamId },
      ]),
    }),
    getPlans: builder.query<Geolonia.Billing.Plan[], void>({
      query: () => ({
        url: '/plans',
      }),
      providesTags: [
        { type: 'Plan', id: 'LIST' },
      ],
    }),
    updateTeamPlan: builder.mutation<void, UpdateTeamPlanParam>({
      query: (args) => ({
        url: `/teams/${args.teamId}/plan`,
        method: 'PUT',
        body: {
          planId: args.planId,
        },
      }),
      invalidatesTags: (_result, _error, {teamId}) => ([
        { type: 'TeamPlan', id: teamId },
      ]),
    }),
    updateTeamPaymentMethod: builder.mutation<void, UpdateTeamPaymentMethodParam>({
      query: (args) => ({
        url: `/teams/${args.teamId}/payment`,
        method: 'POST',
        body: {
          token: args.token,
          last2: args.last2,
        },
      }),
      invalidatesTags: (_response, _error, { teamId }) => ([
        { type: 'Team', id: teamId },
      ]),
    }),
    getTeamInvoices: builder.query<StripeWrappedResp<Geolonia.Invoice[]>, string>({
      query: (teamId) => ({
        url: `/teams/${teamId}/invoices`,
      }),
      providesTags: (_response, _error, teamId) => ([
        { type: 'TeamInvoice', id: `LIST:${teamId}` },
      ]),
    }),
    getTeamCharges: builder.query<StripeWrappedResp<Geolonia.Charge[]>, string>({
      query: (teamId) => ({
        url: `/teams/${teamId}/charges`,
      }),
      providesTags: (_response, _error, teamId) => ([
        { type: 'TeamCharge', id: `LIST:${teamId}` },
      ]),
    }),
  }),
});

export const {
  // Teams
  useCreateTeamMutation,
  useGetTeamsQuery,
  useUpdateTeamMutation,
  useUpdateTeamAvatarMutation,
  useDeleteTeamMutation,

  // Map Keys
  useCreateApiKeyMutation,
  useGetApiKeysQuery,
  useUpdateApiKeyMutation,
  useDeleteApiKeyMutation,

  // Team Members
  useGetTeamMembersQuery,
  useCreateTeamMemberInvitationMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,

  // Team Member invitation
  useDescribeInvitationQuery,
  useAcceptInvitationMutation,

  // Billing
  useGetTeamPlanQuery,
  useGetPlansQuery,
  useUpdateTeamPlanMutation,
  useGetTeamInvoicesQuery,
  useGetTeamChargesQuery,
  useUpdateTeamPaymentMethodMutation,
} = appApi;
