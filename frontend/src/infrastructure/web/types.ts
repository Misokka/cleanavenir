export type UserRole = "CLIENT" | "DIRECTOR" | "ADVISOR";

export interface UserDTO {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmation: string;
  role: UserRole;
}

export interface AuthResponse {
  user: UserDTO;
  token: string;
  expires_in?: number;
}

export interface AccountDTO {
  id: string;
  iban: string;
  label: string;
  balance: number;
  currency: string;
}

export type OperationKind = "CREDIT" | "DEBIT";

export interface OperationDTO {
  id: string;
  AccountId: string;
  kind: OperationKind;
  amount: number;
  currency: string;
  label: string;
  createdAt: string;
}

export interface SavingAccountDTO {
  id: string;
  AccountId: string;
  isActive: boolean;
  openedAt: string;
}

export interface SavingRateDTO {
  value: number;
  updateAt: string;
}

export interface ApiErrorResponse {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export class AuthenticationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string, public resource?: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface MutationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}