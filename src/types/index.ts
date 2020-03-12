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
import {
  State as GeosearchState,
  Geosearch as _Geosearch,
  ReadableGeosearch as _ReadableGeosearch,
  WritableGeosearch as _WritableGeosearch
} from "../redux/actions/geosearch";

// app type
export type AppState = {
  authSupport: AuthSupportState;
  userMeta: UserMetaState;
  team: TeamState;
  mapKey: MapKeyState;
  teamMember: TeamMemberState;
  geosearch: GeosearchState;
};

export type ErrorCodes = "UnAuthorized" | "Network" | "Unknown";

export const errorCodes = {
  UnAuthorized: "UnAuthorized" as "UnAuthorized",
  Unknown: "Unknown" as "Unknown",
  Network: "Network" as "Network"
};

export type APIResult<T> =
  | { data: T; error: false }
  | { error: true; code: ErrorCodes; message: string };

export type Session = AuthSupportState["session"];
export type User = UserMetaState;
export type Key = _Key;
export type Team = _Team;
export type Member = _Member;
export type Role = _Role;
export const Roles = _Roles;

export type DateStringify<T> = Omit<T, "createAt" | "updateAt"> & {
  createAt?: string;
  updateAt?: string;
};

export type Geosearch = _Geosearch;
export type ReadableGeosearch = _ReadableGeosearch;
export type WritableGeosearch = _WritableGeosearch;

export type HashBy<T, K extends string | number> = {
  [id: string]: Omit<T, K>;
};
