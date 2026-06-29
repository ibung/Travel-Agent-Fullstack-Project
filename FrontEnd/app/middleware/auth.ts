export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('admin_token')

  // Jika token tidak ada, arahkan langsung ke halaman login
  if (!token.value) {
    return navigateTo('/admin/login')
  }
})
