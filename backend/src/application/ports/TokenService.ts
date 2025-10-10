export interface TokenService {
  create(payload: Record<string, unknown>, ttlSeconds: number): Promise<string>;
  verify(token: string): Promise<Record<string, unknown> | null>; 
}