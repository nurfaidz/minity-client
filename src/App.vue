<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Check if current route is public (landing, login, register)
const isPublicRoute = computed(() => {
  const publicRoutes = ['home', 'login', 'register']
  return publicRoutes.includes(route.name as string)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <router-view />
  </div>
</template>