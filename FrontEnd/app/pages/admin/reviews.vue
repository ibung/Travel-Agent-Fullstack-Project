<script setup>
import { computed } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const tokenCookie = useCookie('admin_token')

const { data: apiResponse, refresh } = await useFetch('http://localhost:3333/api/travel-data')
const reviews = computed(() => apiResponse.value?.data?.reviews || [])

const isSidebarOpen = useState('isSidebarOpen', () => true)

const handleDeleteReview = async (id) => {
  if (confirm('Hapus review dari pelanggan ini?')) {
    try {
      await $fetch(`http://localhost:3333/api/reviews/${id}`, {
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
        alert('Gagal menghapus ulasan.')
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
            
            <button @click="handleDeleteReview(review.id)" class="text-red-600 hover:text-red-700 p-2 rounded-lg bg-white hover:bg-red-50 border border-gray-200 transition-colors flex items-center shadow-sm" title="Hapus Ulasan">
              <UIcon name="i-heroicons-trash" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
