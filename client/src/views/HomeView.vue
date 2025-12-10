<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
    <Navbar />
    
    <main class="container mx-auto px-4 py-12 max-w-6xl">
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 animate-fade-in-up">
        
        <div class="md:col-span-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden group">
          <div class="relative z-10">
            <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              Hello, I'm <span class="text-blue-600 dark:text-blue-500">Myshkin</span>.
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 font-mono mb-6 max-w-lg">
              > Backend Developer<br>
              > History Enthusiast<br>
              > Building AI Agents...
            </p>
            <router-link 
              v-if="isAdmin" 
              to="/write" 
              class="inline-flex items-center px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </router-link>
          </div>
          <div class="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        </div>

        <div class="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition-colors">
          <h3 class="text-sm font-mono font-bold text-gray-500 uppercase mb-4">Explore Topics</h3>
          <div class="flex flex-wrap gap-2">
            <router-link 
              v-for="cat in categories.slice(0, 5)" 
              :key="cat.id" 
              :to="`/categories/${cat.slug || cat.id}`"
              class="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              {{ cat.name }}
            </router-link>
          </div>
        </div>

        <a href="https://github.com/Achernar-Eridani" target="_blank" class="bg-gray-900 dark:bg-blue-600 rounded-2xl p-6 text-white flex flex-col justify-between hover:scale-[1.02] transition-transform">
          <div class="flex justify-between items-start">
             <svg class="w-8 h-8 opacity-80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
             <svg class="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </div>
          <div>
            <p class="font-bold text-lg">GitHub</p>
            <p class="text-sm opacity-70">View my projects</p>
          </div>
        </a>
      </section>

      <section>
        <div class="flex items-center justify-between mb-8">
           <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
             <span class="w-2 h-8 bg-blue-600 rounded-sm mr-3"></span>
             Latest Writings
           </h2>
           <div v-if="totalPages > 1" class="font-mono text-sm text-gray-500">
             Page {{ currentPage }} / {{ totalPages }}
           </div>
        </div>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
        </div>

        <div v-else-if="posts.length === 0" class="py-20 text-center text-gray-500">
           <p class="text-xl">Nothing here yet.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleCardV2 
            v-for="post in posts" 
            :key="post.id" 
            :article="post" 
          />
        </div>

        <div class="mt-16 flex justify-center">
          <Pagination 
            v-if="posts.length > 0" 
            :current-page="currentPage" 
            :total-pages="totalPages" 
            @page-change="handlePageChange" 
          />
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import ArticleCardV2 from '../components/ArticleCardV2.vue'; // 使用新卡片
import Pagination from '../components/Pagination.vue';
import Footer from '../components/Footer.vue';
import api from '../api';

// 状态
const posts = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const totalPages = ref(1);
const categories = ref([]); // 只需要分类，用于 Bento Grid
const isAdmin = ref(false);

// 检查是否为管理员
const checkAdminStatus = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      isAdmin.value = userData.isAdmin === true || userData.role === 'admin';
    } catch (e) {
      console.error('解析用户数据失败', e);
    }
  }
};

// 获取文章列表
const fetchPosts = async (page = 1) => {
  try {
    loading.value = true;
    const response = await api.getPosts({ page, limit: 9 }); // Grid 布局每页 9 个比较好看
    
    // 数据处理逻辑保持不变...
    if (Array.isArray(response)) {
      posts.value = response;
    } else if (response.posts) {
      posts.value = response.posts;
      currentPage.value = response.pagination?.currentPage || 1;
      totalPages.value = response.pagination?.totalPages || 1;
    } else if (response.data) {
      posts.value = response.data;
    } else {
      posts.value = response || [];
    }
  } catch (error) {
    console.error('获取文章失败:', error);
    posts.value = [];
  } finally {
    loading.value = false;
  }
};

// 获取分类 (用于 Bento Grid)
const fetchCategories = async () => {
  try {
    categories.value = await api.getCategories();
  } catch (error) {
    console.error('获取分类失败:', error);
  }
};

const handlePageChange = (page) => {
  fetchPosts(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  fetchPosts();
  fetchCategories();
  checkAdminStatus();
});
</script>

<style scoped>
/* 简单的淡入动画 */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>