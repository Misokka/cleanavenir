<script setup lang="ts">
  const route = useRoute()
  const userId = parseInt(route.params.userId as string)
  const response = await useGetOneUser(userId);
  console.log(response);
</script>

<template>
  <div class="wrapper max-w-7xl mx-auto">
    <h1 class="text-2xl">userID: {{ userId }}</h1>
  </div>
</template>