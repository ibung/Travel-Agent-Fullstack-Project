<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const tokenCookie = useCookie('admin_token')

const { data: apiResponse, pending, error, refresh } = await useFetch('http://localhost:3333/api/travel-data')
const packages = computed(() => apiResponse.value?.data?.packages || [])

const isSidebarOpen = useState('isSidebarOpen', () => true)

const { data: imageList } = await useFetch('http://localhost:3333/api/images', {
  headers: {
    Authorization: `Bearer ${tokenCookie.value}`
  }
})
const availableImages = computed(() => imageList.value?.data || [])

const form = ref({ 
  name: '', price: '', description: '', image: availableImages.value[0] || '',
  transportType: 'bus', provider: '', origin: 'Bandung', destination: 'Jogja', rating: 4.5
})
const isSubmitting = ref(false)
const isEditing = ref(false)
const editId = ref(null)

const toastInfo = ref({ show: false, message: '', type: 'success' })

const showToast = (message, type = 'success') => {
  toastInfo.value = { show: true, message, type }
  setTimeout(() => {
    toastInfo.value.show = false
  }, 3000)
}

const startEdit = (pkg) => {
  isEditing.value = true
  editId.value = pkg.id
  form.value = {
    name: pkg.name,
    price: pkg.price,
    description: pkg.description,
    image: pkg.image,
    transportType: pkg.transportType || pkg.transport_type,
    provider: pkg.provider,
    origin: pkg.origin,
    destination: pkg.destination,
    rating: pkg.rating
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editId.value = null
  form.value = { 
    name: '', price: '', description: '', image: availableImages.value[0] || '',
    transportType: 'bus', provider: '', origin: 'Bandung', destination: 'Jogja', rating: 4.5
  }
}

const handleSavePackage = async () => {
  isSubmitting.value = true
  
  const url = isEditing.value 
    ? `http://localhost:3333/api/packages/${editId.value}` 
    : 'http://localhost:3333/api/packages'
    
  const method = isEditing.value ? 'PUT' : 'POST'

  try {
    await $fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`
      },
      body: {
        name: form.value.name,
        price: Number(form.value.price),
        description: form.value.description,
        image: form.value.image,
        transport_type: form.value.transportType,
        provider: form.value.provider,
        origin: form.value.origin,
        destination: form.value.destination,
        rating: Number(form.value.rating)
      }
    })
    showToast(isEditing.value ? 'Data paket berhasil diperbarui.' : 'Data paket berhasil disimpan.', 'success')
    cancelEdit()
    refresh()
  } catch (err) {
    if (err?.response?.status === 401) {
      showToast('Sesi habis. Silakan login ulang.', 'error')
      await navigateTo('/login')
    } else {
      showToast('Gagal memproses data paket.', 'error')
    }
  } finally {
    isSubmitting.value = false
  }
}

const showDeleteConfirm = ref(false)
const deleteTargetId = ref(null)

const confirmDeletePackage = (id) => {
  deleteTargetId.value = id
  showDeleteConfirm.value = true
}

const executeDelete = async () => {
  if (!deleteTargetId.value) return
  try {
    await $fetch(`http://localhost:3333/api/packages/${deleteTargetId.value}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`
      }
    })
    showToast('Data berhasil dihapus.', 'success')
    refresh()
  } catch (err) {
    if (err?.response?.status === 401) {
      showToast('Sesi habis. Silakan login ulang.', 'error')
      await navigateTo('/login')
    } else {
      showToast('Gagal menghapus data.', 'error')
    }
  } finally {
    showDeleteConfirm.value = false
    deleteTargetId.value = null
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
          <UIcon name="i-heroicons-briefcase" class="text-blue-600 w-6 h-6" />
          Manajemen Paket Traveling
        </h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
          <h3 class="text-sm font-bold text-gray-800 mb-4">
            {{ isEditing ? 'Edit Data Paket' : 'Input Data Paket' }}
          </h3>
          <form @submit.prevent="handleSavePackage" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">Nama Armada / Destinasi</label>
                <input v-model="form.name" type="text" class="w-full text-sm text-gray-900 border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">Harga (IDR)</label>
                <input v-model="form.price" type="number" class="w-full text-sm text-gray-900 border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">Jenis Transportasi</label>
                <select v-model="form.transportType" class="w-full text-sm text-gray-900 border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="bus">Bus</option>
                  <option value="travel">Travel</option>
                  <option value="pesawat">Pesawat</option>
                  <option value="kereta">Kereta</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">Nama Provider (Misal: DAMRI)</label>
                <input v-model="form.provider" type="text" class="w-full text-sm text-gray-900 border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">Asal</label>
                <input v-model="form.origin" type="text" class="w-full text-sm text-gray-900 border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">Tujuan</label>
                <input v-model="form.destination" type="text" class="w-full text-sm text-gray-900 border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">Rating</label>
                <input v-model="form.rating" type="number" step="0.1" min="0" max="5" class="w-full text-sm text-gray-900 border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1">Gambar Banner</label>
              <select v-model="form.image" class="w-full text-sm text-gray-900 border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                <option v-for="img in availableImages" :key="img" :value="img">{{ img }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1">Fasilitas & Deskripsi</label>
              <textarea v-model="form.description" rows="3" class="w-full text-sm text-gray-900 border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required></textarea>
            </div>
            
            <div class="flex gap-2">
              <button v-if="isEditing" @click="cancelEdit" type="button" class="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-xs py-3 rounded-xl transition-colors">
                Batal
              </button>
              <button type="submit" :disabled="isSubmitting" class="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 rounded-xl shadow-sm transition-colors disabled:bg-gray-400">
                {{ isSubmitting ? 'Memproses...' : isEditing ? 'Perbarui Data' : 'Simpan Data' }}
              </button>
            </div>
          </form>
        </div>

        <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
          <h3 class="text-sm font-bold text-gray-800 mb-4">Daftar Paket Aktif</h3>
          <div class="overflow-x-auto w-full flex-1">
            <table class="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr class="bg-gray-50 text-gray-500 text-xs font-semibold border-b">
                  <th class="p-3 w-16">Foto</th>
                  <th class="p-3">Nama Wisata</th>
                  <th class="p-3">Rute & Transport</th>
                  <th class="p-3">Harga</th>
                  <th class="p-3 text-center w-32">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y text-sm">
                <tr v-for="pkg in packages" :key="pkg.id" class="hover:bg-gray-50">
                  <td class="p-3">
                    <img :src="`/${pkg.image}`" class="w-12 h-12 object-cover rounded-lg shadow-sm border border-gray-100" alt="Thumbnail" />
                  </td>
                  <td class="p-3 font-medium text-gray-900">
                    {{ pkg.name }}
                    <div class="text-xs text-gray-500 font-normal line-clamp-2 max-w-[250px] mt-1">{{ pkg.description }}</div>
                  </td>
                  <td class="p-3 text-xs">
                    <div class="flex items-center gap-1 mb-1.5">
                      <span class="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">{{ pkg.origin }}</span>
                      <UIcon name="i-heroicons-arrow-right-16-solid" class="w-3 h-3 text-gray-400" />
                      <span class="bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-bold">{{ pkg.destination }}</span>
                    </div>
                    <span class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase font-bold">{{ pkg.transportType || pkg.transport_type }} - {{ pkg.provider }}</span>
                  </td>
                  <td class="p-3 text-blue-600 font-bold whitespace-nowrap">Rp {{ Number(pkg.price).toLocaleString('id-ID') }}</td>
                  <td class="p-3">
                    <div class="flex justify-center gap-2">
                      <button @click="startEdit(pkg)" class="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors">
                        <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
                        Edit
                      </button>
                      <button @click="confirmDeletePackage(pkg.id)" class="text-red-600 hover:text-red-700 font-medium text-xs flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors">
                        <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" @click.self="showDeleteConfirm = false" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm mx-auto transform transition-all text-center animate-bounce-in">
        <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-600" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">Konfirmasi Hapus</h3>
        <p class="text-sm text-gray-600 mb-6">Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.</p>
        <div class="flex gap-3">
          <button @click="showDeleteConfirm = false" class="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            Batal
          </button>
          <button @click="executeDelete" class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
    
    <!-- Toast Notification -->
    <div v-if="toastInfo.show" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all animate-bounce-in" :class="toastInfo.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'">
      <UIcon :name="toastInfo.type === 'success' ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-circle'" class="w-6 h-6" :class="toastInfo.type === 'success' ? 'text-green-600' : 'text-red-600'" />
      <span class="text-sm font-bold">{{ toastInfo.message }}</span>
    </div>
  </div>
</template>
