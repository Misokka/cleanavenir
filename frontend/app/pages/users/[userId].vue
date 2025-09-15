<script setup lang="ts">
  const route = useRoute()
  const userId = parseInt(route.params.userId as string)
  const response = await useGetOneUser(userId);
  // console.log(response);

  const {data: user, status, pending, error} = response
</script>

<template>
  <div class="wrapper max-w-7xl mx-auto">
    <div v-if="pending">
      <p>Chargement des données</p>
    </div>

    <div v-if="error">
      <p>Erreur lors du chargement des données {{ error }}</p>
    </div>

    <div v-if="status == 'success' && user">
      <p>id: {{ user.id }}</p>
      <p>Prénom: {{ user.firstname }}</p>
      <p>Nom: {{ user.lastname }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Password: {{ user.password }}</p>
    </div>
  </div>
</template>