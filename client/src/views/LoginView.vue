<template>
  <div>
    <Navbar />
    
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-md mx-auto bg-white dark:bg-dark-surface rounded-lg shadow-md p-8">
        <h1 class="text-2xl font-bold text-center text-gray-800 dark:text-dark-text mb-6">登录</h1>
        
        <!-- 错误提示 -->
        <div v-if="error" class="mb-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {{ error }}
        </div>
        
        <!-- 登录表单 -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-gray-700 dark:text-dark-text mb-1">邮箱</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-dark-accent"
              placeholder="请输入邮箱地址"
            >
          </div>
          
          <div>
            <label for="password" class="block text-gray-700 dark:text-dark-text mb-1">密码</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-dark-accent"
              placeholder="请输入密码"
            >
          </div>
          
          <div>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full bg-blue-600 dark:bg-dark-accent hover:bg-blue-700 dark:hover:bg-blue-500 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-dark-accent disabled:bg-blue-300 dark:disabled:bg-dark-accent/50"
            >
              {{ isSubmitting ? '登录中...' : '登录' }}
            </button>
          </div>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-gray-600">
            还没有账号？
            <router-link to="/register" class="text-blue-600 hover:underline">
              立即注册
            </router-link>
          </p>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import api from '../api';

// 表单数据
const email = ref('');
const password = ref('');
const error = ref('');
const isSubmitting = ref(false);

// 路由
const router = useRouter();
const route = useRoute();

// 处理登录
const handleLogin = async () => {
  error.value = '';
  isSubmitting.value = true;
  
  try {
    await api.login({
      email: email.value,
      password: password.value
    });
    
    // 登录成功，重定向到上一页或首页
    const redirectPath = route.query.redirect || '/';
    router.push(redirectPath);
  } catch (err) {
    console.error('Login error:', err);
    error.value = err.response?.data?.message || '登录失败，请检查邮箱和密码';
  } finally {
    isSubmitting.value = false;
  }
};

// 检查是否已登录
onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    // 已登录用户重定向到首页
    router.push('/');
  }
});
</script>