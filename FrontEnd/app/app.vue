<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}

/* Page Transition Animations */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.99);
  filter: blur(2px);
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
