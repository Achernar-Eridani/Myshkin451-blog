<template>
    <div class="markdown-editor">
      <label v-if="label" class="block text-gray-700 text-sm font-bold mb-2">{{ label }}</label>
      <Editor
        :value="modelValue"
        @change="$emit('update:modelValue', $event)"
        :plugins="plugins"
        :locale="locale"
      />
    </div>
  </template>
  
  <script setup>
  import { Editor } from '@bytemd/vue-next';
  import gfm from '@bytemd/plugin-gfm';
  import highlight from '@bytemd/plugin-highlight';
  import 'bytemd/dist/index.css';
  
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
  </script>
  
  <style scoped>
  .markdown-editor :deep(.bytemd) {
    height: 500px;
  }
  </style>