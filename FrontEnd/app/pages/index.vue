<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Ambil data secara langsung dari port Backend AdonisJS
const { data: apiResponse, pending, error, refresh } = await useFetch('http://localhost:3333/api/travel-data')

const token = useCookie('admin_token')
const { data: profileRes } = await useFetch('http://localhost:3333/api/v1/account/profile', {
  headers: computed(() => ({ Authorization: `Bearer ${token.value}` })),
  server: false,
})

const userInitials = computed(() => {
  if (profileRes.value?.data?.fullName) {
    const names = profileRes.value.data.fullName.split(' ')
    if (names.length > 1) return (names[0][0] + names[1][0]).toUpperCase()
    return names[0].substring(0, 2).toUpperCase()
  }
  return 'U'
})

const showLogoutPopup = ref(false)
const isMobileMenuOpen = ref(false)

const confirmLogout = () => {
  token.value = null
  profileRes.value = null
  showLogoutPopup.value = false
  window.location.reload()
}

// Memecah payload JSON untuk masing-masing bagian
const banners = computed(() => apiResponse.value?.data?.banners || [])
const packages = computed(() => apiResponse.value?.data?.packages || [])
const reviews = computed(() => apiResponse.value?.data?.reviews || [])

const selectedTransport = ref('semua')
const filteredPackages = computed(() => {
  if (selectedTransport.value === 'semua') {
    return packages.value
  }
  return packages.value.filter(pkg => pkg.transport_type === selectedTransport.value || pkg.transportType === selectedTransport.value)
})

// Form state untuk review baru
const newPackageId = ref('')
const newReviewText = ref('')
const newRating = ref(5)
const isSubmitting = ref(false)
const showSuccessPopup = ref(false)
const showLoginRequiredPopup = ref(false)
const isError = ref(false)

const handleSendReview = async () => {
  if (!token.value) {
    showLoginRequiredPopup.value = true
    return
  }
  
  isSubmitting.value = true
  isError.value = false

  try {
    await $fetch('http://localhost:3333/api/reviews', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: {
        packageId: newPackageId.value,
        reviewText: newReviewText.value,
        rating: Number(newRating.value)
      }
    })
    
    showSuccessPopup.value = true
    newPackageId.value = ''
    newReviewText.value = ''
    newRating.value = 5
    
    // Auto close popup
    setTimeout(() => { showSuccessPopup.value = false }, 3000)

    // Refresh data agar ulasan baru langsung muncul
    refresh()
  } catch (err) {
    isError.value = true
    alert('Gagal mengirim ulasan. Silakan coba lagi.')
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

const filterAndScrollTo = (type) => {
  selectedTransport.value = type
  document.getElementById('destinasi')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const selectedPackage = ref(null)
const showPackageModal = ref(false)

const openPackageModal = (pkg) => {
  selectedPackage.value = pkg
  showPackageModal.value = true
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen font-sans text-gray-900">
    
    <header class="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all border-b border-gray-100">
      <div class="container mx-auto flex justify-between items-center px-4 py-3 md:py-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="group-hover:scale-105 transition-transform flex items-center justify-center">
            <img src="/logo-kong.png" alt="KONG Travel Logo" class="w-12 h-12 object-contain" />
          </div>
          <div class="flex flex-col">
            <h1 class="text-3xl text-[#13238b] tracking-tight leading-none">
              <span class="font-black">KONG</span>
              <span class="font-normal"> Travel</span>
            </h1>
            <p class="text-[11px] text-gray-600 font-medium tracking-wide mt-1">Your Premium Journey, Reimagined.</p>
          </div>
        </NuxtLink>

        <div class="flex items-center gap-4 md:gap-12 lg:gap-16">
          <!-- Menu Tengah -->
          <nav class="hidden md:flex items-center gap-8">
            <NuxtLink to="#destinasi" class="text-sm text-gray-700 hover:text-blue-600 font-bold transition-all relative group py-2">
              Destinasi
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </NuxtLink>
            <NuxtLink to="#layanan" class="text-sm text-gray-700 hover:text-blue-600 font-bold transition-all relative group py-2">
              Layanan
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </NuxtLink>
            <NuxtLink to="#testimoni" class="text-sm text-gray-700 hover:text-blue-600 font-bold transition-all relative group py-2">
              Testimoni
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </NuxtLink>
            <NuxtLink to="#kontak" class="text-sm text-gray-700 hover:text-blue-600 font-bold transition-all relative group py-2">
              Kontak
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </NuxtLink>
          </nav>

          <!-- Login / Profile Action -->
          <div v-if="token" class="relative group">
            <button class="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm tracking-wide shadow-sm hover:bg-blue-700 transition-colors">
              {{ userInitials }}
            </button>
            <div class="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div class="px-4 py-3 border-b border-gray-100">
                <p class="text-sm font-semibold text-gray-800 truncate">{{ profileRes?.data?.fullName || 'User' }}</p>
                <p class="text-xs text-gray-500 truncate mt-0.5">{{ profileRes?.data?.email || '' }}</p>
              </div>
              <NuxtLink v-if="profileRes?.data?.email === 'admin@travel.com'" to="/admin/packages" class="block w-full text-left px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors border-b border-gray-100 flex items-center justify-between">
                Kelola Web
                <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4" />
              </NuxtLink>
              <button @click="showLogoutPopup = true" class="block w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-b-xl transition-colors">
                Logout
              </button>
            </div>
          </div>
          <NuxtLink v-else to="/login" class="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors">
            Login
          </NuxtLink>

          <!-- Mobile Menu Button -->
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 text-gray-700 hover:text-blue-600 focus:outline-none transition-colors">
            <UIcon :name="isMobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="w-7 h-7" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      <div v-show="isMobileMenuOpen" class="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-100 absolute w-full left-0 top-full shadow-lg transition-all duration-300 z-40">
        <nav class="flex flex-col p-4">
          <NuxtLink @click="isMobileMenuOpen = false" to="#destinasi" class="text-sm font-bold text-gray-700 hover:text-blue-600 py-3 border-b border-gray-50">Destinasi</NuxtLink>
          <NuxtLink @click="isMobileMenuOpen = false" to="#layanan" class="text-sm font-bold text-gray-700 hover:text-blue-600 py-3 border-b border-gray-50">Layanan</NuxtLink>
          <NuxtLink @click="isMobileMenuOpen = false" to="#testimoni" class="text-sm font-bold text-gray-700 hover:text-blue-600 py-3 border-b border-gray-50">Testimoni</NuxtLink>
          <NuxtLink @click="isMobileMenuOpen = false" to="#kontak" class="text-sm font-bold text-gray-700 hover:text-blue-600 py-3">Kontak</NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Logout Confirmation Popup -->
    <div v-if="showLogoutPopup" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm mx-auto transform transition-all text-center">
        <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-6 h-6 text-red-600" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">Konfirmasi Logout</h3>
        <p class="text-sm text-gray-600 mb-6">Apakah Anda yakin ingin keluar dari akun ini?</p>
        <div class="flex gap-3">
          <button @click="showLogoutPopup = false" class="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            Tidak
          </button>
          <button @click="confirmLogout" class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors">
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>

    <!-- Review Success Popup -->
    <div v-if="showSuccessPopup" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm mx-auto transform transition-all text-center animate-bounce-in">
        <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-heroicons-check" class="w-6 h-6 text-green-600" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">Berhasil!</h3>
        <p class="text-sm text-gray-600 mb-6">Ulasan Anda berhasil dikirim! Terima kasih atas feedback-nya.</p>
        <button @click="showSuccessPopup = false" class="w-full px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
          Tutup
        </button>
      </div>
    </div>

    <!-- Login Required Popup -->
    <div v-if="showLoginRequiredPopup" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm mx-auto transform transition-all text-center">
        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-heroicons-lock-closed" class="w-6 h-6 text-blue-600" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">Akses Terbatas</h3>
        <p class="text-sm text-gray-600 mb-6">Anda harus login terlebih dahulu untuk dapat memberikan ulasan destinasi.</p>
        <div class="flex gap-3">
          <button @click="showLoginRequiredPopup = false" class="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            Nanti Saja
          </button>
          <NuxtLink to="/login" class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors block">
            Login Sekarang
          </NuxtLink>
        </div>
      </div>
    </div>

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
        class="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white hover:text-blue-600 hover:scale-125 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
      >
        <UIcon name="i-heroicons-chevron-left" class="w-10 h-10 drop-shadow-md" />
      </button>
      <button 
        @click="manualNextBanner" 
        class="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white hover:text-blue-600 hover:scale-125 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
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
        
        <section id="destinasi" class="scroll-mt-24">
          <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <UIcon name="i-heroicons-globe-asia-australia" class="text-blue-600 w-5 h-5" />
              Rute Perjalanan & Destinasi
            </h2>
            
            <!-- Segment / Bubble Filters -->
            <div class="flex flex-wrap gap-2 justify-center md:justify-end">
              <button 
                v-for="type in ['semua', 'bus', 'travel', 'pesawat', 'kereta']" 
                :key="type"
                @click="selectedTransport = type"
                class="px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all border shadow-sm"
                :class="selectedTransport === type ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
              >
                {{ type }}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            <div v-for="pkg in filteredPackages" :key="pkg.id" @click="openPackageModal(pkg)" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer group">
              <div class="relative h-48 w-full overflow-hidden">
                <img :src="`/${pkg.image}`" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Destinasi">
                <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                  <UIcon name="i-heroicons-star-16-solid" class="text-yellow-400 w-4 h-4" />
                  {{ pkg.rating }}
                </div>
                <div class="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {{ pkg.transportType || pkg.transport_type }}
                </div>
              </div>
              <div class="p-5 flex flex-col flex-grow">
                <div class="flex items-center gap-2 mb-3">
                  <div class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">
                    {{ pkg.origin }}
                  </div>
                  <UIcon name="i-heroicons-arrow-right-16-solid" class="text-gray-400 w-4 h-4" />
                  <div class="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
                    {{ pkg.destination }}
                  </div>
                </div>
                
                <h3 class="font-bold text-base text-gray-900 mb-1 line-clamp-1 flex items-center gap-1">
                  {{ pkg.provider }}
                </h3>
                <p class="text-gray-500 text-xs leading-relaxed mb-5 line-clamp-2">{{ pkg.name }} - {{ pkg.description }}</p>
                
                <div class="flex justify-between items-center mt-auto pt-3 border-t">
                  <div>
                    <p class="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Estimasi Biaya</p>
                    <p class="text-blue-600 font-extrabold text-sm">Rp {{ Number(pkg.price).toLocaleString('id-ID') }}</p>
                  </div>
                  <span class="text-xs text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Jelajahi <UIcon name="i-heroicons-arrow-right" class="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="layanan" class="scroll-mt-24">
          <div class="mb-8">
            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2 mb-2">
              <UIcon name="i-heroicons-sparkles" class="text-blue-600 w-5 h-5" />
              Layanan KONG Travel
            </h2>
            <p class="text-sm text-gray-500 max-w-2xl">Kami menyediakan berbagai layanan transportasi untuk menunjang perjalanan Anda, mulai dari perorangan hingga rombongan dengan pelayanan yang aman dan nyaman.</p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <!-- Card 1 (Travel) -->
            <div @click="filterAndScrollTo('travel')" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow group cursor-pointer">
              <div class="w-16 h-16 rounded-full overflow-hidden mb-4 shadow-sm group-hover:ring-4 group-hover:ring-blue-100 transition-all flex items-center justify-center">
                <img src="/travel.jpg" alt="Travel Antar Kota" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 class="font-bold text-gray-800 mb-2">Travel Antar Kota</h3>
              <p class="text-xs text-gray-500 leading-relaxed mb-4 flex-grow">Layanan travel reguler dan point-to-point untuk perjalanan antar kota yang cepat dan nyaman.</p>
              <button class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                PILIH TRAVEL <UIcon name="i-heroicons-arrow-right" class="w-3 h-3" />
              </button>
            </div>
            
            <!-- Card 2 (Bus) -->
            <div @click="filterAndScrollTo('bus')" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow group cursor-pointer">
              <div class="w-16 h-16 rounded-full overflow-hidden mb-4 shadow-sm group-hover:ring-4 group-hover:ring-blue-100 transition-all flex items-center justify-center">
                <img src="/bus.jpg" alt="Bus Pariwisata" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 class="font-bold text-gray-800 mb-2">Bus Pariwisata</h3>
              <p class="text-xs text-gray-500 leading-relaxed mb-4 flex-grow">Sewa armada bus pariwisata untuk liburan rombongan, study tour, atau gathering perusahaan.</p>
              <button class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                PILIH BUS <UIcon name="i-heroicons-arrow-right" class="w-3 h-3" />
              </button>
            </div>
            
            <!-- Card 3 (Pesawat) -->
            <div @click="filterAndScrollTo('pesawat')" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow group cursor-pointer">
              <div class="w-16 h-16 rounded-full overflow-hidden mb-4 shadow-sm group-hover:ring-4 group-hover:ring-blue-100 transition-all flex items-center justify-center">
                <img src="/pesawat.jpg" alt="Tiket Pesawat" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 class="font-bold text-gray-800 mb-2">Tiket Pesawat</h3>
              <p class="text-xs text-gray-500 leading-relaxed mb-4 flex-grow">Pemesanan tiket pesawat rute domestik dan internasional dengan penawaran harga terbaik.</p>
              <button class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                PILIH PESAWAT <UIcon name="i-heroicons-arrow-right" class="w-3 h-3" />
              </button>
            </div>
            
            <!-- Card 4 (Kereta) -->
            <div @click="filterAndScrollTo('kereta')" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow group cursor-pointer">
              <div class="w-16 h-16 rounded-full overflow-hidden mb-4 shadow-sm group-hover:ring-4 group-hover:ring-blue-100 transition-all flex items-center justify-center">
                <img src="/kereta.jpg" alt="Kereta Api" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 class="font-bold text-gray-800 mb-2">Kereta Api</h3>
              <p class="text-xs text-gray-500 leading-relaxed mb-4 flex-grow">Reservasi tiket kereta api anti ribet untuk perjalanan bebas macet melintasi pulau Jawa & Sumatera.</p>
              <button class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                PILIH KERETA <UIcon name="i-heroicons-arrow-right" class="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>

        <section id="testimoni" class="scroll-mt-24">
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
                <div class="col-span-1 sm:col-span-2">
                  <label class="block text-xs font-semibold text-gray-500 mb-1">Paket yang Diulas</label>
                  <select 
                    v-model="newPackageId"
                    required
                    class="w-full text-xs border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-gray-200 bg-white"
                  >
                    <option value="" disabled>Pilih Paket Destinasi...</option>
                    <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
                      {{ pkg.name }} ({{ pkg.origin }} - {{ pkg.destination }})
                    </option>
                  </select>
                </div>
                <div class="col-span-1 sm:col-span-2 mt-2">
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
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>

    <!-- Package Details Modal -->
    <div v-if="showPackageModal && selectedPackage" @click.self="showPackageModal = false" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto overflow-hidden flex flex-col animate-bounce-in max-h-[90vh]">
        <div class="relative h-64 w-full flex-shrink-0">
          <img :src="`/${selectedPackage.image}`" class="w-full h-full object-cover" alt="Detail Destinasi">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div class="absolute bottom-4 left-6 right-6">
            <div class="flex items-center gap-2 mb-2">
              <span class="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">{{ selectedPackage.transportType || selectedPackage.transport_type }}</span>
              <div class="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1 shadow-sm">
                <UIcon name="i-heroicons-star-16-solid" class="text-yellow-400 w-4 h-4" />
                {{ selectedPackage.rating }}
              </div>
            </div>
            <h2 class="text-2xl font-bold text-white mb-1">{{ selectedPackage.name }}</h2>
            <div class="flex items-center gap-2 text-gray-200 text-sm font-medium">
              <span>{{ selectedPackage.origin }}</span>
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
              <span>{{ selectedPackage.destination }}</span>
            </div>
          </div>
        </div>
        
        <div class="p-6 overflow-y-auto flex-grow">
          <div class="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
            <div>
              <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Provider Transportasi</p>
              <p class="text-gray-900 font-bold flex items-center gap-2">
                <UIcon name="i-heroicons-building-office-2" class="w-5 h-5 text-blue-600" />
                {{ selectedPackage.provider }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Estimasi Biaya</p>
              <p class="text-blue-600 font-extrabold text-xl">Rp {{ Number(selectedPackage.price).toLocaleString('id-ID') }}</p>
            </div>
          </div>
          
          <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600" />
            Detail Perjalanan & Fasilitas
          </h3>
          <div class="text-sm text-gray-600 leading-relaxed space-y-4">
            <p v-if="selectedPackage.description" class="font-medium text-gray-800">{{ selectedPackage.description }}</p>
            <p>
              Siapkan diri Anda untuk sebuah pengalaman perjalanan yang tak terlupakan bersama <strong>{{ selectedPackage.provider }}</strong>. Rute perjalanan dari <strong>{{ selectedPackage.origin }}</strong> menuju <strong>{{ selectedPackage.destination }}</strong> kini terasa lebih mudah, eksklusif, dan sangat memuaskan. Dengan menggunakan dukungan armada <strong>{{ selectedPackage.transportType || selectedPackage.transport_type }}</strong> kelas atas, kami senantiasa memastikan standar kenyamanan maupun tingkat keamanan Anda tetap terjaga dengan maksimal di sepanjang rute perjalanan wisata Anda.
            </p>
            <p>
              Fasilitas unggulan yang kami tawarkan pada armada meliputi kursi yang ergonomis dan sangat nyaman, ruang kaki (<em>legroom</em>) yang ekstra lega untuk berselonjor, sistem hiburan terpadu yang memanjakan mata selama perjalanan, serta kualitas pelayanan yang sangat ramah dan profesional dari kru berpengalaman kami. Anda dapat bersantai menikmati pesona pemandangan alam nusantara yang menakjubkan selama di perjalanan, melepas penat sejenak dari hiruk-pikuk rutinitas harian yang melelahkan, dan pada akhirnya menciptakan berbagai momen liburan yang indah dan berkesan bersama keluarga dan orang-orang terkasih.
            </p>
            <p>
              Segera mantapkan hati dan pilih paket perjalanan luar biasa ini untuk meraih pengalaman liburan berkelas premium tanpa perlu menguras isi dompet Anda. KONG Travel Agent akan selalu hadir menjadi mitra sahabat perjalanan terbaik Anda, siap sedia mewujudkan destinasi liburan impian Anda menjadi kenyataan yang tak ternilai harganya. Pesan sekarang dan raih kualitas pelayanan wisata yang tak tertandingi di kelasnya!
            </p>
          </div>
        </div>
        
        <div class="p-4 bg-gray-50 border-t border-gray-100 flex justify-end flex-shrink-0">
          <button @click.stop="showPackageModal = false" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm">
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>

    <!-- Footer Seksi Kontak Baru -->
    <footer id="kontak" class="bg-blue-600 border-t border-blue-700 mt-20 py-12 text-xs text-blue-100 scroll-mt-24">
      <div class="container mx-auto px-4 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <img src="/logo-kong.png" alt="KONG Travel" class="w-6 h-6 object-contain brightness-0 invert" />
            <h4 class="font-bold text-white text-sm">KONG Travel Agent</h4>
          </div>
          <p class="leading-relaxed">Solusi lengkap perjalanan wisata nusantara tepercaya. Temukan penawaran terbaik dan destinasi impian Anda bersama kami.</p>
        </div>
        <div>
          <h4 class="font-bold text-white text-sm mb-4">Jelajahi KONG</h4>
          <ul class="space-y-2.5">
            <li class="flex items-center gap-2"><UIcon name="i-heroicons-chevron-right" class="w-3 h-3 text-blue-300"/> Halaman Utama</li>
            <li class="flex items-center gap-2"><UIcon name="i-heroicons-chevron-right" class="w-3 h-3 text-blue-300"/> Pilihan Paket Destinasi</li>
            <li class="flex items-center gap-2"><UIcon name="i-heroicons-chevron-right" class="w-3 h-3 text-blue-300"/> Armada & Transportasi</li>
            <li class="flex items-center gap-2"><UIcon name="i-heroicons-chevron-right" class="w-3 h-3 text-blue-300"/> Kisah & Ulasan Pelanggan</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-white text-sm mb-4">Hubungi Kami</h4>
          <ul class="space-y-2.5">
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-phone" class="text-blue-200 w-4 h-4" />
              <span>+62 812-3456-7890</span>
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-envelope" class="text-blue-200 w-4 h-4" />
              <span>info@kongtravel.com</span>
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-map-pin" class="text-blue-200 w-4 h-4" />
              <span>Parongpong, Bandung Barat, Jawa Barat, Indonesia</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="container mx-auto px-4 max-w-6xl mt-8 pt-6 border-t border-blue-500/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-blue-200">
        <p>&copy; 2026 KONG Travel Agent. All rights reserved.</p>
      </div>
    </footer>

  </div>
</template>
