export interface User{
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface RegisterForm{
  firstname: string
  lastname: string
  email: string
  password: string
}

export interface RegisterFormSuccess{
  message: string
  user: User
}

export interface RegisterFormsErrors{
  errors: Record<string, string>
}
