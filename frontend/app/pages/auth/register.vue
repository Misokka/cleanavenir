<script setup lang="ts">
import type { RegisterForm } from '~/types/user';

  const registerForm = ref<RegisterForm>({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  })

  const errors = ref<Record<string, string> | undefined>(undefined);
  const successMessage = ref<string | undefined>(undefined)

  async function handleRegister(){
    // console.log(registerForm.value);
    const response = await useRegister(registerForm.value)

    if('errors' in response){
      errors.value = response.errors
      console.log(errors.value)
    }

    if('user' in response){
      successMessage.value = response.message
    }
  }

</script>

<template>
  <div class="wrapper max-w-7xl mx-auto p-2">
    <h1 class="text-2xl">Inscription</h1>

    <p v-if="successMessage" class="text-green-200">{{ successMessage }}</p>
    <form method="post" @submit.prevent=handleRegister>
      <div class="space-y-2">
        <!-- Prénom -->
        <div>
          <label for="firstname">Prénom:</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            required
            v-model=registerForm.firstname
            class="bg-white ml-2 rounded p-2"
          >
          <p v-if="errors && errors['firstname']" class="text-red-500">{{errors['firstname']}}</p>
        </div>

        <!-- Nom -->
        <div>
          <label for="lastname">Nom:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            required
            v-model=registerForm.lastname
            class="bg-white ml-2 rounded p-2"
          >
          <p v-if="errors && errors['lastname']" class="text-red-500">{{errors['lastname']}}</p>
        </div>

        <!-- email -->
        <div>
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            v-model=registerForm.email
            class="bg-white ml-2 rounded p-2"
          >
          <p v-if="errors && errors['email']" class="text-red-500">{{errors['email']}}</p>
        </div>

        <!-- Mot de passe -->
        <div>
          <label for="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            v-model=registerForm.password
            class="bg-white ml-2 rounded p-2"
          >
          <p v-if="errors && errors['password']" class="text-red-500">{{errors['password']}}</p>
        </div>
      </div>
      <button type="submit" class="inline-block bg-orange-200 p-2 rounded">Envoyer</button>
    </form>
  </div>
</template>