<script setup lang="ts">
  const {sendMailForgotPassword} = useAuth();

  const email = ref<string>("")
  const emailError = ref<string | undefined>(undefined)
  const emailSuccess = ref<string | undefined>(undefined)

  async function handleSubmit(){
    const response = await sendMailForgotPassword(email.value);
    if('error' in response){
      emailError.value = response.error
    } else {
      emailSuccess.value = response.message
    }
  }
</script>

<template>
  <div class="wrapper max-w-7xl mx-auto p-2">
    <h1 class="text-2xl font-semibold mb-2">Récupération du mot de passe</h1>

    <form method="post" @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email: </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          class="bg-white ml-2 rounded p-2"
          v-model="email"
        >
        <div v-if="emailError" class="text-red-500">{{ emailError }}</div>
        <div v-if="emailSuccess" class="text-green-500">{{ emailSuccess }}</div>
      </div>

      <button type="submit" class="p-3 bg-orange-200 mt-4">Envoyer</button>
    </form>
  </div>
</template>