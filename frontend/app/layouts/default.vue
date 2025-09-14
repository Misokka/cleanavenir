<template>
  <div class="flex flex-col items-center min-h-screen w-full relative overflow-x-hidden">
    <AppHeader/>
    <main class="grow-1 w-full h-full bg-blue-200">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>