<template>
    <div class="image-uploader">
      <!-- 预览区域 -->
      <div v-if="imageUrl" class="mb-3">
        <img 
          :src="imageUrl" 
          :alt="label" 
          class="max-h-48 rounded-lg border shadow-sm object-cover"
        >
        <button 
          @click="removeImage" 
          class="mt-2 text-red-600 text-sm hover:text-red-800"
        >
          删除图片
        </button>
      </div>
      
      <!-- 上传区域 -->
      <div 
        v-if="!imageUrl || allowReplace" 
        class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors"
        :class="{ 'cursor-pointer': !uploading }"
        @click="!uploading && triggerFileInput()"
        @dragover.prevent="dragover = true"
        @dragleave.prevent="dragover = false"
        @drop.prevent="onDrop"
        :style="dropzoneStyle"
      >
        <input 
          type="file" 
          ref="fileInput" 
          @change="onFileChange" 
          class="hidden" 
          accept="image/*"
        >
        
        <div v-if="uploading">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p class="text-gray-600">上传中...</p>
        </div>
        
        <div v-else>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-gray-600 mb-1">{{ label || '点击或拖放图片到此处上传' }}</p>
          <p class="text-gray-500 text-xs">支持JPG、PNG、GIF格式，最大5MB</p>
        </div>
      </div>
      
      <!-- 错误提示 -->
      <div v-if="error" class="mt-2 text-red-600 text-sm">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import api from '../api';
  
  // Props
  const props = defineProps({
    value: String,
    label: String,
    uploadType: {
      type: String,
      default: 'post', // 'post' 或 'avatar'
    },
    allowReplace: {
      type: Boolean,
      default: true
    },
    postId: {
      type: [Number, String],
      default: null
    }
  });
  
  // Emits
  const emit = defineEmits(['update:value', 'upload-success', 'upload-error']);
  
  // 状态
  const imageUrl = ref(props.value || '');
  const uploading = ref(false);
  const error = ref('');
  const fileInput = ref(null);
  const dragover = ref(false);
  
  // 计算属性
  const dropzoneStyle = computed(() => {
    return dragover.value ? 'border-color: #3b82f6; background-color: rgba(59, 130, 246, 0.05);' : '';
  });
  
  // 方法
  const triggerFileInput = () => {
    fileInput.value.click();
  };
  
  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadImage(file);
    }
    // 重置input，确保相同文件可以再次上传
    event.target.value = null;
  };
  
  const onDrop = (event) => {
    dragover.value = false;
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadImage(file);
    } else {
      error.value = '请上传有效的图片文件';
    }
  };
  
  const uploadImage = async (file) => {
    // 验证文件类型和大小
    if (!file.type.match('image.*')) {
      error.value = '请上传有效的图片文件';
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      error.value = '图片大小不能超过5MB';
      return;
    }
    
    error.value = '';
    uploading.value = true;
    
    try {
      // 创建表单数据
      const formData = new FormData();
      formData.append('image', file);
      
      let response;
      
      if (props.uploadType === 'avatar') {
        // 上传头像
        response = await api.uploadAvatar(formData);
      } else if (props.postId) {
        // 上传文章封面
        response = await api.uploadPostCover(props.postId, formData);
      } else {
        // 上传普通文章图片
        response = await api.uploadPostImage(formData);
      }
      
      // 更新图片URL
      imageUrl.value = response.imageUrl || response.url || response.path;
      emit('update:value', imageUrl.value);
      emit('upload-success', imageUrl.value);
      
    } catch (err) {
      console.error('图片上传失败:', err);
      error.value = '图片上传失败，请重试';
      emit('upload-error', err);
    } finally {
      uploading.value = false;
    }
  };
  
  const removeImage = () => {
    imageUrl.value = '';
    emit('update:value', '');
  };
  </script>