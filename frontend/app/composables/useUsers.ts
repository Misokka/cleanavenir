import { ref } from 'vue'

export function useGetUsers(){
  const apiUrl = useApiUrl();
  return useFetch(`${apiUrl}/users`);
}

export function useGetOneUser(userId: number){
  const apiUrl = useApiUrl();
  return useFetch(`${apiUrl}/users/user/${userId}`);
}