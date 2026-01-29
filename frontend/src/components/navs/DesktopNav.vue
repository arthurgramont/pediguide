<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import IconsUtil from '@/components/utils/IconsUtil.vue'
import { isAuthenticated } from '@/services/api'

const route = useRoute()
const isDoctorAuthenticated = ref(isAuthenticated())

watch(
  () => route.fullPath,
  () => {
    isDoctorAuthenticated.value = isAuthenticated()
  },
)
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <RouterLink to="/">Accueil</RouterLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <RouterLink to="/diagnosis">Diagnostic</RouterLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <template v-if="isDoctorAuthenticated">
        <NavigationMenuItem>
          <NavigationMenuLink as-child>
            <RouterLink to="/dashboard">Dashboard</RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink as-child>
            <RouterLink to="/profile">Profil</RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </template>
      <NavigationMenuItem v-else>
        <NavigationMenuLink as-child>
          <RouterLink to="/login" class="flex-row gap-2 items-center">
            <IconsUtil
              icon="user-circle"
              widthClass="w-6"
              heightClass="h-6"
              colorClass="text-foreground transition-colors"
            />
            Vous etes medecin ?
          </RouterLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
