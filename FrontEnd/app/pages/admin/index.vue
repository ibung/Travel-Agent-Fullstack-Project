<script setup>
// Otomatis lempar navigasi ke sub-page pertama
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/admin/packages')
    }
  ]
})
</script>
<template>
  <div></div>
</template>