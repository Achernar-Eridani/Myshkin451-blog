<template>
  <div
    class="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50
           selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950"
  >
    <Navbar />

    <!-- Background: subtle grid + soft vignette (no blobs, no neon) -->
    <div class="pointer-events-none fixed inset-0 z-0">
      <div
        class="absolute inset-0 opacity-[0.65] dark:opacity-[0.35]
               [background-image:linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)]
               [background-size:56px_56px]"
      ></div>
      <div
        class="absolute inset-0 opacity-100
               [background-image:radial-gradient(closest-side_at_50%_0%,rgba(0,0,0,0.08),transparent_55%)]
               dark:[background-image:radial-gradient(closest-side_at_50%_0%,rgba(255,255,255,0.08),transparent_55%)]"
      ></div>
    </div>

    <main class="relative z-10 mx-auto max-w-6xl px-6 py-12 md:py-16">
      <!-- Hero -->
      <header class="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
        <div class="md:col-span-8">
          <p class="text-xs uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            Myshkin451 · Blog
          </p>

          <h1 class="mt-4 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            写后端，也写关于
            <span class="relative inline-block">
              AI 应用工程
              <span
                class="absolute -bottom-1 left-0 h-[2px] w-full bg-zinc-900/10 dark:bg-white/10"
              ></span>
            </span>
            的笔记。
          </h1>

          <p class="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
            FastAPI / Docker / Redis / 向量检索 / RAG。偏工程化：延迟、可靠性、评估、可维护性。
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <a
              href="#posts"
              class="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white
                     shadow-sm transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              阅读文章
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14"></path>
                <path d="m19 12-7 7-7-7"></path>
              </svg>
            </a>

            <a
              href="https://github.com/Achernar-Eridani"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-5 py-2.5 text-sm font-medium text-zinc-900
                     transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-900/60"
            >
              GitHub
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>

            <router-link
              v-if="isAdmin"
              to="/write"
              class="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-5 py-2.5 text-sm font-medium text-zinc-900
                     transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-900/60"
            >
              新建文章
              <span class="text-zinc-400">+</span>
            </router-link>
          </div>
        </div>

        <!-- Side note -->
        <div class="md:col-span-4">
          <div
            class="rounded-2xl border border-zinc-200/70 bg-white/60 p-5 shadow-sm backdrop-blur
                   dark:border-zinc-800/70 dark:bg-zinc-900/30"
          >
            <p class="text-xs uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Now</p>
            <p class="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
              正在打磨一些更“能用”的工程细节：索引构建、缓存、评估指标、以及更稳定的 API 形态。
            </p>

            <div class="mt-4 flex flex-wrap gap-2">
              <span class="chip">FastAPI</span>
              <span class="chip">Redis</span>
              <span class="chip">RAG</span>
              <span class="chip">Docker</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Middle grid -->
      <section class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
        <!-- Toolbox -->
        <div
          class="md:col-span-7 rounded-2xl border border-zinc-200/70 bg-white/60 p-6 shadow-sm backdrop-blur
                 dark:border-zinc-800/70 dark:bg-zinc-900/30"
        >
          <div class="flex items-end justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold tracking-tight">Toolbox</h2>
              <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">我常用的一套工程组合（不装饰成“代码块”）。</p>
            </div>
          </div>

          <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <p class="text-xs uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Backend</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span class="chip">Python</span>
                <span class="chip">FastAPI</span>
                <span class="chip">MySQL</span>
                <span class="chip">Redis</span>
                <span class="chip">Docker</span>
              </div>
            </div>

            <div>
              <p class="text-xs uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">AI Apps</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span class="chip">RAG</span>
                <span class="chip">Embeddings</span>
                <span class="chip">Hybrid Search</span>
                <span class="chip">Eval</span>
              </div>
            </div>

            <div>
              <p class="text-xs uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Frontend</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span class="chip">Vue 3</span>
                <span class="chip">Tailwind</span>
                <span class="chip">Vite</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Topics -->
        <div
          class="md:col-span-5 rounded-2xl border border-zinc-200/70 bg-white/60 p-6 shadow-sm backdrop-blur
                 dark:border-zinc-800/70 dark:bg-zinc-900/30"
        >
          <h2 class="text-lg font-semibold tracking-tight">Topics</h2>
          <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">按分类快速浏览。</p>

          <div class="mt-4 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            <div class="grid grid-cols-2 gap-2">
              <router-link
                v-for="cat in categories"
                :key="cat.id"
                :to="`/categories/${cat.slug || cat.id}`"
                class="group rounded-lg border border-zinc-200/60 bg-white/60 px-3 py-2 text-sm text-zinc-700
                       transition hover:bg-white hover:border-zinc-300 dark:border-zinc-800/60 dark:bg-zinc-950/30 dark:text-zinc-200 dark:hover:bg-zinc-900/60"
              >
                <span class="truncate"># {{ cat.name }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Posts -->
      <section id="posts" class="mt-16 scroll-mt-24">
        <div class="flex items-end justify-between gap-6">
          <div>
            <h2 class="text-2xl md:text-3xl font-semibold tracking-tight">Latest Writing</h2>
            <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              记录我在后端与 AI 应用工程里的思考与实现。
            </p>
          </div>
        </div>

        <div v-if="loading" class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="n in 6"
            :key="n"
            class="h-[320px] rounded-2xl border border-zinc-200/60 bg-white/60 animate-pulse
                   dark:border-zinc-800/60 dark:bg-zinc-900/30"
          ></div>
        </div>

        <div v-else-if="posts.length === 0" class="mt-10 rounded-2xl border border-zinc-200/70 bg-white/60 p-10 text-center shadow-sm backdrop-blur
                                               dark:border-zinc-800/70 dark:bg-zinc-900/30">
          <p class="text-zinc-600 dark:text-zinc-300">暂时还没有文章。</p>
        </div>

        <div v-else class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleCardV2 v-for="post in posts" :key="post.id" :article="post" />
        </div>

        <div class="mt-14 flex justify-center">
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
  const postsSection = document.getElementById('posts');
  if (postsSection) postsSection.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
  fetchPosts();
  fetchCategories();
  checkAdminStatus();
});
</script>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid rgba(228, 228, 231, 0.9);
  background: rgba(255, 255, 255, 0.65);
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  color: rgb(39 39 42);
}
:global(.dark) .chip {
  border-color: rgba(63, 63, 70, 0.9);
  background: rgba(9, 9, 11, 0.4);
  color: rgb(228 228 231);
}

/* scrollbar (kept, but subtle) */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(161, 161, 170, 0.35);
  border-radius: 999px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: rgba(161, 161, 170, 0.55);
}
</style>
