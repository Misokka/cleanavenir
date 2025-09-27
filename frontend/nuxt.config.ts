import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  
  // Configuration pour le serveur de développement
  devServer: {
    host: '0.0.0.0', // Permet d'écouter sur toutes les interfaces
    port: 3000
  },
  
  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      // Autoriser les hosts spécifiques
      allowedHosts: [
        'kickdeal.store',
        'api.kickdeal.store',
        'localhost',
        '127.0.0.1',
        '0.0.0.0'
      ],
    
    }
  },
  
  runtimeConfig: {
    // url utilisé par le côté serveur de nuxt
    serverBackendUrl: process.env.NUXT_SERVER_BACKEND_URL || 'http://localhost:8000',

    public: {
      // url utilisé par le côté client de nuxt
      clientBackendUrl: process.env.NUXT_CLIENT_BACKEND_URL || 'http://localhost:8000'
    }
  },
})