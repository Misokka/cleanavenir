function getApiUrl(){
  const runtimeConfig = useRuntimeConfig();

  // utilise url serveur si côté serveur
  if(import.meta.server){
    return runtimeConfig.serverBackendUrl
  }

  // utilise url client si côté client
  return runtimeConfig.public.clientBackendUrl
}

export function useApi<ReturnValue = unknown>(path: string, options = {}){
  // construction de l'url
  const fullUrl = `${getApiUrl()}${path}`

  // retourne la fonction useFetch avec l'url et les options passés en paramètre
  // ajouter credentials: 'include' plus tard
  return useFetch<ReturnValue>(fullUrl, {...options})
}