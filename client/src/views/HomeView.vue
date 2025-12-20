<template>
  <div class="min-h-screen bg-[#fafafa] dark:bg-[#050505] transition-colors duration-500 selection:bg-blue-500 selection:text-white font-sans overflow-x-hidden">
    <Navbar />
    
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] animate-blob"></div>
      <div class="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" :style="{ backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MDAlJyBoZWlnaHQ9JzQwMCUnPjxmaWx0ZXIgaWQ9J25vaXNlJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nMC45JyBudW1PY3RhdmVzPSczJyBzdGl0Y2hUaWxlcz0nc3RpdGNoJy8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsdGVyPSd1cmwoI25vaXNlKScgb3BhY2l0eT0nMC41Jy8+PC9zdmc+')` }"></div>
    </div>

    <main class="container mx-auto px-6 py-12 md:py-20 relative z-10 max-w-7xl">
      
      <section class="mb-24 flex flex-col items-start gap-8 animate-fade-in">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-mono tracking-wider uppercase">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          System Online
        </div>

        <h1 class="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">
          SHIPPING <br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            BACKEND & AI
          </span>
        </h1>
        
        <div class="max-w-2xl">
          <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            I'm <strong class="text-gray-900 dark:text-white font-semibold">Myshkin451</strong> —
            I build production-minded
            <span class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">FastAPI</span>
            services and AI-powered developer tools with
            <span class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">RAG</span>
            &amp;
            <span class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">Agents</span>.
            I care about latency, reliability, and clean architecture.
          </p>
        </div>

        <div class="flex flex-wrap gap-4 mt-4">
          <a href="#posts" class="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-lg hover:translate-y-[-2px] hover:shadow-lg transition-all flex items-center gap-2">
            Read the Blog
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          </a>

          <a href="https://github.com/Achernar-Eridani" target="_blank" rel="noopener noreferrer"
            class="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            View GitHub
          </a>

          <router-link v-if="isAdmin" to="/write" class="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors">
            + New Post
          </router-link>
        </div>


      <section class="mb-24 grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
        
        <div class="md:col-span-2 md:row-span-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent dark:from-[#151515] dark:to-transparent opacity-50"></div>
          <div class="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 class="text-lg font-bold mb-2">My Stack</h3>
              <p class="text-gray-500 text-sm">Core technologies driving my work.</p>
            </div>
            <div class="mt-4 bg-[#1e1e1e] rounded-lg p-4 font-mono text-xs text-gray-300 shadow-inner border border-gray-800 overflow-hidden">
              <div class="flex gap-1.5 mb-3 opacity-50">
                <div class="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              <p><span class="text-purple-400">const</span> <span class="text-blue-400">skills</span> = {</p>
              <p class="pl-4">backend: [<span class="text-green-400">'Python'</span>, <span class="text-green-400">'FastAPI'</span>, <span class="text-green-400">'Docker'</span>],</p>
              <p class="pl-4">ai: [<span class="text-green-400">'LangChain'</span>, <span class="text-green-400">'OpenAI'</span>, <span class="text-green-400">'RAG'</span>],</p>
              <p class="pl-4">frontend: [<span class="text-green-400">'Vue3'</span>, <span class="text-green-400">'Tailwind'</span>]</p>
              <p>};</p>
            </div>
          </div>
        </div>

        <div class="md:col-span-1 md:row-span-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex flex-col hover:border-purple-500/30 transition-all duration-300">
          <h3 class="text-lg font-bold mb-4">Topics</h3>
          <div class="flex flex-col gap-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <router-link 
              v-for="cat in categories" 
              :key="cat.id" 
              :to="`/categories/${cat.slug || cat.id}`"
              class="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors"># {{ cat.name }}</span>
              <svg class="w-3 h-3 text-gray-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </router-link>
          </div>
        </div>

        <div class="bg-blue-600 dark:bg-blue-600 text-white rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group cursor-default">
           <svg class="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
           <p class="text-sm font-medium opacity-80">Total Articles</p>
           <p class="text-5xl font-black">{{ posts.length }}</p>
        </div>

        <a href="https://github.com/Achernar-Eridani" target="_blank" class="bg-gray-900 dark:bg-gray-800 text-white rounded-3xl p-6 flex flex-col justify-center items-center gap-3 hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors group">
          <svg class="w-10 h-10 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <span class="text-sm font-bold">Follow @GitHub</span>
        </a>

      </section>

      <section id="posts" class="scroll-mt-24">
        <div class="flex items-end justify-between mb-10 border-b border-gray-200 dark:border-gray-800 pb-4">
           <div>
             <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Latest Insights</h2>
             <p class="text-gray-500 text-sm">Thoughts on coding, architecture, and life.</p>
           </div>
           
           <div class="hidden md:flex items-center gap-4 text-sm font-mono text-gray-500">
             <span>{{ posts.length }} Articles</span>
             <span class="w-px h-4 bg-gray-300 dark:bg-gray-700"></span>
             <span>Page {{ currentPage }} of {{ totalPages }}</span>
           </div>
        </div>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="n in 6" :key="n" class="h-[300px] bg-gray-100 dark:bg-[#111] rounded-2xl animate-pulse"></div>
        </div>

        <div v-else-if="posts.length === 0" class="py-24 text-center">
           <div class="inline-block p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
             <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
           </div>
           <p class="text-xl text-gray-500 font-medium">No signals found in the void.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCardV2 
            v-for="(post, index) in posts" 
            :key="post.id" 
            :article="post" 
            class="animate-fade-in-up"
            :style="{ animationDelay: `${index * 100}ms` }"
          />
        </div>

        <div class="mt-20 flex justify-center">
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
import ArticleCardV2 from '../components/ArticleCardV2.vue'; 
import Pagination from '../components/Pagination.vue';
import Footer from '../components/Footer.vue';
import api from '../api';

const posts = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const totalPages = ref(1);
const categories = ref([]);
const isAdmin = ref(false);

const checkAdminStatus = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      isAdmin.value = userData.isAdmin === true || userData.role === 'admin';
    } catch (e) {
      console.error('Failed to parse user data', e);
    }
  }
};

const fetchPosts = async (page = 1) => {
  try {
    loading.value = true;
    // 增加一点 limit 让瀑布流更好看
    const response = await api.getPosts({ page, limit: 9 });
    
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
    console.error('Failed to fetch posts:', error);
    posts.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    categories.value = await api.getCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

const handlePageChange = (page) => {
  fetchPosts(page);
  // 平滑滚动到文章列表顶部
  const postsSection = document.getElementById('posts');
  if (postsSection) {
    postsSection.scrollIntoView({ behavior: 'smooth' });
  }
};

onMounted(() => {
  fetchPosts();
  fetchCategories();
  checkAdminStatus();
});
</script>

<style scoped>
/* 自定义动画关键帧 */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-fade-in-up {
  opacity: 0; /* 初始隐藏，防止闪烁 */
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

/* 滚动条美化 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 20px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
}
</style>