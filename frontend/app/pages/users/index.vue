<script setup lang="ts">
 const {data: users, error, status, pending} = await useGetUsers();
</script>

<template>
  <div class="wrapper max-w-7xl mx-auto">
    <div v-if="pending">
      <p>Chargement des utilisateurs...</p>
    </div>

    <div v-else-if="error">
      <p>Erreur lors de la récupération des données : {{ error.message }}</p>
    </div>

    <div v-else>
      <div v-if="users && users.length > 0">
        <ul v-for="user in users">
          <div class="mb-2">
            <li>id: {{ user.id }}</li>
            <li>Prénom: {{ user.firstname }}</li>
            <li>Nom: {{ user.lastname }}</li>
            <li>email: {{ user.email }}</li>
            <li>password: {{ user.password }}</li>
          </div>
 
        </ul>
      </div>
      <p v-else>Aucun utilisateur trouvé.</p>
    </div>
  </div>
</template>