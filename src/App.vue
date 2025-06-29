<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()

// Check if current route is public (landing, login, register)
const isPublicRoute = computed(() => {
  const publicRoutes = ['home', 'login', 'register']
  return publicRoutes.includes(route.name as string)
})

</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Public Layout (Landing, Login, Register) -->
    <div v-if="isPublicRoute" class="min-h-screen">
      <router-view />
    </div>
  </div>
</template>