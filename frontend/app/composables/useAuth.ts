import type { RegisterForm, RegisterFormsErrors, RegisterFormSuccess, User } from "~/types/user";

export function useRegister(credentials: RegisterForm){
  return use$fetchApi<RegisterFormSuccess | RegisterFormsErrors>('/api/auth/register',{
      method: 'POST',
      body: credentials
    })
}

export function useLogin(credentials: any){
  return use$fetchApi<{message: string} | {errorMessage: string}>('/api/auth/login', {
    method: 'POST',
    body: credentials
  })
}

export function useLogout(){
  return use$fetchApi<{message: string}>('/api/auth/logout', {
    method: 'POST',
    body: {}
  })
}