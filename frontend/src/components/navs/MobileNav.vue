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
        class="flex items-center justify-center p-0 leading-none"
      >
        <IconsUtil
          icon="burger"
          widthClass="w-10"
          heightClass="h-10"
          colorClass="text-foreground hover:text-primary focus:text-primary transition-colors cursor-pointer"
        />
      </button>
    </SheetTrigger>
    <SheetContent>
      <nav class="flex flex-col gap-4 mt-6 p-2">
        <RouterLink
          to="/"
          class="px-4 py-3 text-lg font-medium hover:bg-muted hover:text-primary focus:text-primary rounded-md transition-colors"
        >
          Accueil
        </RouterLink>

        <RouterLink
          to="/diagnosis"
          class="px-4 py-3 text-lg font-medium hover:bg-muted hover:text-primary focus:text-primary rounded-md transition-colors"
        >
          Diagnostique
        </RouterLink>

        <RouterLink
          to="/login"
          class="group/login flex items-center gap-1 px-4 py-3 text-lg font-medium hover:bg-muted hover:text-primary focus:text-primary rounded-md transition-colors"
        >
          <IconsUtil
            icon="user-circle"
            widthClass="w-6"
            heightClass="h-6"
            colorClass="text-foreground group-hover/login:text-primary group-focus-visible/login:text-primary transition-colors"
          />
          Vous êtes médecin ?
        </RouterLink>
      </nav>
    </SheetContent>
  </Sheet>
</template>
