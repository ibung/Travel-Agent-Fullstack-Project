<script setup>
const handleLogout = async () => {
  const tokenCookie = useCookie('admin_token')
  const token = tokenCookie.value
  
  if (token) {
    try {
      await $fetch('http://localhost:3333/api/v1/account/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (_err) {
      // Tetap hapus token meski request API gagal
    }
  }
  
  tokenCookie.value = null
  await navigateTo('/admin/login')
}
</script>

<template>
  <aside class="w-64 bg-gray-900 text-gray-300 min-h-screen p-5 flex flex-col justify-between border-r border-gray-800">
    <div>
      <div class="mb-8 px-2">
        <h1 class="text-md font-bold text-white tracking-wider uppercase">CMS Control Panel</h1>
        <p class="text-xs text-gray-500">KONG Travel Agent</p>
      </div>

      <nav class="space-y-1">
        <NuxtLink to="/admin/packages" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white" active-class="bg-blue-600 text-white hover:bg-blue-600">
          <UIcon name="i-heroicons-briefcase" class="w-5 h-5" />
          Kelola Paket
        </NuxtLink>

        <NuxtLink to="/admin/banners" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white" active-class="bg-blue-600 text-white hover:bg-blue-600">
          <UIcon name="i-heroicons-photo" class="w-5 h-5" />
          Kelola Banner
        </NuxtLink>

        <NuxtLink to="/admin/reviews" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white" active-class="bg-blue-600 text-white hover:bg-blue-600">
          <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5" />
          Kelola Review
        </NuxtLink>
      </nav>
    </div>

    <div class="pt-4 border-t border-gray-800 space-y-1">
      <NuxtLink to="/" class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-colors">
        <UIcon name="i-heroicons-arrow-left-on-rectangle" class="w-4 h-4" />
        Lihat Website Utama
      </NuxtLink>

      <button
        id="btn-admin-logout"
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-white hover:bg-red-600 transition-all duration-200"
      >
        <UIcon name="i-heroicons-power" class="w-4 h-4" />
        Logout
      </button>
    </div>
  </aside>
</template>