<template>
    <div>
      <Navbar />
      
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">所有标签</h1>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <!-- 无标签时提示 -->
        <div v-else-if="tags.length === 0" class="bg-gray-50 rounded-lg p-8 text-center">
          <p class="text-gray-600">暂无标签</p>
        </div>
        
        <!-- 标签云 -->
        <div v-else class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex flex-wrap gap-3">
            <router-link
              v-for="tag in tags"
              :key="tag.id"
              :to="`/tags/${tag.slug}`"
              class="inline-block px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition duration-300 text-base"
              :style="getTagStyle(tag)"
            >
              # {{ tag.name }}
              <span class="text-gray-500 text-sm ml-1">({{ tag.postCount || 0 }})</span>
            </router-link>
          </div>
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
  const tags = ref([]);
  const loading = ref(true);
  
  // 获取所有标签
  const fetchTags = async () => {
    try {
      loading.value = true;
      
      const response = await api.getTags();
      tags.value = response || [];
      
      console.log('获取到的标签:', tags.value);
    } catch (error) {
      console.error('获取标签失败:', error);
      tags.value = [];
    } finally {
      loading.value = false;
    }
  };
  
  // 根据标签的使用频率计算标签样式
  const getTagStyle = (tag) => {
    // 假设每个标签有一个 postCount 属性
    const count = tag.postCount || 0;
    
    // 基础字体大小
    let fontSize = 1;
    
    // 根据文章数量调整字体大小
    if (count > 10) fontSize = 1.5;
    else if (count > 5) fontSize = 1.25;
    else if (count > 2) fontSize = 1.1;
    
    return {
      fontSize: `${fontSize}rem`,
      // 也可以根据文章数量设置不同的背景色
      backgroundColor: count > 5 ? '#e6f2ff' : undefined
    };
  };
  
  // 组件挂载时获取数据
  onMounted(() => {
    fetchTags();
  });
  </script>