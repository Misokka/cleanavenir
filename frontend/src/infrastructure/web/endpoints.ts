export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },

  ACCOUNTS: {
    LIST: '/accounts',
    DETAILS: (id: string) => `/accounts/${id}`,
    CREATE: '/accounts',
    UPDATE: (id: string) => `/accounts/${id}`,
    DELETE: (id: string) => `/accounts/${id}`,
    BALANCE: (id: string) => `/accounts/${id}/balance`,
  },

  OPERATIONS: {
    LIST: '/operations',
    BY_ACCOUNT: (accountId: string) => `/accounts/${accountId}/operations`,
    DETAILS: (id: string) => `/operations/${id}`,
    CREATE: '/operations',
    RECENT: '/operations/recent',
    TRANSFER: '/operations/transfer',
  },

  SAVINGS: {
    LIST: '/savings',
    CREATE: '/savings',
    CURRENT_RATE: '/savings/rate',
    APPLY_INTEREST: '/savings/apply-interest',
    ACCOUNTS: '/savings/accounts',
    RATES: '/savings/rates',
    CREATE_ACCOUNT: '/savings/accounts',
    ACCOUNT_DETAILS: (id: string) => `/savings/accounts/${id}`,
  },

  INVESTMENTS: {
    PORTFOLIOS: '/investments/portfolios',
    STOCKS: '/investments/stocks',
    ORDERS: '/investments/orders',
    POSITIONS: '/investments/positions',
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
export type AuthEndpoint = typeof API_ENDPOINTS.AUTH;
export type AccountEndpoint = typeof API_ENDPOINTS.ACCOUNTS;
export type OperationEndpoint = typeof API_ENDPOINTS.OPERATIONS;
export type SavingsEndpoint = typeof API_ENDPOINTS.SAVINGS;