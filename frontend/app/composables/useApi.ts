function getApiUrl(){
  const runtimeConfig = useRuntimeConfig();

  if(import.meta.server){
    return runtimeConfig.serverBackendUrl
  }

  // return runtimeConfig.serverBackendUrl
  return runtimeConfig.public.clientBackendUrl
}

export function useApi<ReturnValue = unknown>(path: string, options = {}){
  const fullUrl = `${getApiUrl()}${path}`

  // ajouter credentials: 'include' plus tard
  return useFetch<ReturnValue>(fullUrl, {...options})
}