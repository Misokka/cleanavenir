<script setup lang="ts">
  const {resetPassword} = useAuth();
  const route = useRoute()
  const {token} = route.query

  const passwordCredentials = ref({
    newPassword: "",
    newPasswordConfirm: ""
  })

  const errorMessge = ref<string | undefined>(undefined)
  const successMessage = ref<string | undefined>(undefined)

  async function handleSubmit(){
    const response = await resetPassword(
      passwordCredentials.value.newPassword,
      passwordCredentials.value.newPasswordConfirm,
      token as string
    )

    if('errorMessage' in response){
      errorMessge.value = response.errorMessage
    } else {
      successMessage.value = response.message
    }
  }
</script>

<template>
  <div class="wrapper max-w-7xl mx-auto p-2">
    <h1>Création d'un nouveau mot de passe</h1>

    <form method="post" @submit.prevent="handleSubmit">
      <div>
        <label for="newPassword">Nouveau mot de passe: </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          required
          class="bg-white ml-2 rounded p-2"
          v-model="passwordCredentials.newPassword"
        >
      </div>

      <div>
        <label for="newPassword">Confirmation du nouveau mot de passe: </label>
        <input
          type="password"
          id="newPasswordConfirm"
          name="newPasswordConfirm"
          required
          class="bg-white ml-2 rounded p-2"
          v-model="passwordCredentials.newPasswordConfirm"
        >
      </div>

      <div v-if="errorMessge" class="text-red-200">{{ errorMessge }}</div>
      <div v-if="successMessage" class="text-green-500">{{ successMessage }}</div>

      <button type="submit"></button>
    </form>
  </div>
</template>