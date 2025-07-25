<template>
    <div class="comment-section">
      <h3 class="text-xl font-bold text-gray-800 dark:text-dark-text mb-6">评论 ({{ totalComments }})</h3>
      
      <!-- 评论列表 -->
      <div v-if="loading" class="py-4 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
      
      <div v-else-if="comments.length === 0" class="text-center py-6 text-gray-500 dark:text-dark-muted">
        暂无评论，成为第一个评论的人吧！
      </div>
      
      <div v-else class="space-y-6 mb-8">
        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :post-id="postId"
          @refresh="fetchComments"
        />
      </div>
      
      <!-- 评论输入框 -->
      <div class="border-t dark:border-dark-border pt-6">
        <h4 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4">发表评论</h4>
        
        <div v-if="!isLoggedIn" class="bg-gray-50 dark:bg-dark-card p-4 rounded text-center">
          <p class="text-gray-600 dark:text-dark-muted mb-2">登录后才能发表评论</p>
          <router-link to="/login" class="text-blue-600 dark:text-dark-accent hover:underline">
            立即登录
          </router-link>
        </div>
        
        <div v-else>
          <div class="mb-4">
            <textarea
              v-model="newComment"
              class="w-full p-3 border dark:border-dark-border bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted rounded-lg focus:ring focus:ring-blue-200 dark:focus:ring-dark-accent/50 focus:border-blue-500 dark:focus:border-dark-accent"
              rows="4"
              placeholder="写下你的评论..."
            ></textarea>
          </div>
          
          <div class="flex justify-end">
            <button 
              @click="submitComment" 
              :disabled="!newComment.trim() || submitting"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg"
            >
              <span v-if="submitting">提交中...</span>
              <span v-else>发表评论</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import CommentItem from './CommentItem.vue';
  import api from '../api';
  
  // Props
  const props = defineProps({
    postId: {
      type: [Number, String],
      required: true
    }
  });
  
  // 状态
  const comments = ref([]);
  const loading = ref(true);
  const newComment = ref('');
  const submitting = ref(false);
  const isLoggedIn = ref(false); // 这应该从全局状态或localStorage中获取
  
  // 计算属性
  const totalComments = computed(() => {
    let count = comments.value.length;
    // 添加所有回复的数量
    comments.value.forEach(comment => {
      if (comment.replies && Array.isArray(comment.replies)) {
        count += comment.replies.length;
      }
    });
    return count;
  });
  
  // 方法
  const fetchComments = async () => {
    loading.value = true;
    try {
      comments.value = await api.getPostComments(props.postId);
    } catch (error) {
      console.error('获取评论失败:', error);
      comments.value = [];
    } finally {
      loading.value = false;
    }
  };
  
  const submitComment = async () => {
    if (!newComment.value.trim() || submitting.value) return;
    
    submitting.value = true;
    try {
      await api.createComment(props.postId, { 
        content: newComment.value,
        parentId: null // 顶层评论
      });
      
      // 清空输入框并刷新评论
      newComment.value = '';
      await fetchComments();
    } catch (error) {
      console.error('提交评论失败:', error);
      alert('评论提交失败，请重试');
    } finally {
      submitting.value = false;
    }
  };
  
  // 检查用户登录状态
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    isLoggedIn.value = !!token;
  };
  
  // 生命周期钩子
  onMounted(() => {
    fetchComments();
    checkLoginStatus();
  });
  </script>