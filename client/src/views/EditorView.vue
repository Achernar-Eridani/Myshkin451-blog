<template>
    <div>
      <Navbar />
      
      <div class="container mx-auto px-4 py-6">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <!-- 文章元数据 -->
          <MetadataEditor 
            v-model:title="article.title"
            v-model:excerpt="article.excerpt"
          />
          
          <!-- Markdown编辑器 -->
          <div class="mb-6">
            <MarkdownEditor 
              v-model="article.content"
              label="文章内容"
            />
          </div>
          
          <!-- 分类和标签 -->
          <div class="mb-6">
            <CategoryTagSelector
              :categories="categories"
              :tags="tags"
              v-model:categoryId="article.categoryId"
              v-model:selectedTagIds="article.tagIds"
            />
          </div>
          
          <!-- 文章状态和操作按钮 -->
          <div class="flex items-center justify-between">
            <div>
              <label class="inline-flex items-center">
                <input 
                  type="checkbox" 
                  v-model="article.published" 
                  class="form-checkbox h-5 w-5 text-blue-600"
                >
                <span class="ml-2 text-gray-700">发布文章</span>
              </label>
            </div>
            
            <div class="flex space-x-2">
              <button 
                @click="saveArticle" 
                :disabled="loading || !article.title"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                {{ loading ? '保存中...' : '保存文章' }}
              </button>
            </div>
          </div>
          
          <!-- 错误提示 -->
          <div v-if="error" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import Navbar from '../components/Navbar.vue';
  import Footer from '../components/Footer.vue';
  import MarkdownEditor from '../components/MarkdownEditor.vue';
  import MetadataEditor from '../components/MetadataEditor.vue';
  import CategoryTagSelector from '../components/CategoryTagSelector.vue';
  import api from '../api';
  
  // 路由相关
  const router = useRouter();
  const route = useRoute();
  
  // 状态变量
  const loading = ref(false);
  const error = ref('');
  const categories = ref([]);
  const tags = ref([]);
  
  // 文章数据
  const article = reactive({
    id: null,
    title: '',
    content: '',
    excerpt: '',
    categoryId: '',
    tagIds: [],
    published: false
  });
  
  // 保存文章
  const saveArticle = async () => {
    if (!article.title.trim()) {
      error.value = '文章标题不能为空';
      return;
    }
    
    loading.value = true;
    error.value = '';
    
    try {
      let response;
      
      if (article.id) {
        // 更新现有文章
        response = await api.updatePost(article.id, {
          title: article.title,
          content: article.content,
          excerpt: article.excerpt || null,
          categoryId: article.categoryId || null,
          tagIds: article.tagIds,
          status: article.published ? 'published' : 'draft'
        });
      } else {
        // 创建新文章
        response = await api.createPost({
          title: article.title,
          content: article.content,
          excerpt: article.excerpt || null,
          categoryId: article.categoryId || null,
          tagIds: article.tagIds,
          status: article.published ? 'published' : 'draft'
        });
      }
      
      console.log('文章保存成功:', response);
      
      // 保存成功，跳转到文章详情页
      router.push(`/posts/${response.id}`);
    } catch (err) {
      console.error('保存文章失败:', err);
      error.value = err.response?.data?.message || '保存文章失败，请重试';
    } finally {
      loading.value = false;
    }
  };
  
  // 获取分类列表
  const fetchCategories = async () => {
    try {
      categories.value = await api.getCategories();
      console.log('获取到的分类数据:', categories.value);
    } catch (err) {
      console.error('获取分类失败:', err);
      error.value = '获取分类失败';
    }
  };
  
  // 获取标签列表
  const fetchTags = async () => {
    try {
      tags.value = await api.getTags();
      console.log('获取到的标签数据:', tags.value);
    } catch (err) {
      console.error('获取标签失败:', err);
      error.value = '获取标签失败';
    }
  };
  
  // 加载现有文章（编辑模式）
  const fetchArticle = async (id) => {
    try {
      const post = await api.getPostById(id);
      
      article.id = post.id;
      article.title = post.title;
      article.content = post.content;
      article.excerpt = post.excerpt || '';
      article.categoryId = post.categoryId || '';
      article.published = post.status === 'published';
      
      // 处理标签
      if (post.tags && Array.isArray(post.tags)) {
        article.tagIds = post.tags.map(tag => tag.id);
      }
    } catch (err) {
      console.error('获取文章失败:', err);
      error.value = '获取文章失败，请重试';
    }
  };
  
  // 组件挂载时加载数据
  onMounted(async () => {
    // 检查用户权限
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAdmin = user?.isAdmin || user?.role === 'admin';
    
    if (!isAdmin) {
      // 非管理员跳转到首页
      router.push('/');
      return;
    }
    
    // 获取分类和标签
    await Promise.all([fetchCategories(), fetchTags()]);
    
    // 如果是编辑模式，加载文章
    const articleId = route.params.id;
    if (articleId) {
      await fetchArticle(articleId);
    }
  });
  </script>