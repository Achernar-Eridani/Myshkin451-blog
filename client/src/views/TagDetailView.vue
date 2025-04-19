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
          <router-link to="/tags" class="text-blue-600 hover:underline">
            查看所有标签
          </router-link>
        </div>
        
        <!-- 标签内容 -->
        <div v-else-if="tag" class="flex flex-col md:flex-row">
          <!-- 左侧主内容区 -->
          <div class="w-full md:w-2/3 md:pr-6">
            <div class="mb-8">
              <h1 class="text-3xl font-bold text-gray-800 mb-2"># {{ tag.name }}</h1>
              <p class="text-sm text-gray-500">该标签下共有 {{ tag.posts?.length || 0 }} 篇文章</p>
            </div>
            
            <!-- 文章列表 -->
            <div v-if="tag.posts && tag.posts.length > 0" class="space-y-6">
              <ArticleCard 
                v-for="post in tag.posts" 
                :key="post.id" 
                :article="post" 
              />
            </div>
            
            <!-- 无文章提示 -->
            <div v-else class="bg-gray-50 rounded-lg p-8 text-center">
              <p class="text-gray-600">该标签下暂无文章</p>
            </div>
          </div>
          
          <!-- 右侧侧边栏 -->
          <div class="w-full md:w-1/3 mt-8 md:mt-0">
            <!-- 分类列表 -->
            <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <h2 class="text-xl font-bold text-gray-800 mb-4">分类</h2>
              <div v-if="loadingCategories" class="text-center py-4">
                <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              </div>
              <div v-else-if="categories.length === 0" class="text-gray-500 text-center py-2">
                暂无分类
              </div>
              <div v-else class="space-y-2">
                <router-link 
                  v-for="category in categories" 
                  :key="category.id" 
                  :to="`/categories/${category.slug}`"
                  class="block px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
                >
                  {{ category.name }}
                  <span class="text-gray-500 text-sm ml-1">({{ category.postCount || 0 }})</span>
                </router-link>
              </div>
            </div>
            
            <!-- 标签云 -->
            <div class="bg-white rounded-lg shadow-sm border p-4">
              <h2 class="text-xl font-bold text-gray-800 mb-4">所有标签</h2>
              <div v-if="loadingTags" class="text-center py-4">
                <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              </div>
              <div v-else-if="tags.length === 0" class="text-gray-500 text-center py-2">
                暂无标签
              </div>
              <div v-else class="flex flex-wrap">
                <router-link 
                  v-for="t in tags" 
                  :key="t.id" 
                  :to="`/tags/${t.slug}`"
                  class="inline-block px-3 py-1 rounded text-sm mr-2 mb-2 hover:bg-gray-200"
                  :class="t.id === tag.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
                >
                  {{ t.name }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 标签不存在 -->
        <div v-else class="bg-gray-50 rounded-lg p-8 text-center">
          <p class="text-gray-600 mb-4">标签不存在或已被删除</p>
          <router-link to="/tags" class="text-blue-600 hover:underline">
            查看所有标签
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
  const tag = ref(null);
  const categories = ref([]);
  const tags = ref([]);
  const loadingCategories = ref(true);
  const loadingTags = ref(true);
  
  // 获取标签详情
  const fetchTagDetails = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      const slug = route.params.slug;
      tag.value = await api.getTagBySlug(slug);
      
    } catch (err) {
      console.error('获取标签详情失败:', err);
      error.value = '获取标签详情失败，请稍后重试';
      tag.value = null;
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
      fetchTagDetails();
    }
  });
  
  // 页面加载时获取数据
  onMounted(() => {
    fetchTagDetails();
    fetchCategories();
    fetchTags();
  });
  </script>