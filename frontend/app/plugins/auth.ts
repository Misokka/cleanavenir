// Fichier : plugins/auth.ts

import { useAuth } from "~/composables/useAuth";

export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchUser } = useAuth();

  // On appelle fetchUser au chargement initial de l'application
  await fetchUser();
});