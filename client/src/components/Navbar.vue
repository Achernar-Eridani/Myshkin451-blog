<template>
  <nav class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md transition-colors duration-300">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      
      <router-link to="/" class="flex items-center space-x-2 group">
        <div class="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-mono font-bold text-lg group-hover:rotate-12 transition-transform">
          M
        </div>
        <span class="text-xl font-bold tracking-tight text-gray-900 dark:text-white font-mono hidden sm:block">
          Myshkin<span class="text-blue-600">451</span>
        </span>
      </router-link>

      <div class="hidden md:flex items-center space-x-1 lg:space-x-6">
        <div class="flex space-x-1 lg:space-x-4 text-sm font-medium">
          <router-link to="/" class="px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            首页
          </router-link>
          <router-link to="/categories" class="px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            分类
          </router-link>
          <router-link to="/tags" class="px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            标签
          </router-link>
          <router-link to="/guestbook" class="px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            留言板
          </router-link>
          <router-link v-if="isAdmin" to="/admin" class="px-3 py-2 rounded-md text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
            控制台
          </router-link>
        </div>

        <div class="w-40 lg:w-48">
          <SearchBar /> 
        </div>
      </div>

      <div class="flex items-center space-x-2 lg:space-x-4">
        <button 
          @click="toggleTheme" 
          class="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
        >
          <svg v-if="isDark" class="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          <svg v-else class="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        </button>

        <div v-if="isLoggedIn" class="relative" ref="profileMenuRef">
          <button @click="toggleProfileMenu" class="flex items-center space-x-2 focus:outline-none ml-2">
             <img :src="userAvatar || '/img/default-avatar.png'" class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 object-cover" alt="Avatar">
          </button>
          
          <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-white dark:bg-[#181818] border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50 animate-fade-in-down">
            <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
              <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ userName }}</p>
            </div>
            
            <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">个人资料</router-link>
            <router-link to="/my-comments" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">我的评论</router-link>
            
            <template v-if="isAdmin">
               <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
               <router-link to="/write" class="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800">写文章</router-link>
               <router-link to="/admin" class="block px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800">管理后台</router-link>
            </template>
            
            <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800">退出登录</button>
          </div>
        </div>

        <div v-else class="flex items-center space-x-2">
          <router-link to="/login" class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors">
            登录
          </router-link>
          <router-link to="/register" class="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors shadow-lg shadow-blue-500/30">
            注册
          </router-link>
        </div>

        <button @click="toggleMobileMenu" class="md:hidden p-2 text-gray-600 dark:text-gray-300">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
      </div>
    </div>
    
    <div v-if="showMobileMenu" class="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111] px-4 py-2 shadow-lg">
       <router-link to="/" class="block py-3 text-base font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800">首页</router-link>
       <router-link to="/categories" class="block py-3 text-base font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800">分类</router-link>
       <router-link to="/tags" class="block py-3 text-base font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800">标签</router-link>
       <router-link to="/guestbook" class="block py-3 text-base font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800">留言板</router-link>
       
       <template v-if="isAdmin">
         <router-link to="/admin" class="block py-3 text-base font-medium text-purple-600 dark:text-purple-400">管理后台</router-link>
         <router-link to="/write" class="block py-3 text-base font-medium text-blue-600 dark:text-blue-400">写文章</router-link>
       </template>

       <div v-if="!isLoggedIn" class="grid grid-cols-2 gap-4 mt-4 mb-2">
         <router-link to="/login" class="text-center py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">登录</router-link>
         <router-link to="/register" class="text-center py-2 rounded-lg bg-blue-600 text-white">注册</router-link>
       </div>
    </div>
  </nav>
</template>

<script setup>
// 这里直接粘贴你上一轮对话里那个“融合后的完整代码”
// 因为逻辑完全没变，只是 Template 里的链接加回来了
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from './SearchBar.vue';

const router = useRouter();

// --- 状态定义 ---
const showMobileMenu = ref(false);
const showProfileMenu = ref(false); 
const profileMenuRef = ref(null);   
const isDark = ref(false);          

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
        isAdmin.value = userData.isAdmin === true || userData.role === 'admin';
      }
    } catch (error) {
      console.error('解析用户数据失败:', error);
      userName.value = '用户';
      userAvatar.value = null;
      isAdmin.value = false;
    }
  } else {
    userName.value = '用户';
    userAvatar.value = null;
    isAdmin.value = false;
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  isLoggedIn.value = false;
  userName.value = '用户';
  userAvatar.value = null;
  isAdmin.value = false;
  showProfileMenu.value = false; 
  router.push('/');
};

// --- 交互功能 ---
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

const handleClickOutside = (event) => {
  if (profileMenuRef.value && !profileMenuRef.value.contains(event.target)) {
    showProfileMenu.value = false;
  }
};

const handleStorageChange = (event) => {
  if (event.key === 'token' || event.key === 'user') {
    checkUserStatus();
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  }

  checkUserStatus();
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('storage', handleStorageChange);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('storage', handleStorageChange);
});
</script>

<style scoped>
/* 简单的淡入下拉动画 */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-down {
  animation: fadeInDown 0.2s ease-out forwards;
}
</style>