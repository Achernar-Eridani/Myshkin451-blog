<template>
  <div>
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">所有标签</h1>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- 无标签提示 -->
      <div v-else-if="tags.length === 0" class="bg-gray-50 rounded-lg p-8 text-center">
        <p class="text-gray-600">暂无标签</p>
      </div>

      <!-- 标签云 -->
      <div v-else class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex flex-wrap gap-3">
          <router-link
            v-for="t in tags"
            v-if="t.slug"
            :key="t.id"
            :to="`/tags/${encodeURIComponent(t.slug)}`"
            class="inline-block px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition duration-300 text-base"
            :style="getTagStyle(t)"
          >
            # {{ t.name }}
            <span class="text-gray-500 text-sm ml-1">({{ t.postCount || 0 }})</span>
          </router-link>

          <!-- slug 为空时禁用点击 -->
          <span
            v-else
            :key="`noslug-${t.id}`"
            class="inline-block px-4 py-2 rounded bg-gray-50 text-gray-400 text-base cursor-not-allowed"
            :style="getTagStyle(t)"
          >
            # {{ t.name }}
            <span class="text-gray-400 text-sm ml-1">({{ t.postCount || 0 }})</span>
          </span>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import api from '../api'

const tags = ref([])
const loading = ref(true)

const fetchTags = async () => {
  try {
    loading.value = true
    const response = await api.getTags()
    tags.value = response || []
  } catch (err) {
    console.error('获取标签失败:', err)
    tags.value = []
  } finally {
    loading.value = false
  }
}

const getTagStyle = t => {
  const count = t.postCount || 0
  let fontSize = 1
  if (count > 10) fontSize = 1.5
  else if (count > 5) fontSize = 1.25
  else if (count > 2) fontSize = 1.1
  return {
    fontSize: `${fontSize}rem`,
    backgroundColor: count > 5 ? '#e6f2ff' : undefined
  }
}

onMounted(() => {
  fetchTags()
})
</script>
