<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Myshkin451的技术博客</h1>
      
      <div v-if="loading">
        <p>加载中...</p>
      </div>
      
      <div v-else>
        <div v-for="post in posts" :key="post.id" class="mb-6">
          <h2 class="text-xl font-bold">{{ post.title }}</h2>
          <p>{{ post.excerpt || post.content.substring(0, 150) + '...' }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../api'
  
  export default {
    data() {
      return {
        posts: [],
        loading: true
      }
    },
    async mounted() {
      try {
        this.posts = await api.getPosts()
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
  </script>