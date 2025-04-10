<template>
    <div>
      <Navbar />
      <div class="container mx-auto px-4 py-12 text-center">
        <h1 class="text-3xl font-bold mb-4">页面开发中</h1>
        <p class="text-lg text-gray-600">这个功能正在开发中，敬请期待！</p>
        <router-link to="/" class="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          返回首页
        </router-link>
      </div>
      <Footer />
    </div>
  </template>
  
  <script setup>
  import Navbar from '../components/Navbar.vue';
  import Footer from '../components/Footer.vue';
  </script>