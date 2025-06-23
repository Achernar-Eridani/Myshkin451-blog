<template>
  <div class="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text">
    <router-view />
  </div>
</template>

<script setup>
import { useDarkMode } from '@/composables/useDarkMode'

// 初始化黑夜模式
const { initTheme } = useDarkMode()
initTheme()
</script>