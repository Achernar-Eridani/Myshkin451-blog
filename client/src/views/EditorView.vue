<template>
  <div>
    <Navbar />
    
    <div class="container mx-auto px-4 py-6">
      <div class="bg-white dark:bg-dark-surface rounded-lg shadow-sm border dark:border-dark-border p-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-dark-text mb-6">写文章</h1>
        
        <!-- 文章标题 -->
        <div class="mb-6">
          <label for="title" class="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2">文章标题</label>
          <input 
            id="title" 
            v-model="article.title" 
            type="text" 
            class="w-full px-3 py-2 border dark:border-dark-border bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-dark-accent" 
            placeholder="请输入文章标题"
          >
        </div>
        
        <!-- 文章摘要 -->
        <div class="mb-6">
          <label for="excerpt" class="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2">文章摘要</label>
          <textarea 
            id="excerpt" 
            v-model="article.excerpt" 
            rows="2" 
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="请输入文章摘要（可选）"
          ></textarea>
        </div>
        
        <!-- Markdown编辑器 -->
        <div class="mb-6">
          <label class="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2">文章内容</label>
          <MarkdownEditor v-model="article.content" />
        </div>
        
        <!-- 分类和标签 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- 分类选择 -->
          <div>
            <label class="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2">文章分类</label>
            <select 
              v-model="article.categoryId" 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">请选择分类</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <!-- 标签选择 -->
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">文章标签</label>
            <div class="flex flex-wrap border rounded-lg p-2 min-h-10">
              <span 
                v-for="tagId in article.tagIds" 
                :key="tagId" 
                class="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 mb-2 flex items-center"
              >
                <span>{{ findTagName(tagId) }}</span>
                <button @click="removeTag(tagId)" class="ml-1 text-blue-600 hover:text-blue-800">
                  &times;
                </button>
              </span>
              
              <select 
                @change="addTag" 
                v-model="selectedTag" 
                class="py-1 px-2 border-none focus:outline-none flex-grow min-w-[100px]"
              >
                <option value="">添加标签...</option>
                <option 
                  v-for="tag in availableTags" 
                  :key="tag.id" 
                  :value="tag.id"
                >
                  {{ tag.name }}
                </option>
              </select>
            </div>
          </div>
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import MarkdownEditor from '../components/MarkdownEditor.vue';
import api from '../api';

// 路由相关
const router = useRouter();
const route = useRoute();

// 状态变量
const loading = ref(false);
const error = ref('');
const categories = ref([]);
const tags = ref([]);
const selectedTag = ref('');

// 文章数据 - 移除coverImage字段
const article = reactive({
  id: null,
  title: '',
  content: '',
  excerpt: '',
  categoryId: '',
  tagIds: [],
  published: false
});

// 计算属性：可用标签（排除已选）
const availableTags = computed(() => {
  return tags.value.filter(tag => !article.tagIds.includes(tag.id));
});

// 找到标签名称
const findTagName = (tagId) => {
  const tag = tags.value.find(t => t.id === tagId);
  return tag ? tag.name : '未知标签';
};

// 添加标签
const addTag = () => {
  if (selectedTag.value && !article.tagIds.includes(selectedTag.value)) {
    article.tagIds.push(selectedTag.value);
    selectedTag.value = '';
  }
};

// 移除标签
const removeTag = (tagId) => {
  article.tagIds = article.tagIds.filter(id => id !== tagId);
};

// 保存文章 - 移除coverImage相关代码
const saveArticle = async () => {
  if (!article.title.trim()) {
    error.value = '文章标题不能为空';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    let response;
    
    const postData = {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || null,
      categoryId: article.categoryId || null,
      tagIds: article.tagIds,
      status: article.published ? 'published' : 'draft'
    };
    
    if (article.id) {
      // 更新现有文章
      response = await api.updatePost(article.id, postData);
    } else {
      // 创建新文章
      response = await api.createPost(postData);
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

// 加载现有文章 - 移除coverImage相关代码
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
  
  // 添加管理员权限检查
  if (user && (user.id === 1 || user.id === 2)) {
    // 由于后端没有返回isAdmin字段，临时根据ID判断
    console.log('用户ID为管理员账户，允许访问');
  } else {
    console.warn('非管理员用户，重定向到首页');
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