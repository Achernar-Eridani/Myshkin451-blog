<template>
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold mb-6">登录</h2>
      
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="email">邮箱</label>
          <input 
            id="email" 
            type="email" 
            v-model="email" 
            class="w-full px-3 py-2 border rounded"
            required
          >
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 mb-2" for="password">密码</label>
          <input 
            id="password" 
            type="password" 
            v-model="password" 
            class="w-full px-3 py-2 border rounded"
            required
          >
        </div>
        
        <button 
          type="submit" 
          class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          登录
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import api from '../api'
  
  export default {
    data() {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      async login() {
        try {
          const response = await api.login({
            email: this.email,
            password: this.password
          })
          
          localStorage.setItem('token', response.token)
          this.$router.push('/')
        } catch (error) {
          console.error(error)
          alert('登录失败')
        }
      }
    }
  }
  </script>