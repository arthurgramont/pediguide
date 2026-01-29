<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="flex justify-center mt-12 p-6 border-t border-border/70 bg-background/80">
      <p class="text-xs text-muted-foreground">
        PediGuide© @ {{ currentYear }}. Tous droits réservés.
      </p>
  </footer>
</template>
