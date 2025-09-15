import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    // url utilisé par le côté serveur de nuxt
    serverBackendUrl: process.env.NUXT_SERVER_BACKEND_URL,

    public: {
      // url utilisé par le côté client de nuxt
      clientBackendUrl: process.env.NUXT_CLIENT_BACKEND_URL
    }
  },
  
})