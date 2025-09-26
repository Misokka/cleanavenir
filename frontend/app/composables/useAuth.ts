import type { RegisterForm, RegisterFormsErrors, RegisterFormSuccess, User } from "~/types/user";

export function useAuth(){
  const user = useState<User | undefined>('user', () => undefined);

  function register(credentials: RegisterForm){
    return use$fetchApi<RegisterFormSuccess | RegisterFormsErrors>('/api/auth/register',{
        method: 'POST',
        body: credentials
      })
  }

  async function login(credentials: any){
    const response = await use$fetchApi<{message: string, user: User} | {errorMessage: string}>('/api/auth/login', {
      key: 'login',
      method: 'POST',
      body: credentials
    })

    if('message' in response){
      user.value = response.user;
      return {sucessMessage: response.message}
    } else {
      return {errorMessage: response.errorMessage}
    }
  }

  async function fetchUser(){
    if (user.value) return;

    const {data, status, error, pending} = await useFetchApi<User>('/api/auth/me')
    if(status.value === 'error'){
      user.value = undefined
      console.log(error.value)
    }

    if(status.value === 'success'){
      user.value = data.value
    }
  }

  async function logout(){
    const response = await use$fetchApi<{message: string}>('/api/auth/logout', {
      method: 'DELETE',
      body: {}
    })

    if('message' in response){
      user.value = undefined
      return {message: response.message}
    }
  }

  async function sendMailForgotPassword(email: string){
    const response = await use$fetchApi<{message: string, resetTokenString: string} | {error: string, message: string}>('/api/auth/forgot-password', {
      method: 'POST',
      body: {email}
    })

    return response
  }

  async function resetPassword(newPassword: string, newPasswordConfirm: string, token: string){
    const response = await use$fetchApi<{message: string} | {errorMessage: string}>(`/api/auth/reset-password?token=${token}`, {
      method: 'PATCH',
      body: {newPassword, newPasswordConfirm}
    })

    return response
  }

  return {
    user,
    register,
    login,
    fetchUser,
    logout,
    sendMailForgotPassword,
    resetPassword
  }
}

