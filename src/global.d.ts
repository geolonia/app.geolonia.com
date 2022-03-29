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
    customMaxMapLoadCount?: number;
    billingMode: TeamBillingMethod;
    featureFlags: { [key: string]: boolean };
  };
  type Key = {
    keyId: string;
    userKey: string;
    secretKey: string;
    name: string;
    description: string;
    enabled: boolean;
    forceDisabled?: boolean;
    allowedOrigins: string[];
    createAt: Moment.Moment | void;
    updateAt?: Moment.Moment | void;
  }
  type GeoJSONMeta = {
    id: string;
    name: string;
    updateAt: string;
    isPublic: boolean;
    allowedOrigins: string[];
    status: string;
    teamId: string;
    gvp_status: string; // 'progress' | 'created' | 'failure';
    primaryApiKeyId?: string;
  }
  type TeamPlanDetails = {
    planId: string | null | undefined;
    subscription?: {
      cancel_at_period_end: boolean;
      current_period_start: string;
      current_period_end: string;
    };
    customer?: {
      balance: number;
      currency: string;
    };
    upcoming?: {
      /** クレジットカードに請求する金額。アカウントにクレジットがあるや、割引が適用されているなどの場合、割引が適用されたあとの金額となります。 */
      amount_due: number;

      /** 今度支払いが試行される時間。ISO8601 */
      next_payment_attempt: string;

      /** 割引 */
      discounts: {
        amount: number;
        name: string;
      }[];

      /** 小計 - 割引が入っていない */
      subtotal: number;

      /** 税額 */
      tax: number;

      /** 合計 - アカウントクレジットから支払われる場合は0以上。割引が適用されている場合は割引後の合計となります。 */
      total: number;
    };
    usage: {
      count: number;
      lastLoggedRequest: string;
      updated: string;
      details: {
        [s: string]: [
          {
            aggregationUnit: string;
            count: number;
            date: string;
            lastLoggedRequest: string;
          }
        ];
      };
    };
    freePlanDetails?: {
      current_period_start: string
      current_period_end: string
    };
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

  // type TileStatus = 'unknown' | 'idoling' | 'started-uploading' | 'started-processing' | 'created' | 'failure';
  namespace Billing {
    type Duration = '' | 'month' | 'year';

    type FreePlan = {
      planId: null;
      name: string;
      duration: Duration;
      contactRequired: undefined;
    };

    type ConstantPlan = {
      planId: string;
      name: string;
      price: number;
      duration: Duration;
      maxMemberLength: number;
      baseFreeMapLoadCount: number;
      contactRequired: false;
    };

    // Currently Unused
    // type AppliancePlan = {
    //   planId: string;
    //   name: string;
    //   contactRequired: boolean;
    //   unitPrice: number;
    // };

    type Plan =
      | FreePlan
      | ConstantPlan;
      // | AppliancePlan;
  }
}
