<script setup lang="ts">
 const users = await useGetUsers();
 console.log(users);
</script>

<template>
  <div class="wrapper max-w-7xl mx-auto">
    <p>Récupération des utilisateurs</p>
  </div>
</template>