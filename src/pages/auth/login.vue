
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

const submitLogin = async () => {
  try {
    const result = await auth.signIn({ email: email.value, password: password.value })
    if (result?.code === 1) {
      router.push('/customers')
    }
  } catch (error) {
    console.error(error)
  }
}


</script>

<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-2">
    <!-- Left Side Banner -->
    <div class="hidden md:flex flex-col justify-center items-center bg-blue-600 text-white p-10">
      <h1 class="text-4xl font-bold mb-4">Welcome Back</h1>
      <p class="text-lg opacity-90">Login to continue accessing your dashboard.</p>

      <div>
        <p>User: {{ auth.user }}</p>
      </div>
    </div>

    <!-- Right Side Login Form -->
    <div class="flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
      <div class="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
        <h2 class="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-gray-100">Login</h2>

        <form @submit.prevent="submitLogin" class="space-y-5">
          <div>
            <label class="block mb-1 text-gray-700 dark:text-gray-300">Email</label>
            <input
              v-model="email"
              class="w-full p-3 rounded-xl border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label class="block mb-1 text-gray-700 dark:text-gray-300">Password</label>
            <input
              v-model="password"
              type="password"
              class="w-full p-3 rounded-xl border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</template>


<style scoped>
</style>