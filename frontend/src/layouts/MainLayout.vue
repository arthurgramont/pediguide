<script setup lang="ts">
import HeaderMenu from '@/components/menus/HeaderMenu.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col px-5 md:px-20">
    <a href="#main-content" class="skip-link">Aller au contenu</a>
    <HeaderMenu />
    <main id="main-content" class="flex-1" tabindex="-1">
      <slot />
    </main>
  </div>
</template>
