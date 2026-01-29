<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import IconsUtil from '@/components/utils/IconsUtil.vue'
import api, { isAuthenticated } from '@/services/api'

const route = useRoute()
const isDoctorAuthenticated = ref(false)

const resolveDoctorAuth = async () => {
  if (!isAuthenticated()) {
    isDoctorAuthenticated.value = false
    return
  }

  try {
    await api.doctors.getMe()
    isDoctorAuthenticated.value = true
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    const isAuthError = message.includes('401') || message.includes('403')
    if (isAuthError) {
      api.auth.logout()
    }
    isDoctorAuthenticated.value = false
  }
}

onMounted(() => {
  void resolveDoctorAuth()
})

watch(
  () => route.fullPath,
  () => {
    void resolveDoctorAuth()
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
