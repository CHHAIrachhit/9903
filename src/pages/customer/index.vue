<script setup lang="ts">
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()
</script>

<template>
  <h1 class="text-2xl "> {{ $t('hello') }} </h1>
  <div class="flex flex-col gap-4">
    <router-link to="/customers/create">Create Customer</router-link>
    <p>Welcome {{ auth }}</p>

    
  </div>
</template>
