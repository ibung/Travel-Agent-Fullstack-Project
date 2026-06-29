<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const tokenCookie = useCookie('admin_token')

const { data: apiResponse, refresh } = await useFetch('http://localhost:3333/api/travel-data')
const banners = computed(() => apiResponse.value?.data?.banners || [])

const form = ref({ title: '', image: 'banner-promo.jpg' })
const isSubmitting = ref(false)
const isEditing = ref(false)
const editId = ref(null)
const statusMessage = ref('')

const startEdit = (banner) => {
  isEditing.value = true
  editId.value = banner.id
  form.value = { title: banner.title, image: banner.image }
}

const cancelEdit = () => {
  isEditing.value = false
  editId.value = null
  form.value = { title: '', image: 'banner-promo.jpg' }
}

const handleSaveBanner = async () => {
  isSubmitting.value = true
  statusMessage.value = ''

  const url = isEditing.value 
    ? `http://localhost:3333/api/banners/${editId.value}` 
    : 'http://localhost:3333/api/banners'
    
  const method = isEditing.value ? 'PUT' : 'POST'

  try {
    await $fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`
      },
      body: form.value
    })
    statusMessage.value = isEditing.value ? 'Banner promosi berhasil diperbarui.' : 'Banner promosi berhasil ditambahkan.'
    cancelEdit()
    refresh()
  } catch (err) {
    if (err?.response?.status === 401) {
      statusMessage.value = 'Sesi habis. Silakan login ulang.'
      await navigateTo('/admin/login')
    } else {
      statusMessage.value = 'Gagal memproses data banner.'
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleDeleteBanner = async (id) => {
  if (confirm('Hapus banner promo ini?')) {
    try {
      await $fetch(`http://localhost:3333/api/banners/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokenCookie.value}`
        }
      })
      refresh()
    } catch (err) {
      if (err?.response?.status === 401) {
        await navigateTo('/admin/login')
      } else {
        alert('Gagal menghapus data.')
      }
    }
  }
}
</script>


<template>
  <div class="flex bg-gray-50 min-h-screen text-gray-900 font-sans">
    <AdminSidebar />
    
    <main class="flex-grow p-8 max-w-5xl">
      <div class="mb-6 flex items-center gap-2 text-xl font-bold">
        <UIcon name="i-heroicons-photo" class="text-blue-600" />
        <h2>Manajemen Banner Promosi</h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
          <h3 class="text-sm font-bold text-gray-800 mb-4">
            {{ isEditing ? 'Edit Data Banner' : 'Input Data Banner' }}
          </h3>
          <form @submit.prevent="handleSaveBanner" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1">Judul / Headline Promo</label>
              <input v-model="form.title" type="text" class="w-full text-sm border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1">Media Gambar</label>
              <select v-model="form.image" class="w-full text-sm border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="banner-promo.jpg">banner-promo.jpg</option>
                <option value="banner-hero.jpg">banner-hero.jpg</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button v-if="isEditing" @click="cancelEdit" type="button" class="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-xs py-3 rounded-xl transition-colors">
                Batal
              </button>
              <button type="submit" :disabled="isSubmitting" class="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 rounded-xl shadow-sm transition-colors disabled:bg-gray-400">
                {{ isSubmitting ? 'Memproses...' : isEditing ? 'Perbarui Banner' : 'Daftarkan Banner' }}
              </button>
            </div>
            <p v-if="statusMessage" class="text-center text-xs font-medium text-blue-600 mt-2">{{ statusMessage }}</p>
          </form>
        </div>

        <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 class="text-sm font-bold text-gray-800 mb-4">Daftar Banner Aktif</h3>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 text-gray-500 text-xs font-semibold border-b">
                <th class="p-3">Judul Promo</th>
                <th class="p-3 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody class="divide-y text-sm">
              <tr v-for="banner in banners" :key="banner.id" class="hover:bg-gray-50">
                <td class="p-3 font-medium text-gray-900">{{ banner.title }}</td>
                <td class="p-3 flex justify-center gap-2">
                  <button @click="startEdit(banner)" class="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors">
                    <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
                    Edit
                  </button>
                  <button @click="handleDeleteBanner(banner.id)" class="text-red-600 hover:text-red-700 font-medium text-xs flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors">
                    <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>