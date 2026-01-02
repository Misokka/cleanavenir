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
    RIB: (id: string) => `/accounts/${id}/rib`, // Ajouter si manquant
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
    HISTORY: '/operations/history',
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
    PRODUCTS: {
      LIST: "/savings/products"
    }
  },

  INVESTMENTS: {
    PORTFOLIOS: {
      MY_PORTFOLIO: "/portfolios/my-portfolio",
      CREATE: "/portfolios/create",
    },
    STOCKS: {
      LIST: '/stocks',
      DETAILS: (id: string) => `/stocks/${id}`,
      UPDATE: (id: string) => `/stocks/${id}/update`,
    },
    ORDERS: {
      LIST_MY_ORDERS: '/orders/list-my-orders',
      CREATE: "/orders/create"
    },
    POSITIONS: '/investments/positions',
  },

  LOANS: {
    LIST: '/loans',
    SIMULATE: '/loans/simulate',
    REQUEST: '/loans/request',
    DETAILS: (id: string) => `/loans/${id}`,
    APPROVE: (id: string) => `/loans/${id}/approve`,
  },

  COMPANIES: {
    LIST: '/admin/companies',
  },

  ADMIN: {
    CLIENTS: '/admin/clients',
    BAN_CLIENT: (id: string) => `/admin/clients/${id}/ban`,
    UNBAN_CLIENT: (id: string) => `/admin/clients/${id}/unban`,
    STATISTICS: '/admin/statistics',
    SET_SAVING_RATE: '/admin/savings/rate',
    SAVINGS: {
      PRODUCTS: {
        CREATE: "/admin/savings/products",
        LIST: "/admin/savings/products",
        UPDATE: (id: string) => `/admin/savings/products/${id}`
      }
    }
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
export type AuthEndpoint = typeof API_ENDPOINTS.AUTH;
export type AccountEndpoint = typeof API_ENDPOINTS.ACCOUNTS;
export type OperationEndpoint = typeof API_ENDPOINTS.OPERATIONS;
export type SavingsEndpoint = typeof API_ENDPOINTS.SAVINGS;
export type LoansEndpoint = typeof API_ENDPOINTS.LOANS;
export type AdminEndpoint = typeof API_ENDPOINTS.ADMIN;