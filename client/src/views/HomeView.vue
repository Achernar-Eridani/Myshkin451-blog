<template>
  <div>
    <!-- 导航栏 -->
    <Navbar />
    
    <!-- 内容区域 -->
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row">
        <!-- 左侧主内容区 -->
        <div class="w-full md:w-2/3 md:pr-6">
          <!-- 页面标题和写文章按钮 -->
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-800">最新文章</h1>
            
            <!-- 管理员显示写文章按钮 -->
            <router-link 
              v-if="isAdmin" 
              to="/write" 
              class="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              写文章
            </router-link>
          </div>
          
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
            <ArticleCardV2 
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
        <!-- 在右侧边栏中使用这些组件 -->
        <div class="w-full md:w-1/3 mt-8 md:mt-0">
          <!-- 分类列表 -->
          <div class="mb-6">
            <CategoryList
              :categories="categories"
              :loading="loadingCategories"
              title="文章分类"
            />
          </div>
          
          <!-- 标签云 -->
          <div>
            <TagCloud
              :tags="tags"
              :loading="loadingTags"
              title="标签云"
            />
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
// import ArticleCard from '../components/ArticleCard.vue';
import ArticleCardV2 from '../components/ArticleCardV2.vue'; // 引入新的
import Pagination from '../components/Pagination.vue';
import Footer from '../components/Footer.vue';
import CategoryList from '../components/CategoryList.vue';
import TagCloud from '../components/TagCloud.vue';
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
const isAdmin = ref(false); // 添加管理员状态检查

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
  checkAdminStatus(); // 检查管理员状态
});
</script>