<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

  const loginCredentials = ref({
    email: "",
    password: ""
  })

  const {user, login, logout} = useAuth()

  const successMessage = ref<string | undefined>(undefined)
  const errorMessage = ref<string | undefined>(undefined)

  async function handleLogin(){
    const response = await login(loginCredentials.value);
    if('errorMessage' in response){
      errorMessage.value = response.errorMessage
    } else {
      successMessage.value = response.sucessMessage
    }
  }

  async function handleLogut(){
    const response = await logout()
    if(response){
      successMessage.value = response.message
    }
  }
</script>

<template>
  <div class="wrapper max-w-7xl mx-auto p-3">
    <h1 class="text-2xl">Connexion</h1>

    <p v-if="successMessage" class="text-orange-300">{{ successMessage }}</p>
    <p v-if="errorMessage" class="text-red-200">{{ errorMessage }}</p>
    <form method="post" @submit.prevent="handleLogin">
      <div class="space-y-2">
        <div>
          <label for="email">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="email"
            required
            class="bg-white p-2 ml-2 rounded"
            v-model="loginCredentials.email"
          >
        </div>

        <div>
          <label for="password">Mot de passe:</label>
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            required
            class="bg-white p-2 ml-2 rounded"
            v-model="loginCredentials.password"
          >
        </div>
      </div>

      <button type="submit" class="bg-orange-200 p-3 mt-4">Me connecter</button>
    </form>


    <form v-if="user" method="post" @submit.prevent="handleLogut">
      <button type="submit" class="bg-red-300 p-3 mt-2">Me déconnecter</button>
    </form>
  </div>
</template>