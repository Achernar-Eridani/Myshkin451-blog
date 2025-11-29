<template>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition duration-300">
      <!-- 文章封面图(如果有) -->
      <img v-if="article.coverImage" 
           :src="article.coverImage" 
           :alt="article.title || '文章'"
           class="w-full h-48 object-cover" />
      
      <div class="p-4">
        <!-- 文章标题 -->
        <router-link :to="`/posts/${article.id}`" class="block">
          <h2 class="text-xl font-bold text-gray-800 hover:text-blue-600 mb-2">{{ article.title || '无标题文章' }}</h2>
        </router-link>
        
        <!-- 文章元信息 -->
        <div class="flex items-center text-sm text-gray-500 mb-3">
          <span v-if="article.author" class="flex items-center mr-4">
            <img :src="article.author.avatar || '/img/default-avatar.png'" 
                 :alt="article.author.username || '作者'"
                 class="w-6 h-6 rounded-full mr-1" />
            {{ article.author?.username || '未知作者' }}
          </span>
          <span v-if="article.createdAt" class="mr-4">{{ formatDate(article.createdAt) }}</span>
          <span v-if="article.views !== undefined" class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ article.views }}
          </span>
        </div>
        
        <!-- 文章摘要 -->
        <p class="text-gray-600 mb-4">
          {{ article.excerpt || (article.content && article.content.substring(0, 150) + '...') || '暂无摘要' }}
        </p>
        
        <!-- 文章分类和标签 -->
        <div class="flex flex-wrap items-center">
          <router-link v-if="article.category" 
                       :to="`/categories/${article.category.slug || article.category.id}`"
                       class="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded mr-2 mb-2">
            {{ article.category.name || '分类' }}
          </router-link>
          
          <router-link v-for="tag in article.tags || []" 
                       :key="tag.id || tag" 
                       :to="`/tags/${tag.slug || tag.id || tag}`"
                       class="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded mr-2 mb-2">
            # {{ tag.name || tag }}
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    article: {
      type: Object,
      required: true
    }
  });
  
  // 日期格式化
  const formatDate = (dateString) => {
    if (!dateString) return '未知日期';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('日期格式化错误:', e);
      return '日期格式错误';
    }
  };
  </script>