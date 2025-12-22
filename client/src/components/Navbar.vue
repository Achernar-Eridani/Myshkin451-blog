<template>
  <nav class="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-colors duration-500">
    <div class="container mx-auto px-6 h-14 flex items-center justify-between">
      
      <router-link to="/" class="flex items-baseline gap-1 group">
        <span class="font-serif text-xl font-bold tracking-tight text-gray-900 dark:text-white">Myshkin</span>
        <span class="font-mono text-sm text-blue-600 dark:text-blue-500">451</span>
      </router-link>

      <div class="hidden md:flex items-center gap-8">
        <div class="flex items-center gap-6 text-sm font-medium">
          <router-link v-for="link in navLinks" :key="link.path" :to="link.path" 
            class="relative py-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-px after:bg-black dark:after:bg-white after:transition-all hover:after:w-full">
            {{ link.name }}
          </router-link>
          
          <router-link v-if="isAdmin" to="/admin" class="text-xs font-mono text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900 px-2 py-0.5 rounded">
            CMD
          </router-link>
        </div>

        <div class="w-px h-4 bg-gray-200 dark:bg-gray-800"></div>
        <div class="w-32"><SearchBar /></div>

        <div class="flex items-center gap-4">
          <button @click="toggleTheme" class="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <svg v-if="isDark" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>

          <div v-if="isLoggedIn" class="relative" ref="profileMenuRef">
            <button @click="toggleProfileMenu" class="block w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden hover:ring-2 ring-gray-400 dark:ring-gray-600 transition-all">
               <img v-if="userAvatar" :src="userAvatar" class="w-full h-full object-cover" />
               <div v-else class="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">?</div>
            </button>
            <div v-if="showProfileMenu" class="absolute right-0 mt-3 w-40 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 shadow-2xl py-1 z-50">
                <div class="px-4 py-2 text-xs font-mono text-gray-400 border-b border-gray-100 dark:border-gray-800 mb-1">{{ userName }}</div>
                <router-link to="/profile" class="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Profile</router-link>
                <router-link v-if="isAdmin" to="/write" class="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">New Post</router-link>
                <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800">Log out</button>
            </div>
          </div>
          
          <div v-else class="flex items-center gap-3 text-sm font-medium">
            <router-link to="/login" class="hover:text-blue-600 transition-colors">Login</router-link>
            <router-link to="/register" class="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded hover:opacity-80 transition-opacity">Join</router-link>
          </div>
        </div>
      </div>
      
      <button @click="toggleMobileMenu" class="md:hidden p-2 text-gray-900 dark:text-white">
        <span class="sr-only">Menu</span>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16m-7 6h7" /></svg>
      </button>
    </div>

    <div v-if="showMobileMenu" class="md:hidden bg-white dark:bg-[#050505] border-t border-gray-100 dark:border-gray-800">
      <div class="px-6 py-4 space-y-4">
        <router-link v-for="link in navLinks" :key="link.path" :to="link.path" class="block text-lg font-serif">{{ link.name }}</router-link>
        <div v-if="!isLoggedIn" class="pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-4">
           <router-link to="/login">Login</router-link>
           <router-link to="/register" class="font-bold">Register</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from './SearchBar.vue';

const router = useRouter();
const showMobileMenu = ref(false);
const showProfileMenu = ref(false); 
const profileMenuRef = ref(null);   
const isDark = ref(false);          
const isLoggedIn = ref(false);
const userName = ref('User');
const userAvatar = ref(null);
const isAdmin = ref(false);

const navLinks = [
  { name: 'Index', path: '/' },
  { name: 'Categories', path: '/categories' }, // Changed '分类' to English for style, change back if needed
  { name: 'Tags', path: '/tags' },
  { name: 'Guestbook', path: '/guestbook' },
];

// Logic same as before...
const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

const checkUserStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
  if (isLoggedIn.value) {
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      userName.value = u.username || 'User';
      userAvatar.value = u.avatar;
      isAdmin.value = u.isAdmin === true || u.role === 'admin';
    } catch(e){}
  }
};
const logout = () => {
  localStorage.removeItem('token'); localStorage.removeItem('user');
  isLoggedIn.value = false; showProfileMenu.value = false; router.push('/');
};
const toggleMobileMenu = () => showMobileMenu.value = !showMobileMenu.value;
const toggleProfileMenu = () => showProfileMenu.value = !showProfileMenu.value;
const handleClickOutside = (e) => {
  if (profileMenuRef.value && !profileMenuRef.value.contains(e.target)) showProfileMenu.value = false;
};

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark.value);
  checkUserStatus();
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>