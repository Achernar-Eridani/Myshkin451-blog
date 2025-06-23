<template>
    <div>
      <!-- 导航栏 -->
      <Navbar />
      
      <!-- 内容区域 -->
      <div class="container mx-auto px-4 py-8">
        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <!-- 错误状态 -->
        <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
          <button 
            @click="fetchPost" 
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            重试
          </button>
        </div>
        
        <!-- 文章内容 -->
        <div v-else-if="post" class="flex flex-col md:flex-row">
          <!-- 左侧主内容区 -->
          <div class="w-full md:w-2/3 md:pr-6">
            <!-- 文章头部信息 -->
            <div class="mb-8">
              <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">{{ post.title }}</h1>
              <div class="flex items-center text-gray-600 dark:text-dark-muted mb-4">
                <span>{{ formatDate(post.createdAt) }}</span>
                <span class="mx-2">·</span>
                <span>{{ post.user?.username || '未知作者' }}</span>
                <span v-if="post.category" class="mx-2">·</span>
                <router-link 
                  v-if="post.category"
                  :to="`/categories/${post.category.slug}`" 
                  class="text-blue-600 dark:text-dark-accent hover:underline"
                >
                  {{ post.category.name }}
                </router-link>
              </div>
              
              <!-- 标签列表 -->
              <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-6">
                <router-link
                  v-for="tag in post.tags"
                  :key="tag.id"
                  :to="`/tags/${tag.slug}`"
                  class="inline-block px-3 py-1 rounded bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-dark-text text-sm hover:bg-gray-200 dark:hover:bg-dark-card/80"
                >
                  #{{ tag.name }}
                </router-link>
              </div>
            </div>
            
            <!-- 文章内容 - Markdown渲染 -->
            <div class="prose max-w-none mb-8 bg-white dark:bg-dark-surface rounded-lg shadow-sm border dark:border-dark-border p-6">
              <div v-html="renderedContent"></div>
            </div>
            
            <!-- 评论区 -->
            <div class="mt-8 bg-white dark:bg-dark-surface rounded-lg shadow-sm border dark:border-dark-border p-6">
              <CommentSection :post-id="route.params.id" />
            </div>
          </div>
          
          <!-- 右侧侧边栏 -->
          <div class="w-full md:w-1/3 mt-8 md:mt-0">
            <!-- 作者信息卡片 -->
            <div class="bg-white dark:bg-dark-surface rounded-lg shadow-sm border dark:border-dark-border p-4 mb-6">
              <h2 class="text-xl font-bold text-gray-800 dark:text-dark-text mb-4">作者信息</h2>
              <div class="flex items-center">
                <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-dark-card mr-4"></div>
                <div>
                  <p class="font-semibold text-gray-800 dark:text-dark-text">{{ post.user?.username || '未知作者' }}</p>
                  <p class="text-gray-600 dark:text-dark-muted text-sm">{{ post.user?.bio || '这个人很懒，什么都没留下' }}</p>
                </div>
              </div>
            </div>
            
            <!-- 相关文章 - 后续可实现 -->
            <div class="bg-white dark:bg-dark-surface rounded-lg shadow-sm border dark:border-dark-border p-4">
              <h2 class="text-xl font-bold text-gray-800 dark:text-dark-text mb-4">相关文章</h2>
              <p class="text-gray-600 dark:text-dark-muted">相关文章功能将在后续实现...</p>
            </div>
          </div>
        </div>
        
        <!-- 文章不存在 -->
        <div v-else class="bg-gray-50 dark:bg-dark-card rounded-lg p-8 text-center">
          <p class="text-gray-600 dark:text-dark-muted mb-4">文章不存在或已被删除</p>
          <router-link to="/" class="text-blue-600 dark:text-dark-accent hover:underline">
            返回首页
          </router-link>
        </div>
      </div>
      
      <!-- 页脚 -->
      <Footer />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import Navbar from '../components/Navbar.vue';
  import Footer from '../components/Footer.vue';
  import api from '../api';
  import MarkdownIt from 'markdown-it';
  import CommentSection from '../components/CommentSection.vue';
  import 'highlight.js/styles/github.css'; // 确保安装此依赖
  
  // 创建markdown-it实例
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      // 这里需要确保安装了highlight.js
      if (lang && window.hljs && window.hljs.getLanguage(lang)) {
        try {
          return window.hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }
      return ''; // 使用外部默认转义
    }
  });
  
  // 状态
  const post = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const route = useRoute();
  
  // 计算属性
  const renderedContent = computed(() => {
    return post.value ? md.render(post.value.content) : '';
  });
  
  // 方法
  const fetchPost = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const postId = route.params.id;
      

      post.value = await api.getPostById(postId);
      
      console.log('获取到的文章详情:', post.value);
    } catch (err) {
      console.error('获取文章详情失败:', err);
      error.value = '获取文章失败，请稍后重试';
    } finally {
      loading.value = false;
    }
  };
  
  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // 组件挂载时获取数据
  onMounted(() => {
    fetchPost();
  });
  </script>
  
  <style>
  /* Markdown内容样式 */
  .prose {
    @apply text-gray-800 dark:text-dark-text leading-relaxed;
  }
  .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
    @apply font-bold mt-6 mb-4 text-gray-900 dark:text-dark-text;
  }
  .prose h1 {
    @apply text-2xl;
  }
  .prose h2 {
    @apply text-xl;
  }
  .prose h3 {
    @apply text-lg;
  }
  .prose p {
    @apply mb-4 text-gray-800 dark:text-dark-text;
  }
  .prose ul, .prose ol {
    @apply ml-5 mb-4;
  }
  .prose ul {
    @apply list-disc;
  }
  .prose ol {
    @apply list-decimal;
  }
  .prose pre {
    @apply bg-gray-100 dark:bg-dark-card p-4 rounded overflow-x-auto my-4;
  }
  .prose code {
    @apply bg-gray-100 dark:bg-dark-card px-1 rounded text-gray-800 dark:text-dark-text;
  }
  .prose blockquote {
    @apply border-l-4 border-gray-300 dark:border-dark-border pl-4 italic my-4 text-gray-700 dark:text-dark-muted;
  }
  .prose img {
    @apply max-w-full rounded my-4;
  }
  .prose a {
    @apply text-blue-600 dark:text-dark-accent hover:underline;
  }
  </style>