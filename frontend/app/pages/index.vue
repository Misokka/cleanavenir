<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

  const {user} = useAuth()
</script>

<template>
  <div class="wrapper max-w-7xl mx-auto">
    <h1>Contenu principale</h1>

    <div v-if="user">
      <p>Utilisateur connecté</p>
      <p>ID: {{ user.id }}</p>
      <p>Prénom: {{ user.firstname }}</p>
      <p>Nom: {{ user.lastname }}</p>
      <p>Email: {{ user.email }}</p>
    </div>
  </div>
</template>