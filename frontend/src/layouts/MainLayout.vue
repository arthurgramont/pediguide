<script setup lang="ts">
import HeaderMenu from '@/components/menus/HeaderMenu.vue'
</script>

<template>
  <main class="flex flex-col min-h-screen px-5 md:px-20">
    <HeaderMenu />
    <slot />
  </main>
</template>
