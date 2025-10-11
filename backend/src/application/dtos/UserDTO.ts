export type UserRole = "CLIENT" | "DIRECTOR" | "ADVISOR";

export type UserDTO = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  isActive: boolean;          
  emailVerifiedAt: string|null;
  createdAt: string;     
  updatedAt: string;
}