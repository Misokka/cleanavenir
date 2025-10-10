export type UserRole = "CLIENT" | "DIRECTEUR" | "CONSEILLER";

export type UserDTO = {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;          
  emailVerifiedAt: string|null;
  createdAt: string;     
  updatedAt: string;
}