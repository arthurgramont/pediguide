<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import type { Component } from 'vue'

const route = useRoute()

const layouts: Record<string, Component> = {
  main: MainLayout,
  auth: AuthLayout,
}
const layout = computed(() => layouts[route.meta.layout as string] ?? layouts.main)
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
