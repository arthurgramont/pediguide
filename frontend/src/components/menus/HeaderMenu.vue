<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Logo from '@/assets/logo.svg'
import DesktopNav from '@/components/navs/DesktopNav.vue'
import MobileNav from '@/components/navs/MobileNav.vue'
</script>

<template>
  <header
    class="max-w-7xl w-full mx-auto sticky top-5 z-50 flex justify-between items-center py-2 px-4 border rounded-lg bg-white/70 backdrop-blur-lg shadow-header"
  >
    <RouterLink to="/" class="flex items-center gap-0.5 cursor-pointer">
      <img :src="Logo" class="w-10 h-10" alt="PediGuide - Accueil" />
      <p class="text-2xl font-semibold">PediGuide</p>
    </RouterLink>

    <DesktopNav class="hidden md:block" />
    <MobileNav class="block md:hidden" />
  </header>
</template>

<style scoped></style>
