<script setup>
import { ref, computed } from 'vue'

// Ambil data secara langsung dari port Backend AdonisJS
const { data: apiResponse, pending, error, refresh } = await useFetch('http://localhost:3333/api/travel-data')

// Memecah payload JSON untuk masing-masing bagian
const banners = computed(() => apiResponse.value?.data?.banners || [])
const packages = computed(() => apiResponse.value?.data?.packages || [])
const reviews = computed(() => apiResponse.value?.data?.reviews || [])

// Form state untuk review baru
const newCustomerName = ref('')
const newReviewText = ref('')
const newRating = ref(5)
const isSubmitting = ref(false)
const statusMessage = ref('')
const isError = ref(false)

const handleSendReview = async () => {
  isSubmitting.value = true
  statusMessage.value = ''
  isError.value = false

  try {
    await $fetch('http://localhost:3333/api/reviews', {
      method: 'POST',
      body: {
        customerName: newCustomerName.value,
        reviewText: newReviewText.value,
        rating: Number(newRating.value)
      }
    })
    
    statusMessage.value = 'Ulasan Anda berhasil dikirim! Terima kasih atas feedback-nya.'
    newCustomerName.value = ''
    newReviewText.value = ''
    newRating.value = 5
    
    // Refresh data agar ulasan baru langsung muncul
    refresh()
  } catch (err) {
    isError.value = true
    statusMessage.value = 'Gagal mengirim ulasan. Silakan coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen font-sans text-gray-900">
    
    <header class="bg-white shadow-sm p-4 sticky top-0 z-50">
      <div class="container mx-auto flex justify-between items-center px-4">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-paper-airplane" class="w-6 h-6 text-blue-600 rotate-45" />
          <h1 class="text-xl font-bold text-blue-600">KONG Travel Agent</h1>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span class="text-[11px] text-gray-500 font-medium">Customer Mode</span>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-8 max-w-6xl">
      
      <div v-if="pending" class="text-center py-20">
        <p class="text-gray-500 font-medium">Memuat data destinasi indah...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 p-6 rounded-xl text-center max-w-lg mx-auto flex items-center justify-center gap-2 text-red-700">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
        <p class="font-bold">Gagal Sinkronisasi Data</p>
      </div>

      <div v-else class="space-y-16">
        
        <section>
          <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <UIcon name="i-heroicons-ticket" class="text-blue-600 w-5 h-5" />
            Promo Spesial Menantimu
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="banner in banners" :key="banner.id" class="relative overflow-hidden rounded-2xl shadow-md bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-8 h-44 flex flex-col justify-end group">
              <img :src="`/${banner.image}`" class="absolute inset-0 w-full h-full object-cover opacity-40" alt="Banner Promo">
              <div class="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"></div>
              <h3 class="text-lg font-bold relative z-10 leading-tight drop-shadow-md">{{ banner.title }}</h3>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <UIcon name="i-heroicons-globe-asia-australia" class="text-blue-600 w-5 h-5" />
            Paket Wisata Terpopuler
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="pkg in packages" :key="pkg.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <img :src="`/${pkg.image}`" class="w-full h-48 object-cover" alt="Destinasi">
              <div class="p-5 flex flex-col flex-grow">
                <h3 class="font-bold text-base text-gray-900 mb-2 line-clamp-1">{{ pkg.name }}</h3>
                <p class="text-gray-500 text-xs leading-relaxed mb-5 line-clamp-2">{{ pkg.description }}</p>
                <div class="flex justify-between items-center mt-auto pt-3 border-t">
                  <div>
                    <p class="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Mulai dari</p>
                    <p class="text-blue-600 font-extrabold text-sm">Rp {{ Number(pkg.price).toLocaleString('id-ID') }}</p>
                  </div>
                  <button class="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold">Booking</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <UIcon name="i-heroicons-chat-bubble-left-right" class="text-blue-600 w-5 h-5" />
            Ulasan Juara dari Traveler
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div v-for="review in reviews" :key="review.id" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <p class="text-gray-600 text-xs italic leading-relaxed mb-4">"{{ review.reviewText }}"</p>
              <div class="flex items-center justify-between pt-2 border-t border-gray-50">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-100 text-blue-600 font-bold text-xs rounded-full flex items-center justify-center mr-2.5">
                    {{ review.customerName ? review.customerName.charAt(0) : 'G' }}
                  </div>
                  <h4 class="text-xs font-bold text-gray-800">{{ review.customerName }}</h4>
                </div>
                <div class="flex gap-0.5">
                  <UIcon v-for="n in (review.rating || 5)" :key="n" name="i-heroicons-star-solid" class="w-3.5 h-3.5 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>

          <!-- Form Kirim Ulasan / Komentar -->
          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-1.5">
              <UIcon name="i-heroicons-pencil-square" class="text-blue-600 w-4 h-4" />
              Tinggalkan Ulasan Anda
            </h3>
            
            <form @submit.prevent="handleSendReview" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-1">Nama Lengkap</label>
                  <input
                    v-model="newCustomerName"
                    type="text"
                    placeholder="Nama Anda"
                    class="w-full text-xs border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-1">Rating Destinasi</label>
                  <div class="flex items-center gap-1 h-9">
                    <button
                      v-for="star in 5"
                      :key="star"
                      type="button"
                      @click="newRating = star"
                      class="focus:outline-none transition-transform active:scale-95"
                    >
                      <UIcon
                        name="i-heroicons-star-solid"
                        class="w-5 h-5 transition-colors"
                        :class="star <= newRating ? 'text-yellow-400' : 'text-gray-200'"
                      />
                    </button>
                    <span class="text-xs text-gray-400 ml-2 font-medium">({{ newRating }} / 5 Bintang)</span>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">Pengalaman Liburan Anda</label>
                <textarea
                  v-model="newReviewText"
                  rows="3"
                  placeholder="Ceritakan pengalaman menyenangkan perjalanan Anda bersama kami..."
                  class="w-full text-xs border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-gray-200"
                  required
                ></textarea>
              </div>

              <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl shadow-sm transition-colors disabled:bg-gray-400"
                >
                  {{ isSubmitting ? 'Mengirim...' : 'Kirim Ulasan' }}
                </button>
                
                <p
                  v-if="statusMessage"
                  class="text-xs font-medium text-center"
                  :class="isError ? 'text-red-600' : 'text-green-600'"
                >
                  {{ statusMessage }}
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>