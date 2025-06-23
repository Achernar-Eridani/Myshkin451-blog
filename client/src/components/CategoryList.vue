<template>
    <div class="category-list bg-white dark:bg-dark-surface rounded-lg shadow-sm border dark:border-dark-border p-4">
      <h2 class="text-xl font-bold text-gray-800 dark:text-dark-text mb-4">{{ title || '分类' }}</h2>
      
      <div v-if="loading" class="text-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
      
      <div v-else-if="categories.length === 0" class="text-gray-500 dark:text-dark-muted text-center py-2">
        暂无分类
      </div>
      
      <div v-else class="space-y-2">
        <router-link 
          v-for="category in categories" 
          :key="category.id" 
          :to="`/categories/${category.slug}`"
          class="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-dark-card transition duration-200"
          :class="activeCategoryId === category.id ? 'bg-blue-100 dark:bg-dark-accent/20 text-blue-700 dark:text-dark-accent' : 'text-gray-700 dark:text-dark-text'"
        >
          {{ category.name }}
          <span v-if="showCount" class="text-gray-500 dark:text-dark-muted text-sm ml-1">({{ category.postCount || 0 }})</span>
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    categories: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '分类'
    },
    activeCategoryId: {
      type: [Number, String],
      default: null
    },
    showCount: {
      type: Boolean,
      default: true
    }
  });
  </script>