<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const tokenCookie = useCookie('admin_token')

const { data: apiResponse, refresh } = await useFetch('http://localhost:3333/api/travel-data')
const banners = computed(() => apiResponse.value?.data?.banners || [])

const isSidebarOpen = useState('isSidebarOpen', () => true)

const { data: imageList } = await useFetch('http://localhost:3333/api/images', {
  headers: {
    Authorization: `Bearer ${tokenCookie.value}`
  }
})
const availableImages = computed(() => imageList.value?.data || [])

const form = ref({ title: '', image: availableImages.value[0] || '' })
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
  form.value = { title: '', image: availableImages.value[0] || '' }
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
      await navigateTo('/login')
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
        await navigateTo('/login')
      } else {
        alert('Gagal menghapus data.')
      }
    }
  }
}
</script>


<template>
  <div class="flex h-screen bg-gray-50 font-sans overflow-hidden">
    <div :class="isSidebarOpen ? 'w-64' : 'w-0'" class="transition-[width] duration-300 ease-in-out overflow-hidden flex-shrink-0 h-full">
      <AdminSidebar />
    </div>
    
    <main class="flex-1 p-8 overflow-y-auto w-full transition-all duration-300">
      <div class="flex items-center gap-4 mb-8">
        <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          <UIcon name="i-heroicons-bars-3" class="w-5 h-5 text-gray-700" />
        </button>
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2 m-0">
          <UIcon name="i-heroicons-photo" class="text-blue-600 w-6 h-6" />
          Manajemen Banner Promosi
        </h2>
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
                <option v-for="img in availableImages" :key="img" :value="img">{{ img }}</option>
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
                <th class="p-3 w-24">Media</th>
                <th class="p-3">Judul Promo</th>
                <th class="p-3 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody class="divide-y text-sm">
              <tr v-for="banner in banners" :key="banner.id" class="hover:bg-gray-50">
                <td class="p-3">
                  <img :src="`/${banner.image}`" class="w-20 h-10 object-cover rounded-md shadow-sm border border-gray-100" alt="Banner" />
                </td>
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
