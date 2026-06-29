<script setup>
import { computed } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const tokenCookie = useCookie('admin_token')

const { data: apiResponse, refresh } = await useFetch('http://localhost:3333/api/travel-data')
const reviews = computed(() => apiResponse.value?.data?.reviews || [])

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
        await navigateTo('/admin/login')
      } else {
        alert('Gagal menghapus ulasan.')
      }
    }
  }
}
</script>


<template>
  <div class="flex bg-gray-50 min-h-screen text-gray-900 font-sans">
    <AdminSidebar />
    
    <main class="flex-grow p-8 max-w-4xl">
      <div class="mb-6 flex items-center gap-2 text-xl font-bold">
        <UIcon name="i-heroicons-chat-bubble-left-right" class="text-blue-600" />
        <h2>Moderasi Review Customer</h2>
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