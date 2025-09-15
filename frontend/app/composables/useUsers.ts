import type { User } from '~/types/user';

export function useGetUsers(){
  return useApi<User[]>('/api/users', {
    key: 'getAllUsers'
  })
}

export function useGetOneUser(userId: number){
  const apiUrl = `/api/users/${userId}`
  return useApi<User>(apiUrl, {
    key: 'getOneUser'
  });
}