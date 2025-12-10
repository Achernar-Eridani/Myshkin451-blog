<template>
  <article 
    class="group relative flex flex-col h-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-gray-900 dark:hover:border-gray-500 hover:shadow-xl"
  >
    <div class="relative w-full h-56 overflow-hidden bg-gray-100 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
      <img 
        v-if="article.coverImage" 
        :src="article.coverImage" 
        :alt="article.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
        <span class="text-4xl font-mono font-bold opacity-20">M / 451</span>
      </div>
      
      <router-link 
        v-if="article.category"
        :to="`/categories/${article.category.slug || article.category.id}`"
        class="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 text-xs font-mono font-medium uppercase tracking-wider text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-black hover:text-white transition-colors"
      >
        {{ article.category.name }}
      </router-link>
    </div>

    <div class="flex flex-col flex-grow p-6">
      <div class="flex items-center text-xs font-mono text-gray-500 mb-3 space-x-4">
        <time :datetime="article.createdAt">
          {{ formatDate(article.createdAt) }}
        </time>
        <span v-if="article.views" class="flex items-center">
          <span class="mr-1">/</span> {{ article.views }} READS
        </span>
      </div>

      <router-link :to="`/posts/${article.id}`" class="block group-hover:underline decoration-2 decoration-blue-600 underline-offset-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
          {{ article.title }}
        </h3>
      </router-link>

      <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
        {{ article.excerpt || stripHtml(article.content) }}
      </p>

      <div class="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between mt-auto">
        <div class="flex flex-wrap gap-2">
           <router-link 
             v-for="tag in article.tags.slice(0, 3)" 
             :key="tag.id"
             :to="`/tags/${tag.slug || tag.id}`"
             class="text-xs font-mono text-gray-500 hover:text-blue-600 transition-colors"
           >
             #{{ tag.name }}
           </router-link>
        </div>
        
        <router-link :to="`/posts/${article.id}`" class="text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </router-link>
      </div>
    </div>
  </article>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  article: {
    type: Object,
    required: true,
    // 默认值保护，防止报错
    default: () => ({
      tags: [],
      category: null,
      title: 'Untitled Post',
      content: ''
    })
  }
});

// 1. 更优雅的日期格式化 (Intl API)
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short', // "Dec" 比 "12月" 在技术博客里更好看
    day: 'numeric'
  }).format(new Date(dateString));
};

// 2. 简单的去 HTML 标签工具 (防止摘要显示 raw markdown)
const stripHtml = (html) => {
  if (!html) return 'No preview available.';
  // 创建一个临时的 DOM 元素来提取纯文本
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};
</script>

<style scoped>
/* 确保 line-clamp 生效 (Tailwind 通常自带，但以防万一) */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>