<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import IconsUtil from '@/components/utils/IconsUtil.vue'
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuLink as-child :class="navigationMenuTriggerStyle()">
          <RouterLink to="/" tabindex="0">Accueil</RouterLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink as-child :class="navigationMenuTriggerStyle()">
          <RouterLink to="/diagnosis" tabindex="0">Diagnostic</RouterLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink as-child :class="navigationMenuTriggerStyle()">
          <RouterLink to="/login" tabindex="0" class="group/login flex-row gap-2">
            <IconsUtil
              icon="user-circle"
              widthClass="w-6"
              heightClass="h-6"
              colorClass="text-foreground group-hover/login:text-accent-foreground group-focus-visible/login:text-accent-foreground transition-colors"
            />
            Vous êtes médecin ?
          </RouterLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
