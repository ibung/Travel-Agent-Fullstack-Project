<script setup>
definePageMeta({ layout: false })

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

const tokenCookie = useCookie('admin_token', {
  maxAge: 60 * 60 * 24, // 1 hari
  path: '/',
  sameSite: 'lax'
})

const handleLogin = async () => {
  isLoading.value = true
  errorMsg.value = ''

  try {
    const res = await $fetch('http://localhost:3333/api/v1/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })

    if (res?.data?.token) {
      tokenCookie.value = res.data.token
    }

    await navigateTo('/admin/packages')
  } catch (err) {
    const status = err?.response?.status
    if (status === 400 || status === 401 || status === 422) {
      errorMsg.value = 'Email atau password salah.'
    } else {
      errorMsg.value = 'Terjadi kesalahan sistem.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900 font-sans px-4">
    <div class="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
      
      <!-- Brand Logo -->
      <div class="flex flex-col items-center mb-8">
        <div class="flex items-center gap-2 mb-2">
          <UIcon name="i-heroicons-paper-airplane" class="w-8 h-8 text-blue-600 rotate-45" />
          <h1 class="text-2xl font-bold text-blue-600 font-sans">KONG Travel</h1>
        </div>
        <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider">Admin Control Panel</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1" for="email">Alamat Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="w-full text-sm border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-gray-200"
            placeholder="admin@travel.com"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="w-full text-sm border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-gray-200"
            placeholder="••••••••"
            required
          />
        </div>

        <!-- Error Msg -->
        <p v-if="errorMsg" class="text-xs text-red-600 font-medium text-center bg-red-50 py-2 rounded-lg">
          {{ errorMsg }}
        </p>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl shadow-sm transition-colors disabled:bg-gray-400"
        >
          {{ isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard' }}
        </button>
      </form>

      <!-- Back Link -->
      <div class="mt-6 text-center border-t border-gray-100 pt-4">
        <NuxtLink to="/" class="text-xs text-gray-400 hover:text-blue-600 transition-colors font-medium flex items-center justify-center gap-1">
          <UIcon name="i-heroicons-arrow-left" class="w-3.5 h-3.5" />
          Kembali ke Website Utama
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
