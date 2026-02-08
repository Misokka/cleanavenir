import httpClient from '@/features/api'
import type { User } from '@/context/AuthProvider'
import type { LoginFormData } from '../schemas/login.schema'

type LoginResponse = {
  message: string
  user: User
}

class AuthClient {
  async login(credentials: LoginFormData) {
    const response = await httpClient.post<LoginResponse, LoginFormData>(
      '/auth/login',
      credentials
    )
    return response
  }

  async me() {
    const response = await httpClient.get<User>('/auth/me')
    return response
  }

  async logout() {
    const response = await httpClient.remove('/auth/logout')
    return response
  }
}

export const authClient = new AuthClient()
