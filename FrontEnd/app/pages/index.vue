<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

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

const currentBannerIndex = ref(0)
let bannerInterval = null

const nextBanner = () => {
  if (banners.value.length > 0) {
    currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.value.length
  }
}

const prevBanner = () => {
  if (banners.value.length > 0) {
    currentBannerIndex.value = (currentBannerIndex.value - 1 + banners.value.length) % banners.value.length
  }
}

const setBanner = (index) => {
  currentBannerIndex.value = index
}

const resetBannerInterval = () => {
  if (bannerInterval) clearInterval(bannerInterval)
  bannerInterval = setInterval(nextBanner, 3000)
}

const manualNextBanner = () => {
  nextBanner()
  resetBannerInterval()
}

const manualPrevBanner = () => {
  prevBanner()
  resetBannerInterval()
}

const manualSetBanner = (index) => {
  setBanner(index)
  resetBannerInterval()
}

onMounted(() => {
  resetBannerInterval()
})

onUnmounted(() => {
  if (bannerInterval) clearInterval(bannerInterval)
})
</script>

<template>
  <div class="bg-gray-50 min-h-screen font-sans text-gray-900">
    
    <header class="bg-white shadow-sm p-4 sticky top-0 z-50">
      <div class="container mx-auto flex justify-between items-center px-4">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-paper-airplane" class="w-6 h-6 text-blue-600 rotate-45" />
          <h1 class="text-xl font-bold text-blue-600 font-sans">KONG Travel</h1>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink to="#packages" class="text-xs text-gray-600 hover:text-blue-600 font-semibold transition-colors">Paket Wisata</NuxtLink>
          <NuxtLink to="#reviews" class="text-xs text-gray-600 hover:text-blue-600 font-semibold transition-colors">Ulasan</NuxtLink>
        </div>
      </div>
    </header>

    <!-- Full Width Carousel Banner -->
    <div v-if="!pending && !error && banners.length" class="relative w-full h-[450px] overflow-hidden group">
      <div 
        class="flex transition-transform duration-700 ease-in-out h-full"
        :style="{ transform: `translateX(-${currentBannerIndex * 100}%)` }"
      >
        <div 
          v-for="banner in banners" 
          :key="banner.id" 
          class="w-full flex-shrink-0 h-full relative"
        >
          <img :src="`/${banner.image}`" class="absolute inset-0 w-full h-full object-cover" alt="Banner Promo">
          <div class="absolute inset-0 bg-black/40"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <h2 class="text-4xl md:text-5xl font-bold text-white text-center drop-shadow-lg px-4">{{ banner.title }}</h2>
          </div>
        </div>
      </div>
      
      <!-- Controls -->
      <button 
        @click="manualPrevBanner" 
        class="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-blue-600 hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
      >
        <UIcon name="i-heroicons-chevron-left" class="w-10 h-10 drop-shadow-md" />
      </button>
      <button 
        @click="manualNextBanner" 
        class="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-blue-600 hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
      >
        <UIcon name="i-heroicons-chevron-right" class="w-10 h-10 drop-shadow-md" />
      </button>

      <!-- Indicators -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        <button 
          v-for="(_, index) in banners" 
          :key="'ind-'+index"
          @click="manualSetBanner(index)"
          class="w-2 h-2 rounded-full transition-colors shadow-sm"
          :class="currentBannerIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'"
        ></button>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-6xl">
      
      <div v-if="pending" class="text-center py-20">
        <p class="text-gray-500 font-medium">Memuat data destinasi indah...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 p-6 rounded-xl text-center max-w-lg mx-auto flex items-center justify-center gap-2 text-red-700">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
        <p class="font-bold">Gagal Sinkronisasi Data</p>
      </div>

      <div v-else class="space-y-16">
        
        <section id="packages">
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

        <section id="reviews">
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

    <!-- Footer Seksi Kontak Baru -->
    <footer class="bg-white border-t border-gray-200 mt-20 py-12 text-xs text-gray-500">
      <div class="container mx-auto px-4 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5 text-blue-600 rotate-45" />
            <h4 class="font-bold text-gray-800 text-sm">KONG Travel Agent</h4>
          </div>
          <p class="leading-relaxed">Solusi lengkap perjalanan wisata nusantara tepercaya. Temukan penawaran terbaik dan destinasi impian Anda bersama kami.</p>
        </div>
        <div>
          <h4 class="font-bold text-gray-800 text-sm mb-4">Menu Pintar</h4>
          <ul class="space-y-2.5">
            <li><NuxtLink to="#packages" class="hover:text-blue-600 transition-colors">Daftar Paket Destinasi</NuxtLink></li>
            <li><NuxtLink to="#reviews" class="hover:text-blue-600 transition-colors">Ulasan Pelanggan</NuxtLink></li>
            <li><NuxtLink to="/admin" class="hover:text-blue-600 transition-colors">Dashboard Admin</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-gray-800 text-sm mb-4">Hubungi Kami</h4>
          <ul class="space-y-2.5">
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-phone" class="text-blue-600 w-4 h-4" />
              <span>+62 812-3456-7890</span>
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-envelope" class="text-blue-600 w-4 h-4" />
              <span>info@kongtravel.com</span>
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-map-pin" class="text-blue-600 w-4 h-4" />
              <span>Ubud, Gianyar, Bali, Indonesia</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="container mx-auto px-4 max-w-6xl mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; 2026 KONG Travel Agent. All rights reserved.</p>
      </div>
    </footer>

  </div>
</template>