<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const tokenCookie = useCookie('admin_token')

const { data: apiResponse, refresh } = await useFetch('http://localhost:3333/api/users', {
  headers: {
    Authorization: `Bearer ${tokenCookie.value}`
  }
})
const users = computed(() => apiResponse.value?.data || [])

const isSidebarOpen = useState('isSidebarOpen', () => true)

const form = ref({ 
  firstName: '', lastName: '', email: '', password: ''
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

const startEdit = (user) => {
  isEditing.value = true
  editId.value = user.id
  const names = (user.fullName || '').split(' ')
  const firstName = names[0] || ''
  const lastName = names.slice(1).join(' ') || ''
  form.value = {
    firstName: firstName,
    lastName: lastName,
    email: user.email || '',
    password: '' // Kosongkan password agar tidak terlihat, hanya diisi kalau mau update
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editId.value = null
  form.value = { 
    firstName: '', lastName: '', email: '', password: ''
  }
}

const handleSaveUser = async () => {
  isSubmitting.value = true
  
  const url = isEditing.value 
    ? `http://localhost:3333/api/users/${editId.value}` 
    : 'http://localhost:3333/api/users'
    
  const method = isEditing.value ? 'PUT' : 'POST'

  try {
    const bodyData = {
      fullName: `${form.value.firstName} ${form.value.lastName}`.trim(),
      email: form.value.email
    }
    
    // Hanya kirim password jika diisi
    if (form.value.password) {
      bodyData.password = form.value.password
    }

    await $fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`
      },
      body: bodyData
    })
    showToast(isEditing.value ? 'Data pengguna berhasil diperbarui.' : 'Data pengguna berhasil disimpan.', 'success')
    cancelEdit()
    refresh()
  } catch (err) {
    if (err?.response?.status === 401) {
      showToast('Sesi habis. Silakan login ulang.', 'error')
      await navigateTo('/login')
    } else {
      showToast('Gagal memproses data pengguna.', 'error')
    }
  } finally {
    isSubmitting.value = false
  }
}

const deleteId = ref(null)
const showDeleteConfirm = ref(false)

const confirmDelete = (id) => {
  deleteId.value = id
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!deleteId.value) return
  
  try {
    await $fetch(`http://localhost:3333/api/users/${deleteId.value}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`
      }
    })
    showToast('Pengguna berhasil dihapus.', 'success')
    showDeleteConfirm.value = false
    deleteId.value = null
    refresh()
  } catch (err) {
    showToast('Gagal menghapus pengguna.', 'error')
  }
}
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
    <AdminSidebar v-show="isSidebarOpen" class="flex-shrink-0 transition-all duration-300 z-20" />
    
    <div class="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300">
      
      <header class="bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div class="flex items-center gap-4">
          <button @click="isSidebarOpen = !isSidebarOpen" class="text-gray-500 hover:text-blue-600 focus:outline-none transition-colors">
            <UIcon name="i-heroicons-bars-3-bottom-left" class="w-6 h-6" />
          </button>
          <h1 class="text-xl font-bold text-gray-800 tracking-tight">Kelola Pengguna</h1>
        </div>
      </header>
      
      <main class="flex-1 overflow-y-auto p-6 md:p-8">
        <div class="max-w-6xl mx-auto space-y-6">
          
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                <UIcon name="i-heroicons-user-plus" class="w-5 h-5 text-blue-600" />
                {{ isEditing ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru' }}
              </h2>
            </div>
            
            <form @submit.prevent="handleSaveUser" class="p-6 space-y-5" autocomplete="off">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="space-y-1.5">
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Depan</label>
                  <input v-model="form.firstName" type="text" required
                    class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Contoh: John" autocomplete="off" />
                </div>

                <div class="space-y-1.5">
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Belakang</label>
                  <input v-model="form.lastName" type="text" required
                    class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Contoh: Doe" autocomplete="off" />
                </div>
                
                <div class="space-y-1.5">
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                  <input v-model="form.email" type="email" name="admin_user_email_new" required
                    class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Contoh: john@example.com" autocomplete="nope" />
                </div>
                
                <div class="space-y-1.5 md:col-span-2">
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Password <span v-if="isEditing" class="text-gray-400 font-normal lowercase">(kosongkan jika tidak ingin diubah)</span>
                  </label>
                  <input v-model="form.password" type="password" :required="!isEditing"
                    class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••" autocomplete="new-password" />
                </div>
              </div>
              
              <div class="flex items-center gap-3 pt-2">
                <button type="submit" :disabled="isSubmitting"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-colors disabled:bg-gray-400 flex items-center gap-2">
                  <UIcon v-if="isSubmitting" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                  <UIcon v-else name="i-heroicons-check-circle" class="w-4 h-4" />
                  {{ isSubmitting ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Simpan Pengguna') }}
                </button>
                <button v-if="isEditing" type="button" @click="cancelEdit"
                  class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors">
                  Batal Edit
                </button>
              </div>
            </form>
          </div>
          
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                <UIcon name="i-heroicons-users" class="w-5 h-5 text-blue-600" />
                Daftar Pengguna
              </h2>
              <span class="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {{ users.length }} Pengguna
              </span>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th class="px-6 py-4">ID</th>
                    <th class="px-6 py-4">Nama</th>
                    <th class="px-6 py-4">Email</th>
                    <th class="px-6 py-4">Tgl Daftar</th>
                    <th class="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-if="users.length === 0">
                    <td colspan="5" class="px-6 py-8 text-center text-gray-500 text-sm">
                      Belum ada data pengguna.
                    </td>
                  </tr>
                  <tr v-for="user in users" :key="user.id" class="hover:bg-blue-50/30 transition-colors group">
                    <td class="px-6 py-4 text-sm font-medium text-gray-500">#{{ user.id }}</td>
                    <td class="px-6 py-4">
                      <div class="font-bold text-gray-900 text-sm">{{ user.fullName || '-' }}</div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {{ new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                    </td>
                    <td class="px-6 py-4 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-2">
                        <button @click="startEdit(user)"
                          class="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                          <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
                        </button>
                        <button @click="confirmDelete(user.id)" :disabled="user.email === 'admin@travel.com'"
                          class="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Hapus">
                          <UIcon name="i-heroicons-trash" class="w-4 h-4" />
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
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all">
        <div class="p-6 text-center">
          <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-7 h-7 text-red-600" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Hapus Pengguna?</h3>
          <p class="text-sm text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan. Pengguna akan dihapus permanen dari sistem.</p>
          <div class="flex gap-3">
            <button @click="showDeleteConfirm = false" 
              class="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-colors">
              Batal
            </button>
            <button @click="handleDelete" 
              class="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm shadow-red-200">
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Toast Notification -->
    <div class="fixed bottom-6 right-6 z-50 transition-all duration-300 transform"
         :class="toastInfo.show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'">
      <div class="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border"
           :class="toastInfo.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'">
        <UIcon :name="toastInfo.type === 'success' ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" class="w-5 h-5 flex-shrink-0" />
        <p class="text-sm font-semibold">{{ toastInfo.message }}</p>
      </div>
    </div>
    
  </div>
</template>
