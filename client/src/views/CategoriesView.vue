<template>
    <div>
      <Navbar />
  
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">所有分类</h1>
  
        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
  
        <!-- 无分类时提示 -->
        <div v-else-if="categories.length === 0" class="bg-gray-50 rounded-lg p-8 text-center">
          <p class="text-gray-600">暂无分类</p>
        </div>
  
        <!-- 分类列表 -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <template v-for="category in categories" :key="category.id">
            <!-- 有 slug 可点击 -->
            <router-link
              v-if="category.slug"
              :to="`/categories/${encodeURIComponent(category.slug)}`"
              class="bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition duration-300"
            >
              <div class="p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">{{ category.name }}</h2>
                <p v-if="category.description" class="text-gray-600 mb-4 line-clamp-2">
                  {{ category.description }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ category.postCount || 0 }} 篇文章
                </p>
              </div>
            </router-link>
  
            <!-- 无 slug 仅展示 -->
            <div
              v-else
              class="bg-gray-100 rounded-lg shadow-sm overflow-hidden border p-6 text-gray-400"
            >
              <h2 class="text-xl font-bold mb-2">{{ category.name }}</h2>
              <p class="text-sm">未设置 slug，暂不可访问</p>
            </div>
          </template>
        </div>
      </div>
  
      <Footer />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Navbar from '../components/Navbar.vue';
  import Footer from '../components/Footer.vue';
  import api from '../api';
  
  // 状态
  const categories = ref([]);
  const loading = ref(true);
  
  const fetchCategories = async () => {
    try {
      loading.value = true;
      categories.value = await api.getCategories() || [];
    } catch (e) {
      console.error('获取分类失败:', e);
      categories.value = [];
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(fetchCategories);
  </script>
  