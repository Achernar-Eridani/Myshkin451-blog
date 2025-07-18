<template>
    <div class="flex justify-center my-6">
      <nav class="inline-flex rounded-md shadow">
        <!-- 上一页按钮 -->
        <button 
          @click="onPageChange(currentPage - 1)" 
          :disabled="currentPage === 1"
          :class="['px-3 py-2 rounded-l-md border dark:border-dark-border', 
                  currentPage === 1 
                    ? 'bg-gray-100 dark:bg-dark-card text-gray-400 dark:text-dark-muted cursor-not-allowed' 
                    : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-card']">
          上一页
        </button>
        
        <!-- 页码按钮 -->
        <template v-for="page in displayedPages" :key="page">
          <button 
            v-if="page === '...'"
            class="px-3 py-2 border dark:border-dark-border bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text">
            {{ page }}
          </button>
          <button 
            v-else
            @click="onPageChange(page)"
            :class="['px-3 py-2 border dark:border-dark-border', 
                    currentPage === page 
                      ? 'bg-blue-600 dark:bg-dark-accent text-white border-blue-600 dark:border-dark-accent' 
                      : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-card']">
            {{ page }}
          </button>
        </template>
        
        <!-- 下一页按钮 -->
        <button 
          @click="onPageChange(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          :class="['px-3 py-2 rounded-r-md border dark:border-dark-border', 
                  currentPage === totalPages 
                    ? 'bg-gray-100 dark:bg-dark-card text-gray-400 dark:text-dark-muted cursor-not-allowed' 
                    : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-card']">
          下一页
        </button>
      </nav>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, computed } from 'vue';
  
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  });
  
  const emit = defineEmits(['page-change']);
  
  // 计算要显示的页码
  const displayedPages = computed(() => {
    const pages = [];
    const maxVisible = 5; // 最多显示的页码数
    
    if (props.totalPages <= maxVisible) {
      // 总页数较少，显示所有页码
      for (let i = 1; i <= props.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 总页数较多，显示部分页码
      const leftBound = Math.max(1, props.currentPage - 1);
      const rightBound = Math.min(props.totalPages, props.currentPage + 1);
      
      // 起始页码
      if (leftBound > 1) {
        pages.push(1);
        if (leftBound > 2) {
          pages.push('...');
        }
      }
      
      // 中间页码
      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }
      
      // 结束页码
      if (rightBound < props.totalPages) {
        if (rightBound < props.totalPages - 1) {
          pages.push('...');
        }
        pages.push(props.totalPages);
      }
    }
    
    return pages;
  });
  
  // 页码变化处理
  const onPageChange = (page) => {
    if (page < 1 || page > props.totalPages || page === props.currentPage) {
      return;
    }
    emit('page-change', page);
  };
  </script>