<template>
  <div>
    <!-- 导航栏 -->
    <Navbar />
    
    <!-- 内容区域 -->
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row">
        <!-- 左侧主内容区 -->
        <div class="w-full md:w-2/3 md:pr-6">
          <!-- 页面标题 -->
          <h1 class="text-3xl font-bold text-gray-800 mb-6">最新文章</h1>
          
          <!-- 加载状态 -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          
          <!-- 没有文章时显示 -->
          <div v-else-if="posts.length === 0" class="bg-gray-50 rounded-lg p-8 text-center">
            <p class="text-gray-600">暂无文章发布</p>
          </div>
          
          <!-- 文章列表 -->
          <div v-else class="space-y-6">
            <ArticleCard 
              v-for="post in posts" 
              :key="post.id" 
              :article="post" 
            />
          </div>
          
          <!-- 分页 -->
          <Pagination 
            v-if="posts.length > 0" 
            :current-page="currentPage" 
            :total-pages="totalPages" 
            @page-change="handlePageChange" 
          />
        </div>
        
        <!-- 右侧侧边栏 -->
        <div class="w-full md:w-1/3 mt-8 md:mt-0">
          <!-- 分类卡片 -->
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
                class="block px-3 py-2 rounded hover:bg-gray-100 text-gray-700">
                {{ category.name }}
                <span class="text-gray-500 text-sm ml-1">({{ category.postCount || 0 }})</span>
              </router-link>
            </div>
          </div>
          
          <!-- 标签云（预留） -->
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
                class="inline-block px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm mr-2 mb-2 hover:bg-gray-200">
                {{ tag.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import ArticleCard from '../components/ArticleCard.vue';
import Pagination from '../components/Pagination.vue';
import Footer from '../components/Footer.vue';
import api from '../api';

// 状态
const posts = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const totalPages = ref(1);
const categories = ref([]);
const tags = ref([]);
const loadingCategories = ref(true);
const loadingTags = ref(true);

// 在 HomeView.vue 的 <script setup> 部分中修改 fetchPosts 函数

// 获取文章列表
const fetchPosts = async (page = 1) => {
  try {
    loading.value = true;
    const response = await api.getPosts({
      page,
      limit: 10
    });
    
    console.log('文章API响应:', response);
    
    // 适应不同的API响应格式
    if (Array.isArray(response)) {
      // 如果直接返回数组
      posts.value = response;
      currentPage.value = 1;
      totalPages.value = 1;
    } else if (response.posts) {
      // 如果返回带有posts字段的对象
      posts.value = response.posts;
      currentPage.value = response.pagination?.currentPage || 1;
      totalPages.value = response.pagination?.totalPages || 1;
    } else if (response.data) {
      // 如果返回的是 { data: [...] } 格式
      posts.value = response.data;
      currentPage.value = 1;
      totalPages.value = 1;
    } else {
      // 其他可能的格式
      posts.value = response || [];
      currentPage.value = 1;
      totalPages.value = 1;
    }
    
    console.log('处理后的文章数据:', posts.value);
    
    if (posts.value.length === 0) {
      console.warn('文章列表为空，可能是API返回格式不符合预期或没有文章');
    }
  } catch (error) {
    console.error('获取文章失败:', error);
    posts.value = [];
  } finally {
    loading.value = false;
  }
};
// 获取分类列表
const fetchCategories = async () => {
  try {
    loadingCategories.value = true;
    categories.value = await api.getCategories();
    console.log('获取到的分类数据:', categories.value);
  } catch (error) {
    console.error('获取分类失败:', error);
    categories.value = [];
  } finally {
    loadingCategories.value = false;
  }
};

// 获取标签列表
const fetchTags = async () => {
  try {
    loadingTags.value = true;
    tags.value = await api.getTags();
    console.log('获取到的标签数据:', tags.value);
  } catch (error) {
    console.error('获取标签失败:', error);
    tags.value = [];
  } finally {
    loadingTags.value = false;
  }
};

// 分页处理
const handlePageChange = (page) => {
  fetchPosts(page);
  // 回到顶部
  window.scrollTo(0, 0);
};

// 组件挂载时获取数据
onMounted(() => {
  fetchPosts();
  fetchCategories();
  fetchTags();
});
</script>