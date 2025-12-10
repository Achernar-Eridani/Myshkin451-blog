<template>
  <nav class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md transition-colors duration-300">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      
      <router-link to="/" class="flex items-center space-x-2 group">
        <div class="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-mono font-bold text-lg group-hover:rotate-12 transition-transform">
          M
        </div>
        <span class="text-xl font-bold tracking-tight text-gray-900 dark:text-white font-mono">
          Myshkin<span class="text-blue-600">451</span>
        </span>
      </router-link>

      <div class="hidden md:flex items-center space-x-8">
        <div class="flex space-x-6 text-sm font-medium">
          <router-link to="/" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</router-link>
          <router-link to="/categories" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Topics</router-link>
          <router-link to="/guestbook" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Guestbook</router-link>
        </div>

        <div class="w-48">
          <SearchBar /> 
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <button 
          @click="toggleTheme" 
          class="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
          title="Toggle Dark Mode"
        >
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <div v-if="isLoggedIn" class="relative group">
          <button class="flex items-center space-x-2 focus:outline-none">
             <img :src="userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userName" class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100" alt="Avatar">
          </button>
          
          <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
            <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
              <p class="text-sm font-bold text-gray-900 dark:text-white">{{ userName }}</p>
              <p class="text-xs text-gray-500 truncate">Logged in</p>
            </div>
            
            <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Profile</router-link>
            
            <template v-if="isAdmin">
               <router-link to="/write" class="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800">New Story</router-link>
               <router-link to="/admin" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Dashboard</router-link>
            </template>
            
            <div class="border-t border-gray-100 dark:border-gray-800 my-1"></div>
            <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800">Sign out</button>
          </div>
        </div>

        <router-link v-else to="/login" class="text-sm font-bold text-gray-900 dark:text-white hover:underline">
          Login
        </router-link>
      </div>

      <button @click="toggleMobileMenu" class="md:hidden p-2 text-gray-600 dark:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
    
    <div v-if="showMobileMenu" class="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111] p-4">
       </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'; // 引入 onUnmounted
import { useRouter } from 'vue-router';
import SearchBar from './SearchBar.vue';

const router = useRouter();

// --- 状态定义 ---
const showMobileMenu = ref(false);
const showProfileMenu = ref(false); // 个人菜单下拉状态
const profileMenuRef = ref(null);   // 个人菜单 DOM 引用 (用于检测点击外部)
const isDark = ref(false);          // 深色模式状态

// 用户状态
const isLoggedIn = ref(false);
const userName = ref('用户');
const userAvatar = ref(null);
const isAdmin = ref(false);

// --- 核心功能：深色模式 ---
const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

// --- 核心功能：用户状态管理 ---
const checkUserStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
  
  if (isLoggedIn.value) {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        userName.value = userData.username || '用户';
        userAvatar.value = userData.avatar || null;
        
        // 检查用户角色
        isAdmin.value = userData.isAdmin === true || userData.role === 'admin';
      }
    } catch (error) {
      console.error('解析用户数据失败:', error);
      // 解析失败时重置用户状态
      userName.value = '用户';
      userAvatar.value = null;
      isAdmin.value = false;
    }
  } else {
    // 未登录时重置
    userName.value = '用户';
    userAvatar.value = null;
    isAdmin.value = false;
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // 重置状态
  isLoggedIn.value = false;
  userName.value = '用户';
  userAvatar.value = null;
  isAdmin.value = false;
  showProfileMenu.value = false; // 退出时关闭菜单
  
  // 重定向到首页
  router.push('/');
};

// --- 交互功能 ---
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

// 点击外部关闭个人菜单 (UX 优化)
const handleClickOutside = (event) => {
  if (profileMenuRef.value && !profileMenuRef.value.contains(event.target)) {
    showProfileMenu.value = false;
  }
};

// --- 生命周期与监听 ---

// 监听 localStorage 变化 (实现多标签页状态同步)
const handleStorageChange = (event) => {
  if (event.key === 'token' || event.key === 'user') {
    checkUserStatus();
  }
};

onMounted(() => {
  // 1. 初始化深色模式
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  }

  // 2. 初始化用户状态
  checkUserStatus();

  // 3. 添加事件监听
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('storage', handleStorageChange);
});

onUnmounted(() => {
  // 移除事件监听，防止内存泄漏
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('storage', handleStorageChange);
});
</script>