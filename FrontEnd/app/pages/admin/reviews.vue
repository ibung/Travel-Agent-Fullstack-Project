<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const tokenCookie = useCookie('admin_token')

const { data: apiResponse, refresh } = await useFetch('http://localhost:3333/api/travel-data')
const reviews = computed(() => apiResponse.value?.data?.reviews || [])

const isSidebarOpen = useState('isSidebarOpen', () => true)

const toastInfo = ref({ show: false, message: '', type: 'success' })

const showToast = (message, type = 'success') => {
  toastInfo.value = { show: true, message, type }
  setTimeout(() => {
    toastInfo.value.show = false
  }, 3000)
}

const showDeleteConfirm = ref(false)
const deleteTargetId = ref(null)

const confirmDeleteReview = (id) => {
  deleteTargetId.value = id
  showDeleteConfirm.value = true
}

const executeDelete = async () => {
  if (!deleteTargetId.value) return
  try {
    await $fetch(`http://localhost:3333/api/reviews/${deleteTargetId.value}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`
      }
    })
    showToast('Data ulasan berhasil dihapus.', 'success')
    refresh()
  } catch (err) {
    if (err?.response?.status === 401) {
      showToast('Sesi habis. Silakan login ulang.', 'error')
      await navigateTo('/login')
    } else {
      showToast('Gagal menghapus ulasan.', 'error')
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
          <UIcon name="i-heroicons-chat-bubble-left-right" class="text-blue-600 w-6 h-6" />
          Moderasi Review Customer
        </h2>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 class="text-sm font-bold text-gray-800 mb-4">Daftar Ulasan Masuk</h3>
        
        <div v-if="reviews.length === 0" class="text-center py-8 text-xs text-gray-400">
          Belum ada ulasan konsumen terdaftar di database.
        </div>

        <div v-else class="space-y-4">
          <div v-for="review in reviews" :key="review.id" class="p-4 border border-gray-100 bg-gray-50 rounded-xl flex justify-between items-start transition-hover hover:border-gray-200">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-bold text-sm text-gray-900">{{ review.customerName }}</h4>
                <div class="flex gap-0.5">
                  <UIcon v-for="n in (review.rating || 5)" :key="n" name="i-heroicons-star-solid" class="w-3.5 h-3.5 text-yellow-500" />
                </div>
              </div>
              <p class="text-xs text-gray-600 italic">"{{ review.reviewText }}"</p>
              
              <div v-if="review.package" class="mt-3 inline-flex items-center gap-1.5 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100">
                <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 text-blue-500" />
                <span class="text-[11px] font-bold text-blue-700">Mengulas: {{ review.package.name }}</span>
              </div>
            </div>
            
            <button @click="confirmDeleteReview(review.id)" class="text-red-600 hover:text-red-700 p-2 rounded-lg bg-white hover:bg-red-50 border border-gray-200 transition-colors flex items-center shadow-sm" title="Hapus Ulasan">
              <UIcon name="i-heroicons-trash" class="w-4 h-4" />
            </button>
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
