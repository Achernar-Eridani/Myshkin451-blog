<template>
  <article 
    class="group relative flex flex-col h-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-xl"
  >
    <div class="relative w-full h-56 overflow-hidden border-b border-gray-100 dark:border-gray-800">
      
      <img 
        v-if="validImage" 
        :src="article.coverImage" 
        :alt="article.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        @error="handleImageError"
      />
      
      <div 
        v-else 
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-blue-900/20 dark:via-gray-900 dark:to-purple-900/20"
      >
        <span class="text-4xl font-mono font-bold text-indigo-300 dark:text-indigo-800/50 select-none">
          M / 451
        </span>
      </div>
      
      <router-link 
        v-if="article.category"
        :to="`/categories/${article.category.slug || article.category.id}`"
        class="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-black hover:text-white transition-colors rounded-full shadow-sm"
      >
        {{ article.category.name }}
      </router-link>
    </div>

    <div class="flex flex-col flex-grow p-6">
      <div class="flex items-center text-xs font-mono text-gray-500 mb-3 space-x-4">
        <time :datetime="article.createdAt">{{ formatDate(article.createdAt) }}</time>
        <span v-if="article.views !== undefined" class="flex items-center">
          <span class="mr-1">/</span> {{ article.views }} READS
        </span>
      </div>

      <router-link :to="`/posts/${article.id}`" class="block">
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {{ article.title }}
        </h3>
      </router-link>

      <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
        {{ article.excerpt || stripHtml(article.content) }}
      </p>

      <div class="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between mt-auto">
        <div class="flex flex-wrap gap-2">
           <router-link 
             v-for="tag in (article.tags || []).slice(0, 3)" 
             :key="tag.id"
             :to="`/tags/${tag.slug || tag.id}`"
             class="text-xs font-mono text-gray-500 hover:text-blue-600 transition-colors"
           >
             #{{ tag.name }}
           </router-link>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';

const props = defineProps({
  article: {
    type: Object,
    required: true,
    default: () => ({ tags: [] })
  }
});

const imageLoadError = ref(false);

// 更严谨的图片判断：非空字符串 且 没有加载失败过
const validImage = computed(() => {
  return props.article.coverImage && 
         props.article.coverImage.trim() !== '' && 
         !imageLoadError.value;
});

const handleImageError = () => {
  imageLoadError.value = true; // 如果图片加载 404，自动回退到渐变色
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

</script>