declare namespace Geolonia {
  import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
  import Moment from 'moment';

  namespace Redux {
    /**
     * ============ Redux States =============
     */
    namespace State {
      type AuthSupport = {
        currentUser?: string;
        session?: Geolonia.Session;
        accessToken?: string;
        hasTrouble: boolean;
        isReady: boolean;
        isVerified: boolean;
      };
      type UserMeta = User;
      type Team = {
        data: Geolonia.Team[];
        selectedIndex: number;
      };
      type MapKey = {
        [teamId: string]: {
          data: Geolonia.Key[];
          error?: boolean;
        };
      };
      type TeamMember = {
        [teamId: string]: {
          data: Geolonia.Member[];
          error?: boolean;
        };
      };
    }
    /**
     * App Root State
     */
    type AppState = {
      authSupport: Redux.State.AuthSupport;
      userMeta: Redux.State.UserMeta;
      team: Redux.State.Team;
      mapKey: Redux.State.MapKey;
      teamMember: Redux.State.TeamMember;
    };
  }

  /**
   * ========== Common Types for Dashboard Developers =============
   */
  type Session = AmazonCognitoIdentity.CognitoUserSession | null | undefined;

  type TeamBillingMethod = 'STRIPE' | 'INVOICE' | 'DISABLED';

  type User = {
    name: string;
    email: string;
    username: string;
    language: string;
    timezone: string;
    links: {
      getAvatar: string;
      putAvatar: string;
    };
    avatarImage: string | void;
  };
  type Team = {
    teamId: string;
    name: string;
    description: string;
    url: string;
    role: Member['role'];
    billingEmail: string;
    isDeleted?: boolean;
    links: {
      getAvatar: string;
      putAvatar: string;
    };
    avatarImage: string | void;
    last2?: string;
    maxMemberLength: number;
    baseFreeMapLoadCount: number;
    billingMode: TeamBillingMethod;
    featureFlags: { [key: string]: boolean };
  };
  type Key = {
    keyId: string;
    userKey: string;
    name: string;
    description: string;
    enabled: boolean;
    forceDisabled?: boolean;
    allowedOrigins: string[];
    createAt: Moment.Moment | void;
    updateAt?: Moment.Moment | void;
  };
  type Role = 'Owner' | 'Member' | 'Suspended';
  type Member = Omit<Geolonia.User, 'links'> & {
    userSub: string;
    role: Role;
    links: { getAvatar: string };
  };

  type ErrorCodes = 'UnAuthorized' | 'Network' | 'Unknown';

  type APIResult<T> =
    | { data: T; error: false }
    | { error: true; code: ErrorCodes; message: string };

  type DateStringify<T> = Omit<T, 'createAt' | 'updateAt'> & {
    createAt?: string;
    updateAt?: string;
  };

  type Geometry = {
    coordinates: [];
    type: string;
  };

  type FeatureProperties = {
    [key: string]: string | number;
  };

  type Feature = {
    geometry: Geometry;
    id: string;
    properties: FeatureProperties;
    type: string;
  };

  type Invoice = {
    id: string;
    total: number;
    currency: string;
    period_start: number;
    period_end: number;
    ending_balance: null | number;
    starting_balance: number;
    invoice_pdf: string | null | undefined;
    descriptions: (string | null)[];
  };

  type Charge = {
    id: string;
    invoice: string | null;
    receipt_url: string | null;
  };
}
