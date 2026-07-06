<script setup>
definePageMeta({ layout: false })

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

const tokenCookie = useCookie('admin_token', {
  maxAge: 60 * 60 * 24, // 1 hari
  path: '/',
  sameSite: 'lax'
})

const handleRegister = async () => {
  if (password.value !== passwordConfirmation.value) {
    errorMsg.value = 'Konfirmasi password tidak cocok.'
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  try {
    const fullName = `${firstName.value} ${lastName.value}`.trim()
    const res = await $fetch('http://localhost:3333/api/v1/auth/signup', {
      method: 'POST',
      body: { 
        fullName, 
        email: email.value, 
        password: password.value,
        passwordConfirmation: passwordConfirmation.value
      },
    })

    if (res?.data?.token) {
      tokenCookie.value = res.data.token
    } else if (res?.token) {
      tokenCookie.value = res.token
    }

    // Arahkan berdasarkan email
    if (email.value === 'admin@travel.com') {
      await navigateTo('/admin/packages')
    } else {
      await navigateTo('/')
    }
  } catch (err) {
    const status = err?.response?.status
    if (status === 400 || status === 422) {
      errorMsg.value = 'Data tidak valid. Email mungkin sudah terdaftar atau input salah.'
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
          <img src="/logo-kong.png" alt="KONG Travel Logo" class="w-10 h-10 object-contain" />
          <h1 class="text-2xl text-[#13238b] tracking-tight leading-none font-sans">
            <span class="font-black">KONG</span>
            <span class="font-normal"> Travel</span>
          </h1>
        </div>
        <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider">Daftar Akun Baru</p>
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="space-y-4" autocomplete="off">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1" for="firstName">Nama Depan</label>
            <input
              id="firstName"
              v-model="firstName"
              type="text"
              class="w-full text-sm border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-gray-200"
              placeholder="Nama Depan"
              autocomplete="off"
              required
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1" for="lastName">Nama Belakang</label>
            <input
              id="lastName"
              v-model="lastName"
              type="text"
              class="w-full text-sm border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-gray-200"
              placeholder="Nama Belakang"
              autocomplete="off"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1" for="email">Alamat Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            name="register_email_new"
            class="w-full text-sm border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-gray-200"
            placeholder="Masukkan Email Anda"
            autocomplete="nope"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1" for="password">Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full text-sm border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-gray-200"
              placeholder="••••••••"
              autocomplete="new-password"
              required
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-600"
            >
              <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1" for="passwordConfirmation">Konfirmasi Password</label>
          <div class="relative">
            <input
              id="passwordConfirmation"
              v-model="passwordConfirmation"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              class="w-full text-sm border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-gray-200"
              placeholder="••••••••"
              autocomplete="new-password"
              required
            />
            <button 
              type="button" 
              @click="showPasswordConfirmation = !showPasswordConfirmation"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-600"
            >
              <UIcon :name="showPasswordConfirmation ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Error Msg -->
        <p v-if="errorMsg" class="text-xs text-red-600 font-medium text-center bg-red-50 py-2 rounded-lg">
          {{ errorMsg }}
        </p>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl shadow-sm transition-colors disabled:bg-gray-400 mt-2 flex items-center justify-center gap-2"
        >
          <UIcon v-if="isLoading" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
          {{ isLoading ? 'Memproses Pendaftaran...' : 'Daftar Sekarang' }}
        </button>
      </form>

      <!-- Login Link -->
      <div class="mt-4 text-center">
        <p class="text-xs text-gray-500">
          Sudah punya akun? 
          <NuxtLink to="/login" class="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            Masuk di sini
          </NuxtLink>
        </p>
      </div>

      <!-- Back Link -->
      <div class="mt-6 text-center border-t border-gray-100 pt-6">
        <NuxtLink to="/" class="text-xs text-gray-500 hover:text-blue-600 transition-colors font-semibold flex items-center justify-center gap-1.5">
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Kembali ke Website Utama
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
