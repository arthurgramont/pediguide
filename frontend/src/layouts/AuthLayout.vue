<script setup lang="ts">
import IconsUtil from '@/components/utils/IconsUtil.vue'
</script>

<template>
  <main class="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <RouterLink
      to="/"
      class="absolute left-6 top-6 flex items-center gap-1 text-gray-400 hover:text-gray-600 hover:underline transition-colors"
    >
      <IconsUtil icon="arrow-left" width-class="w-5" height-class="h-5" color-class="" />
      <span class="text-sm font-medium">Back</span>
    </RouterLink>
    <div class="w-full max-w-sm">
      <slot />
    </div>
  </main>
</template>
