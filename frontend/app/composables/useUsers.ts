import type { User } from '~/types/user';

export function useUsers(){
  function getUsers(){
    return useFetchApi<User[]>('/api/users',{
      key: 'getAllUsers' //utile pour éviter les problème d'hydration de nuxt
    })
  }

  function getOneUser(userId: number){
    const apiUrl = `/api/users/${userId}`
    return useFetchApi<User>(apiUrl, {
      key: 'getOneUser' //utile pour éviter les problème d'hydration de nuxt
    });
  }

  return {
    getUsers,
    getOneUser
  }
}
