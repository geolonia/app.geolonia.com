import { State as AuthSupportState } from "../redux/actions/auth-support";
import { State as UserMetaState } from "../redux/actions/user-meta";
import { State as TeamState, Team as _Team } from "../redux/actions/team";
import { State as MapKeyState, Key as _Key } from "../redux/actions/map-key";
import {
  State as TeamMemberState,
  Member as _Member,
  Role as _Role,
  Roles as _Roles
} from "../redux/actions/team-member";

// app type
export type AppState = {
  authSupport: AuthSupportState;
  userMeta: UserMetaState;
  team: TeamState;
  mapKey: MapKeyState;
  teamMember: TeamMemberState;
};

export type Session = AuthSupportState["session"];
export type User = UserMetaState;
export type Key = _Key;
export type Team = _Team;
export type Member = _Member;
export type Role = _Role;
export const Roles = _Roles;