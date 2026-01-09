<script setup lang="ts">
import { RouterLink } from 'vue-router'

const legalLinks = [
  { label: 'Mentions légales', to: '/mentions-legales' },
  { label: 'Politique de confidentialité', to: '/politique-confidentialite' },
  { label: "Conditions d'utilisation", to: '/conditions-utilisation' },
  { label: 'Gestion des cookies', to: '/cookies' },
]

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-12 border-t border-border/70 bg-background/80">
    <div class="mx-auto w-full max-w-7xl px-4 py-8">
      <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div class="max-w-md space-y-2">
          <p class="text-lg font-semibold text-foreground">PediGuide</p>
          <p class="text-sm text-muted-foreground">
            Pré-consultation pédiatrique claire et apaisante, pensée pour les familles.
          </p>
        </div>

        <nav aria-label="Liens légaux" class="flex flex-col gap-2 text-sm">
          <p class="text-sm font-semibold text-foreground">Légal</p>
          <RouterLink
            v-for="link in legalLinks"
            :key="link.to"
            :to="link.to"
            class="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
      </div>

      <p class="mt-6 text-xs text-muted-foreground">
        © {{ currentYear }} PediGuide. Tous droits réservés.
      </p>
    </div>
  </footer>
</template>
