<template>
  <article class="group flex flex-col h-full bg-transparent">
    <div class="relative w-full aspect-[16/9] overflow-hidden rounded-lg mb-5 bg-gray-100 dark:bg-gray-800">
      <router-link :to="`/posts/${article.id}`" class="block w-full h-full">
        <img 
          v-if="validImage" 
          :src="article.coverImage" 
          :alt="article.title"
          class="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105" 
          @error="handleImageError"
        />
        <div 
          v-else 
          class="w-full h-full flex items-center justify-center bg-[#f0f0f0] dark:bg-[#1a1a1a] relative overflow-hidden"
        >
          <div class="absolute inset-0 opacity-[0.05] bg-[repeating-linear-gradient(45deg,#000_0px,#000_1px,transparent_1px,transparent_10px)] dark:bg-[repeating-linear-gradient(45deg,#fff_0px,#fff_1px,transparent_1px,transparent_10px)]"></div>
          <span class="font-mono text-xs font-bold text-gray-400 border border-gray-400 px-2 py-1">NO SIGNAL</span>
        </div>
      </router-link>

      <router-link 
        v-if="article.category"
        :to="`/categories/${article.category.slug || article.category.id}`"
        class="absolute top-3 left-3 bg-white/90 dark:bg-black/90 backdrop-blur text-xs font-mono px-2 py-1 border border-gray-200 dark:border-gray-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
      >
        {{ article.category.name }}
      </router-link>
    </div>

    <div class="flex flex-col flex-grow">
      <div class="flex items-center justify-between text-xs font-mono text-gray-500 mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">
        <time :datetime="article.createdAt">{{ formatDate(article.createdAt) }}</time>
        <span v-if="article.views !== undefined">READ: {{ article.views }}</span>
      </div>

      <router-link :to="`/posts/${article.id}`" class="block group-hover:opacity-70 transition-opacity">
        <h3 class="text-xl font-serif font-medium leading-snug text-gray-900 dark:text-gray-100 mb-3">
          {{ article.title }}
        </h3>
      </router-link>

      <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-4">
        {{ article.excerpt || stripHtml(article.content) }}
      </p>

      <div class="mt-auto pt-2 flex flex-wrap gap-2">
         <span v-for="tag in (article.tags || []).slice(0, 3)" :key="tag.id" class="text-xs font-mono text-gray-400 before:content-['#']">
           {{ tag.name }}
         </span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';

const props = defineProps({
  article: { type: Object, required: true, default: () => ({ tags: [] }) }
});

const imageLoadError = ref(false);

const validImage = computed(() => {
  return props.article.coverImage && 
         props.article.coverImage.trim() !== '' && 
         !imageLoadError.value;
});

const handleImageError = () => { imageLoadError.value = true; };

const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};
</script>