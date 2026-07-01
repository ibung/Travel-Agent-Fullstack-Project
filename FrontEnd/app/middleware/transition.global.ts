export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith('/admin') && from.path.startsWith('/admin')) {
    to.meta.pageTransition = false
  } else {
    to.meta.pageTransition = { name: 'page', mode: 'out-in' }
  }
})
