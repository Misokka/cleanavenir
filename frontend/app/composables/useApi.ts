export function useApiUrl(){
  const runtimeConfig = useRuntimeConfig();

  if(typeof window === undefined){
    return runtimeConfig.serverBackendUrl
  }

  return runtimeConfig.public.clientBackendUrl
}