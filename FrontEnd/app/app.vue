<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}

/* Custom Scrollbar agar tidak hitam tebal */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f8fafc; /* Slate 50 */
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1; /* Slate 300 */
  border-radius: 10px;
  border: 2px solid #f8fafc; /* Memberikan efek padding */
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; /* Slate 400 */
}
</style>