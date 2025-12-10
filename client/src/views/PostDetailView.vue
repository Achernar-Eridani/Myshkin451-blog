<template>
  <div class="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
    <Navbar />

    <div class="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-300" :style="{ width: scrollProgress + '%' }"></div>
    
    <main class="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <article v-else-if="post" class="animate-fade-in">
        <header class="mb-12 text-center">
          <router-link 
            v-if="post.category"
            :to="`/categories/${post.category.slug}`"
            class="inline-block px-3 py-1 mb-6 text-xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase border border-blue-100 dark:border-blue-900 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            {{ post.category.name }}
          </router-link>

          <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-50 leading-tight mb-6">
            {{ post.title }}
          </h1>

          <div class="flex items-center justify-center space-x-6 text-sm font-mono text-gray-500 dark:text-gray-400">
            <div class="flex items-center">
               <span class="mr-2">BY</span>
               <span class="font-bold text-gray-900 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700 pb-0.5">{{ post.user?.username || 'Myshkin' }}</span>
            </div>
            <time :datetime="post.createdAt">{{ formatDate(post.createdAt) }}</time>
            </div>
        </header>

        <div v-if="post.coverImage" class="mb-12 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
          <img :src="post.coverImage" :alt="post.title" class="w-full object-cover max-h-[500px]">
        </div>

        <div class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 prose-img:rounded-xl prose-pre:bg-gray-900 dark:prose-pre:bg-[#1a1a1a] prose-pre:border dark:prose-pre:border-gray-800">
          <div v-html="renderedContent"></div>
        </div>

        <div class="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
           <div class="flex flex-wrap gap-3">
             <router-link
                v-for="tag in post.tags"
                :key="tag.id"
                :to="`/tags/${tag.slug}`"
                class="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
             >
                #{{ tag.name }}
             </router-link>
           </div>
        </div>

        <div class="mt-16 bg-gray-50 dark:bg-[#111] rounded-2xl p-6 md:p-10 border border-gray-100 dark:border-gray-800">
          <h3 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">Comments</h3>
          <CommentSection :post-id="route.params.id" />
        </div>

      </article>

      <div v-else class="text-center py-20">
        <h2 class="text-2xl font-bold text-gray-300">Article not found</h2>
        <router-link to="/" class="mt-4 inline-block text-blue-500">Back home</router-link>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import CommentSection from '../components/CommentSection.vue';
import api from '../api';
import MarkdownIt from 'markdown-it';
// 引入 highlight.js 样式 (建议在 main.js 全局引入，不过这里保留以防万一)
import 'highlight.js/styles/atom-one-dark.css'; 

// Markdown 配置保持不变
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && window.hljs && window.hljs.getLanguage(lang)) {
      try {
        return window.hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ''; 
  }
});

const post = ref(null);
const loading = ref(true);
const route = useRoute();
const scrollProgress = ref(0); // 滚动进度条

const renderedContent = computed(() => {
  return post.value ? md.render(post.value.content) : '';
});

// 处理滚动条进度
const handleScroll = () => {
  const totalScroll = document.documentElement.scrollTop;
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scroll = `${totalScroll / windowHeight}`;
  scrollProgress.value = Number(scroll) * 100;
}

const fetchPost = async () => {
  loading.value = true;
  try {
    const postId = route.params.id;
    post.value = await api.getPostById(postId);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// 格式化日期：使用英文格式更 Geek
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  });
};

onMounted(() => {
  fetchPost();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style>
/* 确保 Prose 里的图片圆角和间距 */
.prose img {
  margin-top: 2rem;
  margin-bottom: 2rem;
  border-radius: 0.75rem; /* rounded-xl */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>