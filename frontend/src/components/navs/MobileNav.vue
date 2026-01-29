<script setup lang="ts">
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { RouterLink } from 'vue-router'
import IconsUtil from '@/components/utils/IconsUtil.vue'
</script>

<template>
  <Sheet>
    <SheetTrigger as-child v-bind="$attrs">
      <button
        type="button"
        aria-label="Ouvrir le menu de navigation"
        class="group flex items-center justify-center rounded-md p-1 leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <IconsUtil
          icon="burger"
          widthClass="w-7"
          heightClass="h-7"
          colorClass="text-foreground group-hover:text-primary group-focus-visible:text-primary transition-colors"
        />
      </button>
    </SheetTrigger>
    <SheetContent>
      <nav class="flex flex-col gap-4 mt-6 p-2">
        <RouterLink
          to="/"
          class="rounded-md px-4 py-3 text-lg font-medium transition-colors hover:underline focus-visible:bg-muted focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Accueil
        </RouterLink>

        <RouterLink
          to="/diagnosis"
          class="rounded-md px-4 py-3 text-lg font-medium transition-colors hover:underline focus-visible:bg-muted focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Diagnostic
        </RouterLink>

        <RouterLink
          to="/login"
          class="group/login flex items-center gap-1 rounded-md px-4 py-3 text-lg font-medium transition-colors hover:underline focus-visible:bg-muted focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <IconsUtil
            icon="user-circle"
            widthClass="w-6"
            heightClass="h-6"
            colorClass="text-foreground group-focus-visible/login:text-primary transition-colors"
          />
          Vous êtes médecin ?
        </RouterLink>
      </nav>
    </SheetContent>
  </Sheet>
</template>
