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
  import MarkdownEditor from '../components/editor/MarkdownEditor.vue';
  import MetadataEditor from '../components/editor/MetadataEditor.vue';
  import CategoryTagSelector from '../components/editor/CategoryTagSelector.vue';
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
    // 保存逻辑...
  };
  
  // 获取数据和初始化
  onMounted(async () => {
    // 初始化逻辑...
  });
  </script>