<template>
  <div class="markdown-editor">
    <label v-if="label" class="block text-gray-700 text-sm font-bold mb-2">{{ label }}</label>
    <Editor
      :value="modelValue"
      @change="$emit('update:modelValue', $event)"
      :plugins="plugins"
      :locale="locale"
      :uploadImages="uploadImageHandler"
    />
  </div>
</template>

<script setup>
import { Editor } from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import 'bytemd/dist/index.css';
import api from '../api';

// 组件属性
const props = defineProps({
  modelValue: String,
  label: String
});

// 组件事件
const emit = defineEmits(['update:modelValue']);

// 编辑器配置
const plugins = [
  gfm(),
  highlight()
];

const locale = {
  write: '编辑',
  preview: '预览',
  uploadImage: '上传图片'
};

// 图片上传处理函数
const uploadImageHandler = async (files) => {
  const results = [];
  
  for (const file of files) {
    try {
      // 创建FormData
      const formData = new FormData();
      formData.append('image', file);
      
      // 上传图片
      const response = await api.uploadPostImage(formData);
      
      // 返回图片URL
      results.push({
        url: response.imageUrl || response.url || response.path,
        alt: file.name
      });
    } catch (error) {
      console.error('图片上传失败:', error);
    }
  }
  
  return results;
};
</script>

<style scoped>
.markdown-editor :deep(.bytemd) {
  height: 500px;
}
</style>