<template>
    <div class="comment-item border-b dark:border-dark-border pb-4 last:border-b-0 last:pb-0">
      <!-- 主评论内容 -->
      <div class="flex space-x-4">
        <!-- 用户头像 -->
        <div class="flex-shrink-0">
          <img 
            v-if="comment.user?.avatar" 
            :src="comment.user.avatar" 
            alt="用户头像" 
            class="w-10 h-10 rounded-full object-cover"
          >
          <div v-else class="w-10 h-10 rounded-full bg-gray-300 dark:bg-dark-card flex items-center justify-center text-gray-600 dark:text-dark-muted">
            {{ comment.user?.username?.[0] || '?' }}
          </div>
        </div>
        
        <!-- 评论内容 -->
        <div class="flex-grow">
          <div class="flex items-center mb-1">
            <span class="font-semibold text-gray-800 dark:text-dark-text">{{ comment.user?.username || '未知用户' }}</span>
            <span class="text-xs text-gray-500 dark:text-dark-muted ml-2">{{ formatDate(comment.createdAt) }}</span>
          </div>
          
          <!-- 编辑模式 -->
          <div v-if="isEditing" class="mb-2">
            <textarea
              v-model="editContent"
              class="w-full p-2 border dark:border-dark-border bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text rounded focus:ring focus:ring-blue-200 dark:focus:ring-dark-accent/50 focus:border-blue-500 dark:focus:border-dark-accent"
              rows="3"
            ></textarea>
            <div class="flex justify-end space-x-2 mt-2">
              <button 
                @click="isEditing = false" 
                class="px-3 py-1 bg-gray-200 dark:bg-dark-card hover:bg-gray-300 dark:hover:bg-dark-card/80 text-gray-700 dark:text-dark-text rounded"
              >
                取消
              </button>
              <button 
                @click="updateComment" 
                :disabled="submitting"
                class="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded"
              >
                保存
              </button>
            </div>
          </div>
          
          <!-- 普通显示模式 -->
          <p v-else class="text-gray-700 dark:text-dark-text mb-2">{{ comment.content }}</p>
          
          <!-- 操作按钮 -->
          <div class="flex space-x-4 text-sm text-gray-500 dark:text-dark-muted">
            <button 
              v-if="!isEditing" 
              @click="toggleReplyForm" 
              class="hover:text-blue-600 dark:hover:text-dark-accent"
            >
              回复
            </button>
            <button 
              v-if="canEdit && !isEditing" 
              @click="startEditing" 
              class="hover:text-blue-600 dark:hover:text-dark-accent"
            >
              编辑
            </button>
            <button 
              v-if="canEdit && !isEditing" 
              @click="confirmDelete" 
              class="hover:text-red-600 dark:hover:text-red-400"
            >
              删除
            </button>
          </div>
          
          <!-- 回复表单 -->
          <div v-if="showReplyForm" class="mt-4">
            <textarea
              v-model="replyContent"
              class="w-full p-2 border dark:border-dark-border bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted rounded focus:ring focus:ring-blue-200 dark:focus:ring-dark-accent/50 focus:border-blue-500 dark:focus:border-dark-accent"
              rows="2"
              placeholder="写下你的回复..."
            ></textarea>
            <div class="flex justify-end space-x-2 mt-2">
              <button 
                @click="showReplyForm = false" 
                class="px-3 py-1 bg-gray-200 dark:bg-dark-card hover:bg-gray-300 dark:hover:bg-dark-card/80 text-gray-700 dark:text-dark-text rounded"
              >
                取消
              </button>
              <button 
                @click="submitReply" 
                :disabled="!replyContent.trim() || submitting"
                class="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded"
              >
                回复
              </button>
            </div>
          </div>
          
          <!-- 嵌套回复 -->
          <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 pl-4 border-l-2 border-gray-200 dark:border-dark-border space-y-4">
            <!-- 递归显示每条回复 -->
            <div v-for="reply in comment.replies" :key="reply.id" class="py-2">
              <div class="flex space-x-3">
                <!-- 回复用户头像 -->
                <div class="flex-shrink-0">
                  <img 
                    v-if="reply.user?.avatar" 
                    :src="reply.user.avatar" 
                    alt="用户头像" 
                    class="w-8 h-8 rounded-full object-cover"
                  >
                  <div v-else class="w-8 h-8 rounded-full bg-gray-300 dark:bg-dark-card flex items-center justify-center text-gray-600 dark:text-dark-muted text-sm">
                    {{ reply.user?.username?.[0] || '?' }}
                  </div>
                </div>
                
                <!-- 回复内容 -->
                <div class="flex-grow">
                  <div class="flex items-center mb-1">
                    <span class="font-semibold text-gray-800 dark:text-dark-text">{{ reply.user?.username || '未知用户' }}</span>
                    <span class="text-xs text-gray-500 dark:text-dark-muted ml-2">{{ formatDate(reply.createdAt) }}</span>
                  </div>
                  <p class="text-gray-700 dark:text-dark-text">{{ reply.content }}</p>
                  
                  <!-- 回复的操作按钮 -->
                  <div v-if="isLoggedIn" class="flex space-x-4 text-xs text-gray-500 dark:text-dark-muted mt-1">
                    <button 
                      @click="toggleReplyForm" 
                      class="hover:text-blue-600 dark:hover:text-dark-accent"
                    >
                      回复
                    </button>
                    <button 
                      v-if="isCurrentUser(reply.userId)" 
                      @click="confirmDeleteReply(reply.id)" 
                      class="hover:text-red-600 dark:hover:text-red-400"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import api from '../api';
  
  // Props
  const props = defineProps({
    comment: {
      type: Object,
      required: true
    },
    postId: {
      type: [Number, String],
      required: true
    }
  });
  
  // Emits
  const emit = defineEmits(['refresh']);
  
  // 状态
  const isEditing = ref(false);
  const editContent = ref(props.comment.content || '');
  const showReplyForm = ref(false);
  const replyContent = ref('');
  const submitting = ref(false);
  
  // 用户相关状态（应从全局状态或本地存储获取）
  const currentUserId = ref(null); // 这里应该从认证状态中获取当前用户ID
  const isLoggedIn = ref(false);
  
  // 初始化检查登录状态
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    isLoggedIn.value = !!token;
    
    // 这里应该从localStorage或状态管理中获取用户ID
    // 假设用户信息存储在localStorage的user字段中
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        currentUserId.value = user.id;
      }
    } catch (e) {
      console.error('解析用户信息失败', e);
    }
  };
  
  // 调用初始化函数
  checkLoginStatus();
  
  // 计算属性
  const canEdit = computed(() => {
    return isCurrentUser(props.comment.userId);
  });
  
  // 方法
  const isCurrentUser = (userId) => {
    return currentUserId.value && currentUserId.value === userId;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const toggleReplyForm = () => {
    if (!isLoggedIn.value) {
      alert('请先登录再回复评论');
      return;
    }
    showReplyForm.value = !showReplyForm.value;
    if (!showReplyForm.value) {
      replyContent.value = '';
    }
  };
  
  const startEditing = () => {
    editContent.value = props.comment.content || '';
    isEditing.value = true;
  };
  
  const updateComment = async () => {
    if (!editContent.value.trim() || submitting.value) return;
    
    submitting.value = true;
    try {
      await api.updateComment(props.comment.id, editContent.value);
      isEditing.value = false;
      emit('refresh');
    } catch (error) {
      console.error('更新评论失败:', error);
      alert('评论更新失败，请重试');
    } finally {
      submitting.value = false;
    }
  };
  
  const confirmDelete = () => {
    if (confirm('确定要删除这条评论吗？此操作不可撤销，评论下的所有回复也将被删除。')) {
      deleteComment();
    }
  };
  
  const deleteComment = async () => {
    submitting.value = true;
    try {
      await api.deleteComment(props.comment.id);
      emit('refresh');
    } catch (error) {
      console.error('删除评论失败:', error);
      alert('评论删除失败，请重试');
    } finally {
      submitting.value = false;
    }
  };
  
  const confirmDeleteReply = (replyId) => {
    if (confirm('确定要删除这条回复吗？此操作不可撤销。')) {
      deleteReply(replyId);
    }
  };
  
  const deleteReply = async (replyId) => {
    submitting.value = true;
    try {
      await api.deleteComment(replyId);
      emit('refresh');
    } catch (error) {
      console.error('删除回复失败:', error);
      alert('回复删除失败，请重试');
    } finally {
      submitting.value = false;
    }
  };
  
  const submitReply = async () => {
    if (!replyContent.value.trim() || submitting.value) return;
    
    submitting.value = true;
    try {
      await api.createComment(props.postId, {
        content: replyContent.value,
        parentId: props.comment.id
      });
      
      replyContent.value = '';
      showReplyForm.value = false;
      emit('refresh');
    } catch (error) {
      console.error('提交回复失败:', error);
      alert('回复提交失败，请重试');
    } finally {
      submitting.value = false;
    }
  };
  </script>