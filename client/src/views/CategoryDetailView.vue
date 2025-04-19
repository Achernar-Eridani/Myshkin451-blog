<template>
    <div>
      <Navbar />
      
      <div class="container mx-auto px-4 py-8">
        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <!-- 错误状态 -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p class="text-red-600 mb-4">{{ error }}</p>
          <router-link to="/categories" class="text-blue-600 hover:underline">
            查看所有分类
          </router-link>
        </div>
        
        <!-- 分类内容 -->
        <div v-else-if="category" class="flex flex-col md:flex-row">
          <!-- 左侧主内容区 -->
          <div class="w-full md:w-2/3 md:pr-6">
            <div class="mb-8">
              <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ category.name }}</h1>
              <p v-if="category.description" class="text-gray-600">{{ category.description }}</p>
              <p class="text-sm text-gray-500 mt-2">该分类下共有 {{ category.posts?.length || 0 }} 篇文章</p>
            </div>
            
            <!-- 文章列表 -->
            <div v-if="category.posts && category.posts.length > 0" class="space-y-6">
              <ArticleCard 
                v-for="post in category.posts" 
                :key="post.id" 
                :article="post" 
              />
            </div>
            
            <!-- 无文章提示 -->
            <div v-else class="bg-gray-50 rounded-lg p-8 text-center">
              <p class="text-gray-600">该分类下暂无文章</p>
            </div>
          </div>
          
          <!-- 右侧侧边栏 -->
          <div class="w-full md:w-1/3 mt-8 md:mt-0">
            <!-- 其他分类 -->
            <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <h2 class="text-xl font-bold text-gray-800 mb-4">所有分类</h2>
              <div v-if="loadingCategories" class="text-center py-4">
                <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              </div>
              <div v-else-if="categories.length === 0" class="text-gray-500 text-center py-2">
                暂无分类
              </div>
              <div v-else class="space-y-2">
                <router-link 
                  v-for="cat in categories" 
                  :key="cat.id" 
                  :to="`/categories/${cat.slug}`"
                  class="block px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
                  :class="{ 'bg-blue-100 text-blue-700': cat.id === category.id }"
                >
                  {{ cat.name }}
                  <span class="text-gray-500 text-sm ml-1">({{ cat.postCount || 0 }})</span>
                </router-link>
              </div>
            </div>
            
            <!-- 标签云 -->
            <div class="bg-white rounded-lg shadow-sm border p-4">
              <h2 class="text-xl font-bold text-gray-800 mb-4">标签云</h2>
              <div v-if="loadingTags" class="text-center py-4">
                <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              </div>
              <div v-else-if="tags.length === 0" class="text-gray-500 text-center py-2">
                暂无标签
              </div>
              <div v-else class="flex flex-wrap">
                <router-link 
                  v-for="tag in tags" 
                  :key="tag.id" 
                  :to="`/tags/${tag.slug}`"
                  class="inline-block px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm mr-2 mb-2 hover:bg-gray-200"
                >
                  {{ tag.name }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分类不存在 -->
        <div v-else class="bg-gray-50 rounded-lg p-8 text-center">
          <p class="text-gray-600 mb-4">分类不存在或已被删除</p>
          <router-link to="/categories" class="text-blue-600 hover:underline">
            查看所有分类
          </router-link>
        </div>
      </div>
      
      <Footer />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import Navbar from '../components/Navbar.vue';
  import Footer from '../components/Footer.vue';
  import ArticleCard from '../components/ArticleCard.vue';
  import api from '../api';
  
  const route = useRoute();
  
  // 状态
  const loading = ref(true);
  const error = ref(null);
  const category = ref(null);
  const categories = ref([]);
  const tags = ref([]);
  const loadingCategories = ref(true);
  const loadingTags = ref(true);
  
  // 获取分类详情
  const fetchCategoryDetails = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      const slug = route.params.slug;
      category.value = await api.getCategoryBySlug(slug);
      
    } catch (err) {
      console.error('获取分类详情失败:', err);
      error.value = '获取分类详情失败，请稍后重试';
      category.value = null;
    } finally {
      loading.value = false;
    }
  };
  
  // 获取所有分类
  const fetchCategories = async () => {
    try {
      loadingCategories.value = true;
      
      const response = await api.getCategories();
      categories.value = response || [];
      
    } catch (err) {
      console.error('获取所有分类失败:', err);
      categories.value = [];
    } finally {
      loadingCategories.value = false;
    }
  };
  
  // 获取所有标签
  const fetchTags = async () => {
    try {
      loadingTags.value = true;
      
      const response = await api.getTags();
      tags.value = response || [];
      
    } catch (err) {
      console.error('获取所有标签失败:', err);
      tags.value = [];
    } finally {
      loadingTags.value = false;
    }
  };
  
  // 监听路由参数变化
  watch(() => route.params.slug, (newSlug) => {
    if (newSlug) {
      fetchCategoryDetails();
    }
  });
  
  // 页面加载时获取数据
  onMounted(() => {
    fetchCategoryDetails();
    fetchCategories();
    fetchTags();
  });
  </script>