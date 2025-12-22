<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
    <Navbar />
    
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div class="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px] dark:opacity-10"></div>
    </div>

    <main class="container mx-auto px-6 pt-24 pb-12 relative z-10 max-w-6xl">
      
      <section class="mb-24 flex flex-col items-start gap-6 animate-fade-in-up">
        <div class="flex items-center gap-3">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span class="font-mono text-xs font-medium tracking-widest text-gray-500 uppercase">System Operational</span>
        </div>

        <h1 class="text-6xl md:text-8xl font-serif font-medium tracking-tight leading-[0.9]">
          The Art of <br>
          <span class="italic text-gray-400 dark:text-gray-600">Backend</span> & Intelligence.
        </h1>
        
        <div class="max-w-xl mt-4 border-l border-gray-200 dark:border-gray-800 pl-6">
          <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            I'm <strong class="text-gray-900 dark:text-white font-medium">Myshkin451</strong>. 
            Crafting high-performance architecture with 
            <span class="font-mono text-sm border-b border-gray-300 dark:border-gray-700">FastAPI</span> 
            and cognitive agents.
          </p>
        </div>

        <div class="flex flex-wrap gap-6 mt-8">
           <a href="#posts" class="group flex items-center gap-2 text-sm font-bold border-b-2 border-black dark:border-white pb-0.5 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            READ JOURNAL
            <svg class="w-4 h-4 transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
           </a>
           <a href="https://github.com/Achernar-Eridani" target="_blank" class="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            GITHUB ↗
           </a>
        </div>
      </section>

      <section class="mb-32 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        <div class="md:col-span-7 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg p-8 relative overflow-hidden group">
          <div class="absolute top-4 right-4 font-mono text-xs text-gray-400">01 / STACK</div>
          <h3 class="text-2xl font-serif mb-6 z-10 relative">Core Technology</h3>
          <div class="grid grid-cols-3 gap-4 font-mono text-xs">
             <div class="space-y-2">
                <div class="text-gray-400 mb-2">// Backend</div>
                <div class="p-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black rounded">Python</div>
                <div class="p-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black rounded">FastAPI</div>
                <div class="p-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black rounded">Docker</div>
             </div>
             <div class="space-y-2">
                <div class="text-gray-400 mb-2">// AI & Data</div>
                <div class="p-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black rounded">LangChain</div>
                <div class="p-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black rounded">RAG</div>
                <div class="p-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black rounded">Postgres</div>
             </div>
             <div class="space-y-2">
                <div class="text-gray-400 mb-2">// Frontend</div>
                <div class="p-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black rounded">Vue 3</div>
                <div class="p-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black rounded">Tailwind</div>
             </div>
          </div>
        </div>

        <div class="md:col-span-5 flex flex-col bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-8">
          <div class="flex justify-between items-start mb-6">
             <h3 class="text-2xl font-serif">Topics</h3>
             <span class="font-mono text-xs text-gray-400">02 / CATS</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <router-link 
              v-for="cat in categories" 
              :key="cat.id" 
              :to="`/categories/${cat.slug || cat.id}`"
              class="px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-md text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              {{ cat.name }}
            </router-link>
          </div>
          <div class="mt-auto pt-6 text-right">
             <span class="text-4xl font-mono font-bold">{{ posts.length }}</span>
             <span class="text-xs text-gray-400 ml-2">ARTICLES WRITTEN</span>
          </div>
        </div>

      </section>

      <section id="posts" class="scroll-mt-24">
        <div class="flex items-baseline justify-between mb-12 border-b border-black dark:border-white pb-4">
           <h2 class="text-4xl font-serif italic">Latest Insights</h2>
           <div class="hidden md:block font-mono text-xs">
             PAGE {{ currentPage }} / {{ totalPages }}
           </div>
        </div>

        <div v-if="loading" class="space-y-12">
           <div v-for="n in 3" :key="n" class="h-48 bg-gray-50 dark:bg-[#111] animate-pulse rounded-lg"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          <ArticleCardV2 
            v-for="(post, index) in posts" 
            :key="post.id" 
            :article="post" 
            class="animate-fade-in-up"
            :style="{ animationDelay: `${index * 50}ms` }"
          />
        </div>

        <div class="mt-24">
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
// Script 逻辑保持不变，原样复制之前的逻辑
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

// ... (此处省略与之前完全相同的 fetch 逻辑，请直接复用之前的 script 内容)
const checkAdminStatus = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      isAdmin.value = userData.isAdmin === true || userData.role === 'admin';
    } catch (e) { console.error(e); }
  }
};
const fetchPosts = async (page = 1) => {
  try {
    loading.value = true;
    const response = await api.getPosts({ page, limit: 9 });
    if (Array.isArray(response)) posts.value = response;
    else if (response.posts) {
      posts.value = response.posts;
      currentPage.value = response.pagination?.currentPage || 1;
      totalPages.value = response.pagination?.totalPages || 1;
    } else posts.value = response.data || [];
  } catch (error) { posts.value = []; } finally { loading.value = false; }
};
const fetchCategories = async () => {
  try { categories.value = await api.getCategories(); } catch (error) {}
};
const handlePageChange = (page) => {
  fetchPosts(page);
  document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' });
};
onMounted(() => {
  fetchPosts();
  fetchCategories();
  checkAdminStatus();
});
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); } /* 减小位移距离，更优雅 */
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; /* 使用 ease-out expo 曲线 */
}
</style>