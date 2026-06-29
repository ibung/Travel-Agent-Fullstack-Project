<script setup>
import { computed } from 'vue'

// Fetching data dari backend AdonisJS (Port 3333)
const { data: apiResponse, pending, error } = await useFetch('http://localhost:3333/api/travel-data')

// Memecah payload JSON
const banners = computed(() => apiResponse.value?.data?.banners || [])
const packages = computed(() => apiResponse.value?.data?.packages || [])
const reviews = computed(() => apiResponse.value?.data?.reviews || [])
</script>

<template>
  <div class="bg-gray-50 min-h-screen font-sans text-gray-900">
    
    <header class="bg-white shadow-sm p-4 sticky top-0 z-50">
      <div class="container mx-auto flex justify-between items-center px-4">
        <h1 class="text-xl font-bold text-blue-600">🚀 KONG Travel Agent</h1>
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span class="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-md font-medium">API Connected</span>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-8 max-w-6xl">
      
      <div v-if="pending" class="text-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p class="text-gray-500 font-medium">Memuat data destinasi indah...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center max-w-lg mx-auto shadow-sm">
        <p class="font-bold mb-1">Gagal Sinkronisasi Data ❌</p>
        <p class="text-sm text-red-600 mb-3">Pastikan server Backend AdonisJS di port 3333 sudah kamu jalankan.</p>
      </div>

      <div v-else class="space-y-16">
        
        <section>
          <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            ✨ Promo Spesial Menantimu
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="banner in banners" :key="banner.id" class="relative overflow-hidden rounded-2xl shadow-md bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-8 h-44 flex flex-col justify-end group">
              <img :src="`/${banner.image}`" class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500" alt="Banner Promo">
              <div class="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"></div>
              <h3 class="text-lg font-bold relative z-10 leading-tight drop-shadow-md">{{ banner.title }}</h3>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🏝️ Paket Wisata Terpopuler
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="pkg in packages" :key="pkg.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
              <div class="relative overflow-hidden h-48 bg-gray-200">
                <img :src="`/${pkg.image}`" class="w-full h-full object-cover" alt="Destinasi">
              </div>
              <div class="p-5 flex flex-col flex-grow">
                <h3 class="font-bold text-base text-gray-900 mb-2 line-clamp-1">{{ pkg.name }}</h3>
                <p class="text-gray-500 text-xs leading-relaxed mb-5 line-clamp-2">{{ pkg.description }}</p>
                <div class="flex justify-between items-center mt-auto pt-3 border-t border-gray-50">
                  <div>
                    <p class="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Mulai dari</p>
                    <p class="text-blue-600 font-extrabold text-sm">Rp {{ Number(pkg.price).toLocaleString('id-ID') }}</p>
                  </div>
                  <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors">
                    Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            💬 Ulasan Juara dari Traveler
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="review in reviews" :key="review.id" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <p class="text-gray-600 text-xs italic leading-relaxed mb-4">"{{ review.reviewText }}"</p>
              <div class="flex items-center justify-between pt-2 border-t border-gray-50">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-100 text-blue-600 font-bold text-xs rounded-full flex items-center justify-center mr-2.5">
                    {{ review.customerName.charAt(0) }}
                  </div>
                  <h4 class="text-xs font-bold text-gray-800">{{ review.customerName }}</h4>
                </div>
                <div class="flex gap-0.5 text-[10px]">
                  {{ '⭐'.repeat(review.rating || 5) }}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>