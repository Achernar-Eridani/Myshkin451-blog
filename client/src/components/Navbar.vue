<template>
  <nav class="bg-white shadow-sm border-b">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- 网站Logo/标题 -->
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-gray-800">
            Myshkin451博客
          </router-link>
        </div>
        
        <!-- 桌面端导航链接 -->
        <div class="hidden md:flex items-center space-x-4">
          <router-link to="/" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">
            首页
          </router-link>
          <router-link to="/categories" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">
            分类
          </router-link>
          <router-link to="/tags" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">
            标签
          </router-link>
          <router-link to="/guestbook" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">
            留言板
          </router-link>
          
          <!-- 搜索功能(预留) -->
          <!-- 在桌面端导航链接部分添加 -->
          <div class="relative hidden md:block w-64">
            <SearchBar />
          </div>
          
          <!-- 登录/注册或用户菜单 -->
          <template v-if="isLoggedIn">
            <div class="relative" ref="profileMenuRef">
              <button @click="toggleProfileMenu" class="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none">
                <img :src="userAvatar || '/img/default-avatar.png'" alt="用户头像" class="w-8 h-8 rounded-full mr-2">
                <span>{{ userName }}</span>
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- 下拉菜单 -->
              <div v-if="showProfileMenu" 
                   class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <router-link to="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  个人资料
                </router-link>
                <router-link to="/my-comments" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  我的评论
                </router-link>
                <!-- 根据用户角色显示不同选项 -->
                <template v-if="isAdmin">
                  <div class="border-t border-gray-100 my-1"></div>
                  <router-link to="/write" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    写文章
                  </router-link>
                  <router-link to="/admin/dashboard" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    管理后台
                  </router-link>
                </template>
                <div class="border-t border-gray-100 my-1"></div>
                <button @click="logout" class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                  退出登录
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">
              登录
            </router-link>
            <router-link to="/register" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              注册
            </router-link>
          </template>
        </div>
        
        <!-- 移动端菜单按钮 -->
        <div class="md:hidden flex items-center">
          <button @click="toggleMobileMenu" class="text-gray-600 hover:text-gray-900 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 移动端菜单 -->
      <div v-if="showMobileMenu" class="md:hidden py-3 border-t">
        <router-link to="/" class="block px-4 py-2 text-gray-600 hover:text-gray-900">
          首页
        </router-link>
        <router-link to="/categories" class="block px-4 py-2 text-gray-600 hover:text-gray-900">
          分类
        </router-link>
        <router-link to="/tags" class="block px-4 py-2 text-gray-600 hover:text-gray-900">
          标签
        </router-link>
        <router-link to="/guestbook" class="block px-4 py-2 text-gray-600 hover:text-gray-900">
          留言板
        </router-link>
        
        <template v-if="isLoggedIn">
          <router-link to="/profile" class="block px-4 py-2 text-gray-600 hover:text-gray-900">
            个人资料
          </router-link>
          <router-link to="/my-comments" class="block px-4 py-2 text-gray-600 hover:text-gray-900">
            我的评论
          </router-link>
          <!-- 管理员选项 -->
          <template v-if="isAdmin">
            <div class="border-t border-gray-100 my-1"></div>
            <router-link to="/write" class="block px-4 py-2 text-gray-600 hover:text-gray-900">
              写文章
            </router-link>
            <router-link to="/admin/dashboard" class="block px-4 py-2 text-gray-600 hover:text-gray-900">
              管理后台
            </router-link>
          </template>
          <div class="border-t border-gray-100 my-1"></div>
          <button @click="logout" class="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900">
            退出登录
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="block px-4 py-2 text-gray-600 hover:text-gray-900">
            登录
          </router-link>
          <router-link to="/register" class="block px-4 py-2 text-gray-600 hover:text-gray-900">
            注册
          </router-link>
        </template>
      </div>
    </div>
    
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from './SearchBar.vue';


const router = useRouter();

// 状态
const showMobileMenu = ref(false);
const showProfileMenu = ref(false);
const profileMenuRef = ref(null);

// 用户状态
const isLoggedIn = ref(false);
const userName = ref('用户');
const userAvatar = ref(null);
const isAdmin = ref(false);

// 检查登录状态和用户信息
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
        
        // 检查用户角色 (假设用户数据中有isAdmin或role字段)
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
    // 未登录时重置用户状态
    userName.value = '用户';
    userAvatar.value = null;
    isAdmin.value = false;
  }
};

// 方法
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // 重置状态
  isLoggedIn.value = false;
  userName.value = '用户';
  userAvatar.value = null;
  isAdmin.value = false;
  showProfileMenu.value = false;
  
  // 重定向到首页
  router.push('/');
};

// 点击外部关闭个人菜单
const handleClickOutside = (event) => {
  if (profileMenuRef.value && !profileMenuRef.value.contains(event.target)) {
    showProfileMenu.value = false;
  }
};

// 监听localStorage变化 (仅在同一页面内有效)
window.addEventListener('storage', (event) => {
  if (event.key === 'token' || event.key === 'user') {
    checkUserStatus();
  }
});

// 组件挂载和卸载时的事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  checkUserStatus(); // 初始检查
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>