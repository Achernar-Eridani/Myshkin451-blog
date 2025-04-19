<template>
    <div class="tag-cloud bg-white rounded-lg shadow-sm border p-4">
      <h2 class="text-xl font-bold text-gray-800 mb-4">{{ title || '标签云' }}</h2>
      
      <div v-if="loading" class="text-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
      
      <div v-else-if="tags.length === 0" class="text-gray-500 text-center py-2">
        暂无标签
      </div>
      
      <div v-else class="flex flex-wrap gap-2">
        <router-link 
          v-for="tag in tags" 
          :key="tag.id" 
          :to="`/tags/${tag.slug}`"
          class="inline-block px-3 py-1 rounded text-sm hover:bg-gray-200 transition duration-200"
          :class="[
            activeTagId === tag.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700',
            getFontSizeClass(tag)
          ]"
        >
          {{ tag.name }}
          <span v-if="showCount" class="text-gray-500 text-xs ml-1">({{ tag.postCount || 0 }})</span>
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    tags: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '标签云'
    },
    activeTagId: {
      type: [Number, String],
      default: null
    },
    showCount: {
      type: Boolean,
      default: true
    }
  });
  
  // 根据文章数量设置字体大小类
  const getFontSizeClass = (tag) => {
    const count = tag.postCount || 0;
    
    if (count > 10) return 'text-lg';
    else if (count > 5) return 'text-base';
    else return 'text-sm';
  };
  </script>