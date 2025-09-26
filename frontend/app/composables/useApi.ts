function getApiUrl(){
  const runtimeConfig = useRuntimeConfig();

  // utilise url serveur si côté serveur
  if(import.meta.server){
    return runtimeConfig.serverBackendUrl
  }

  // utilise url client si côté client
  return runtimeConfig.public.clientBackendUrl
}

/**
 * 
 * @description À utiliser pour faire des requêtes API vers le backend côté serveur notamment pour le SSR
 */
export function useFetchApi<ReturnValue = unknown>(path: string, options = {}){
  // construction de l'url
  const fullUrl = `${getApiUrl()}${path}`

  // retourne la fonction useFetch avec l'url et les options passés en paramètre
  // ajouter credentials: 'include' plus tard
  return useFetch<ReturnValue>(fullUrl, {...options, credentials: 'include'})
}

/**
 * @description À utiliser pour faire des requêtes API vers le backend côté client
 */
export function use$fetchApi<ReturnValue = unknown>(path: string, options = {}){
  const fullUrl = `${getApiUrl()}${path}`
  return $fetch<ReturnValue>(fullUrl, {...options, credentials: 'include'})
}